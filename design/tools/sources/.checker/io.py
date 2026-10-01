from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

from lxml import etree

from .model import (
    Diagnostic,
    RegistryModel,
    natural_key,
    parse_rules,
    q,
    resolve_reference,
)
from .registry import expand_targets
from .report import Report

# ---------------------------------------------------------------------------
# Model building (manifest.xml -> RegistryModel)
# ---------------------------------------------------------------------------


def build_model(root: Path, manifest_path: Path) -> RegistryModel:
    manifest_dir = manifest_path.resolve().parent
    tree = etree.parse(str(manifest_path))
    mroot = tree.getroot()

    # The registers are exactly the <index> register names (tokens, themes):
    # the manifest no longer carries a uiElement nomenclature/contract.
    registers = [
        (el.get("name") or "").strip()
        for el in mroot.findall(q("index") + "/" + q("register"))
    ]
    reserves: list[str] = []
    index: dict[str, list[str]] = {}
    for reg_el in mroot.findall(q("index") + "/" + q("register")):
        index[reg_el.get("name")] = [
            (item.text or "").strip() for item in reg_el.findall(q("item"))
        ]

    catalog_files: dict[str, Path] = {}
    for catalog in mroot.findall(q("catalogs") + "/" + q("catalog")):
        reg = catalog.get("register")
        file_el = catalog.find(q("file"))
        if file_el is not None and file_el.text:
            catalog_files[reg] = (manifest_dir / file_el.text.strip()).resolve()

    token_values: dict[str, dict[str, str]] = {}
    theme_roles: dict[str, dict[str, str]] = {}
    for path in catalog_files.values():
        if not path.exists():
            continue
        doc = etree.parse(str(path))
        for token in doc.iter(q("token")):
            tid = token.get("id")
            values = {}
            for value in token.iter(q("value")):
                values[value.get("id")] = (value.text or "").strip()
            token_values[tid] = values
        for theme in doc.iter(q("theme")):
            tid = theme.get("id")
            roles = {}
            for role in theme.iter(q("role")):
                ref_el = role.find(q("ref"))
                roles[role.get("id")] = (ref_el.text or "").strip() if ref_el is not None else ""
            theme_roles[tid] = roles

    # The ONE version of this repository: the root package.json, i.e. exactly
    # what gets published. The registry stores no copy on purpose -- a second
    # copy drifts silently (e.g. `changeset version` bumps package.json only).
    version = ""
    package_json = Path(root) / "package.json"
    if package_json.exists():
        try:
            version = json.loads(package_json.read_text(encoding="utf-8")).get("version", "") or ""
        except (ValueError, OSError):
            version = ""
    return RegistryModel(
        root=Path(root),
        manifest_path=manifest_path.resolve(),
        registers=registers,
        reserves=reserves,
        index=index,
        catalog_files=catalog_files,
        token_values=token_values,
        theme_roles=theme_roles,
        rules=parse_rules(mroot),
        version=version,
        schema_id=mroot.get("schema") or "",
    )


# ---------------------------------------------------------------------------
# Canonical index (the deterministic artifact)
# ---------------------------------------------------------------------------


def canonical_payload(ctx: RegistryModel) -> tuple:
    """Deterministic canonical view: entries sorted by (register, id), refs resolved."""
    entries: list[str] = []
    register_names = sorted(ctx.registers, key=natural_key)
    for reg in register_names:
        if reg in ctx.catalog_files and ctx.catalog_files[reg].exists():
            if reg == "tokens":
                ids = sorted(ctx.token_values.keys(), key=natural_key)
            elif reg == "themes":
                ids = sorted(ctx.theme_roles.keys(), key=natural_key)
            else:
                ids = sorted(ctx.index.get(reg, []), key=natural_key)
        else:
            ids = sorted(ctx.index.get(reg, []), key=natural_key)
        for ident in ids:
            entries.append(f"{reg}/{ident}")

    refs: dict[str, str] = {}
    for path in ctx.catalog_files.values():
        if not path.exists():
            continue
        doc = etree.parse(str(path))
        for elem in doc.iter(q("ref")):
            ref = (elem.text or "").strip()
            if ref and resolve_reference(ctx, ref):
                refs[ref] = resolve_reference_value(ctx, ref)
    ref_lines = [f"{ref} -> {refs[ref]}" for ref in sorted(refs, key=natural_key)]
    return entries, ref_lines


def resolve_reference_value(ctx: RegistryModel, ref: str) -> str:

    parts = ref.split(".")
    if ref.startswith("$ref."):
        parts = ref[len("$ref."):].split(".")
    if parts and parts[0] in ctx.registers:
        parts = parts[1:]
    item_id = parts[0]
    path = parts[1:]
    if item_id in ctx.token_values:
        return ctx.token_values[item_id].get(".".join(path), "?")
    return "?"


def canonical_document(ctx: RegistryModel) -> str:
    entries, ref_lines = canonical_payload(ctx)
    body = "\n".join(entries)
    digest = hashlib.sha256(body.encode("utf-8")).hexdigest()
    lines = [
        "# Flipova Foundation — canonical registry index (deterministic artifact)",
        "# generated by design/tools/sources/checker.py --emit-canonical",
        "# commit this file: --verify-canonical fails the build when the registry drifts.",
        "",
        "# entries (register/id) — canonical sort by (register, id)",
        *entries,
        "",
        "## references (resolved, never dangling)",
        *ref_lines,
        "",
        "## sha256",
        digest,
    ]
    return "\n".join(lines) + "\n"


def _root_start_tag(data: bytes) -> int | None:
    """Byte offset of the root element start tag ('<' not inside prolog/comment)."""
    idx = 0
    while True:
        idx = data.find(b"<", idx)
        if idx == -1:
            return None
        head = data[idx:idx + 4]
        if head.startswith(b"<?"):
            idx = data.find(b"?>", idx) + 1
        elif head.startswith(b"<!--"):
            idx = data.find(b"-->", idx) + 3
        elif head.startswith(b"<!"):
            idx = data.find(b">", idx) + 1
        elif head.startswith(b"</"):
            idx += 2
        else:
            return idx


def sync_versions(ctx: RegistryModel) -> int:
    """Rewrite @schema on every root start tag to the manifest value.

    Only @schema is synchronised: the project version is owned by the root
    package.json and is deliberately never duplicated in the XML.
    """
    count = 0
    for path in expand_targets(ctx.root, "*.xml"):
        try:
            data = path.read_bytes()
        except OSError:
            continue
        start = _root_start_tag(data)
        if start is None:
            continue
        end = data.find(b">", start)
        if end == -1:
            continue
        tag = data[start:end]
        new = tag
        if ctx.schema_id:
            new = re.sub(rb'(\bschema=")[^"]*(")',
                         lambda m: m.group(1) + ctx.schema_id.encode("utf-8") + m.group(2), new)
        if new != tag:
            path.write_bytes(data[:start] + new + data[end:])
            print(f"  synced {path}")
            count += 1
    return count


# ---------------------------------------------------------------------------
# XSD conformance (delegated to the AGNOSTIC linter)
# ---------------------------------------------------------------------------


def validate_xsd(ctx: RegistryModel, schema_path: Path, verbose: bool) -> Report:
    import sys as _sys
    from pathlib import Path as _Path

    _sys.path.insert(0, str(_Path(__file__).resolve().parents[1]))
    from linter import XSDLinter

    report = Report()
    linter = XSDLinter(schema_path=str(schema_path))
    files = [ctx.manifest_path, *ctx.catalog_files.values()]
    for path in files:
        result = linter.validate_file(str(path))
        for err in result.errors:
            severity = err.severity or "error"
            report.diagnostics.append(Diagnostic(
                rule_id="xsd",
                severity=severity,
                file=err.file,
                line=err.line,
                message=err.message,
            ))
    return report
