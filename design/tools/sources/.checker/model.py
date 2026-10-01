from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

from lxml import etree

NS = "urn:flipova:foundation:registry"


def q(tag: str) -> str:
    return f"{{{NS}}}{tag}"


def localname(tag: str) -> str:
    """Strips a namespace prefix from an XML tag, returning the bare name.

    Comments and processing instructions carry a callable ``tag`` in lxml:
    return '' for them so ``doc.iter()`` loops can skip them uniformly.
    """
    if not isinstance(tag, str):
        return ""
    return tag.rsplit("}", 1)[-1] if "}" in tag else tag


def natural_key(value: str) -> list:
    """Locale-independent natural key used for canonical ordering."""
    return [
        (0, int(part)) if part.isdigit() else (1, part.casefold())
        for part in re.split(r"(\d+)", value)
        if part != ""
    ]


def cap(s: str) -> str:
    """CamelCase the slug ``a-b-c`` -> ``ABC`` (dashes -> upper, strip others)."""
    return "".join(w.upper() for w in s.split("-") if w)


def slug(name: str) -> str:
    """Turn ``CamelCase`` into ``kebab-case`` (``TextInput`` -> ``text-input``)."""
    return re.sub(r"(?<=[a-z])(?=[A-Z])|[^a-zA-Z0-9]", "-", name).strip("-").lower()


# ---------------------------------------------------------------------------
# Rule parsing (declarative, from the manifest)
# ---------------------------------------------------------------------------


@dataclass
class Rule:
    id: str
    kind: str
    severity: str
    description: str
    apply_to: str
    params: dict[str, str] = field(default_factory=dict)

    def get(self, name: str, default: str | None = None) -> str | None:
        return self.params.get(name, default)

    def get_list(self, name: str, default: list[str] | None = None) -> list[str]:
        raw = self.params.get(name)
        if raw is None:
            return list(default or [])
        return [part.strip() for part in raw.split(",") if part.strip()]


def parse_rules(manifest: etree._Element) -> list[Rule]:
    rules: list[Rule] = []
    for rule_el in manifest.findall(q("meta") + "/" + q("determinism") + "/" + q("rule")):
        params = {}
        for param in rule_el.findall(q("params") + "/" + q("param")):
            params[param.get("name")] = (param.text or "").strip()
        apply_to = rule_el.findtext(q("applyTo"))
        apply_to = apply_to.strip() if apply_to else "*.xml"
        rules.append(Rule(
            id=rule_el.get("id"),
            kind=rule_el.get("kind"),
            severity=rule_el.get("severity") or "error",
            description=(rule_el.findtext(q("description")) or "").strip(),
            apply_to=apply_to,
            params=params,
        ))
    return rules


# ---------------------------------------------------------------------------
# Diagnostics
# ---------------------------------------------------------------------------


@dataclass
class Diagnostic:
    rule_id: str
    severity: str
    file: str
    line: int | None
    message: str

    def __str__(self) -> str:
        loc = self.file
        if self.line is not None:
            loc += f":{self.line}"
        return f"[{self.severity.upper()}] {loc} [rule={self.rule_id}]: {self.message}"


# ---------------------------------------------------------------------------
# Registry model (what the checker reasons about)
# ---------------------------------------------------------------------------


@dataclass
class RegistryModel:
    root: Path
    manifest_path: Path
    registers: list[str]
    reserves: list[str]
    index: dict[str, list[str]]
    catalog_files: dict[str, Path]
    token_values: dict[str, dict[str, str]]   # token id -> value id -> literal
    theme_roles: dict[str, dict[str, str]]    # theme id  -> role id -> ref
    rules: list[Rule]
    version: str = ""     # manifest <meta><version> (single source of truth)
    schema_id: str = ""   # manifest root @schema (propagated to every root tag)


def resolve_reference(ctx: RegistryModel, ref: str) -> bool:
    """True when *ref* resolves against the registry (never implicit links)."""
    parts = ref.split(".")
    if ref.startswith("$ref."):
        parts = ref[len("$ref."):].split(".")
    if parts and parts[0] in ctx.registers:
        parts = parts[1:]
    if not parts:
        return False
    item_id = parts[0]
    path = parts[1:]
    if item_id in ctx.token_values:
        return ".".join(path) in ctx.token_values[item_id] if path else True
    if item_id in ctx.theme_roles:
        return True if not path else ".".join(path) in ctx.theme_roles[item_id]
    return False
