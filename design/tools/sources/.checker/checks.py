from __future__ import annotations

import re
from pathlib import Path

from lxml import etree

from .model import RegistryModel, Rule, localname
from .registry import register
from .report import Report

# ---------------------------------------------------------------------------
# kind: ids
# ---------------------------------------------------------------------------

NON_ASCII_RE = re.compile(r"[^\x00-\x7F]")
TIMESTAMP_RE = re.compile(
    r"\b\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2})?(?:Zz|[+-]\d{2}:?\d{2})?"
    r"|\b\d{4}-\d{2}-\d{2}\b"
    r"|\b1[5-9]\d{8}\b"
)


@register("ids")
def handler_ids(ctx: RegistryModel, rule: Rule, targets: list[Path], report: Report) -> None:
    pattern = rule.get("pattern") or r"^[A-Za-z][A-Za-z0-9]*$"
    selectors = set(rule.get_list("selectors", ["token", "theme", "role", "item", "register"]))
    regex = re.compile(pattern)
    for path in targets:
        doc = etree.parse(str(path))
        for elem in doc.iter():
            name = localname(elem.tag)
            if name not in selectors:
                continue
            ident = elem.get("id")
            if ident is None:
                ident = elem.get("register") or elem.get("name")
            if ident is None and name in ("item", "field", "key", "register"):
                ident = (elem.text or "").strip()
            if not ident:
                continue
            if not regex.fullmatch(ident):
                report.add(rule, str(path), elem.sourceline,
                           f"id {ident!r} violates stable-slug pattern {pattern!r} (explicit uid, otherwise stable slug)")
            if ident in ctx.reserves:
                report.add(rule, str(path), elem.sourceline,
                           "id {!r} is a reserved word ({})".format(ident, ", ".join(ctx.reserves)))


# ---------------------------------------------------------------------------
# kind: ordering
# ---------------------------------------------------------------------------


@register("ordering")
def handler_ordering(ctx: RegistryModel, rule: Rule, targets: list[Path], report: Report) -> None:
    mode = rule.get("mode") or "registers"
    if mode == "registers":
        _check_register_order(ctx, rule, report)
    elif mode == "siblings":
        selectors = rule.get_list("selectors", [])
        for path in targets:
            _check_sibling_order(path, rule, selectors, report)
    else:
        report.add(rule, ctx.manifest_path.name, None,
                   f"unknown ordering mode {mode!r} (expected 'registers' or 'siblings')")


def _check_register_order(ctx: RegistryModel, rule: Rule, report: Report) -> None:
    from .registry import _check_register_order as impl

    impl(ctx, rule, report)


def _check_sibling_order(path: Path, rule: Rule, selectors: list[str], report: Report) -> None:
    from .registry import _check_sibling_order as impl

    impl(path, rule, selectors, report)


# ---------------------------------------------------------------------------
# kind: references
# ---------------------------------------------------------------------------


@register("references")
def handler_references(ctx: RegistryModel, rule: Rule, targets: list[Path], report: Report) -> None:
    from .model import resolve_reference

    pattern = rule.get("pattern")
    regex = re.compile(pattern) if pattern else None
    for path in targets:
        doc = etree.parse(str(path))
        for elem in doc.iter():
            if localname(elem.tag) != "ref":
                continue
            ref = (elem.text or "").strip()
            if not ref:
                continue
            if regex and not regex.fullmatch(ref):
                report.add(rule, str(path), elem.sourceline,
                           f"reference {ref!r} violates format pattern {pattern!r} (expected $ref.<register>.<id>.<path> or <id>.<path>)")
            if not resolve_reference(ctx, ref):
                report.add(rule, str(path), elem.sourceline,
                           f"dangling reference {ref!r}: no token value matches (never implicit links)")


# ---------------------------------------------------------------------------
# kind: timestamps
# ---------------------------------------------------------------------------


@register("timestamps")
def handler_timestamps(ctx: RegistryModel, rule: Rule, targets: list[Path], report: Report) -> None:
    for path in targets:
        doc = etree.parse(str(path))
        for elem in doc.iter():
            values = []
            if elem.text and elem.text.strip():
                values.append(elem.text)
            values.extend(attr for attr in elem.attrib.values() if attr and attr.strip())
            for value in values:
                match = TIMESTAMP_RE.search(value)
                if match:
                    report.add(rule, str(path), elem.sourceline,
                               f"timestamp forbidden: found {match.group(0)!r} (bit-identical rebuilds require no date/time literal)")


# ---------------------------------------------------------------------------
# kind: locale
# ---------------------------------------------------------------------------


@register("locale")
def handler_locale(ctx: RegistryModel, rule: Rule, targets: list[Path], report: Report) -> None:
    # Free-text elements are documentation/labels, not identifiers or design
    # values: they may be localized/prose and are exempt (manifest-declared).
    exempt_tags = set(rule.get_list("exemptTags", ["label", "description", "content"]))
    # Optional manifest-declared exempt subtrees (none by default).
    exempt_subtrees = set(rule.get_list("exemptSubtrees", []))
    # Prose attribute names (example/showcase titles & descriptions).
    exempt_attrs = set(rule.get_list("exemptAttrs", ["title", "description"]))
    for path in targets:
        doc = etree.parse(str(path))
        for elem in doc.iter():
            if localname(elem.tag) in exempt_tags:
                continue
            parent = elem.getparent()
            in_subtree = False
            while parent is not None:
                if localname(parent.tag) in exempt_subtrees:
                    in_subtree = True
                    break
                parent = parent.getparent()
            if in_subtree:
                continue
            values = []
            if elem.text and elem.text.strip():
                values.append(elem.text)
            for attr_name, attr in elem.attrib.items():
                if not attr or not attr.strip():
                    continue
                if localname(attr_name) in exempt_attrs:
                    continue
                # static:<payload> binds are display literals, not identifiers.
                if attr.startswith("static:"):
                    attr = "static:"
                values.append(attr)
            for value in values:
                match = NON_ASCII_RE.search(value)
                if match:
                    report.add(rule, str(path), elem.sourceline,
                               f"locale forbidden in values: non-ASCII {match.group(0)!r} in {value.strip()!r} (allowed only in labels/comments)")


# --- kind: sync (manifest version / schema propagation) ---------------------


@register("sync")
def handler_sync(ctx: RegistryModel, rule: Rule, targets: list[Path], report: Report) -> None:
    """The manifest owns the registry namespace (@schema): every root that
    declares it must carry the manifest value (run `checker.py --sync-version`
    to fix drifted files in place).

    The project version is NOT part of this: it lives in the root package.json
    and is never duplicated in the XML, so it cannot drift.
    """
    for path in targets:
        try:
            doc = etree.parse(str(path))
        except etree.XMLSyntaxError as exc:
            report.add(rule, str(path), exc.lineno, f"malformed XML: {exc.msg}")
            continue
        root = doc.getroot()
        schema = root.get("schema")
        if ctx.schema_id and schema is not None and schema != ctx.schema_id:
            report.add(rule, str(path), 1,
                       f"root @schema {schema!r} != manifest @schema {ctx.schema_id!r} -- run `checker.py --sync-version`")
