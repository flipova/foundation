"""reference renderers - dynamic content of the registry/schema reference pages.

- Schema Reference: rendered from `design/schema.xsd` via .docgen/xsddoc.py
  (never duplicated by hand: change the .xsd, regenerate, done).
- Tokens / Themes: rendered directly from design/tokens.xml and
  design/themes.xml.
"""
from __future__ import annotations

from pathlib import Path

from lxml import etree

from .model import q
from .xsddoc import collect_types, render_markdown

# ---------------------------------------------------------------------------
# Dynamic content: Schema Reference (from schema.xsd)
# ---------------------------------------------------------------------------


def strip_leading_h1(markdown: str) -> str:
    """Drop the first '# Title' line xsd2doc emits -- the page already has one."""
    lines = markdown.splitlines()
    while lines and not lines[0].strip():
        lines.pop(0)
    if lines and lines[0].startswith("# "):
        lines.pop(0)
    return "\n".join(lines).lstrip("\n")


def render_schema_reference(schema_path: Path) -> str:
    tree = etree.parse(str(schema_path))
    etree.XMLSchema(tree)  # raises if the schema itself is invalid
    types = collect_types(tree.getroot())
    md = render_markdown(types, "Flipova Foundation Registry Schema Reference")
    return strip_leading_h1(md)


# ---------------------------------------------------------------------------
# Dynamic content: registry reference (tokens.xml, themes.xml)
# ---------------------------------------------------------------------------


def render_tokens_reference(tokens_path: Path) -> str:
    if not tokens_path.exists():
        return "_No `tokens.xml` found._\n"
    root = etree.parse(str(tokens_path)).getroot()
    lines = []
    for token in root.findall(q("items") + "/" + q("token")):
        tid = token.get("id", "")
        kind = token.get("kind", "")
        lines.append(f"### {tid}")
        lines.append("")
        meta_bits = [f"`kind={kind}`"]
        for attr in ("unit", "base", "formula", "mode"):
            if token.get(attr):
                meta_bits.append(f"`{attr}={token.get(attr)}`")
        lines.append(" &nbsp;·&nbsp; ".join(meta_bits))
        lines.append("")
        values = token.find(q("values"))
        ids = [v.get("id", "") for v in values.findall(q("value"))] if values is not None else []
        if ids:
            lines.append("Values: " + ", ".join(f"`{v}`" for v in ids))
            lines.append("")
        lines.append(f"Reference syntax: `$ref.tokens.{tid}.<value-id>`")
        lines.append("")
    return "\n".join(lines) if lines else "_No tokens declared._\n"


def render_themes_reference(themes_path: Path) -> str:
    if not themes_path.exists():
        return "_No `themes.xml` found._\n"
    root = etree.parse(str(themes_path)).getroot()
    default = root.get("default", "")
    lines = [f"Default theme: `{default}`", ""]
    for theme in root.findall(q("items") + "/" + q("theme")):
        tid = theme.get("id", "")
        mode = theme.get("mode", "")
        lines.append(f"### {tid}")
        lines.append("")
        lines.append(f"`mode={mode}`" + ("  *(default)*" if tid == default else ""))
        lines.append("")
        role_map = theme.find(q("roleMap"))
        roles = role_map.findall(q("role")) if role_map is not None else []
        if roles:
            lines.append("| Role | Reference |")
            lines.append("|---|---|")
            for role in roles:
                rname = role.get("name", role.get("id", ""))
                ref_el = role.find(q("ref"))
                ref_val = (ref_el.text or "").strip() if ref_el is not None else (role.text or "").strip()
                lines.append(f"| `{rname}` | `{ref_val or ('$ref.tokens.color...')}` |")
            lines.append("")
        lines.append("Reference syntax: `$ref.themes.<role>` -> `--<role>` in the generated config")
        lines.append("")
    return "\n".join(lines)
