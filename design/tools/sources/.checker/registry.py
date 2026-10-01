from __future__ import annotations

import fnmatch
import glob
import os
from pathlib import Path
from typing import Callable

from lxml import etree

from .model import RegistryModel, Rule, localname, q

HANDLERS: dict[str, Callable] = {}

IGNORE_DIRS = frozenset({
    ".git", ".svn", ".hg", "node_modules", ".venv", "__pycache__",
    ".DS_Store", "dist", "build", "docs", "generated",
})


def register(kind: str) -> Callable:
    """Decorator that registers a rule handler under *kind*.

    The manifest declares rules with a ``kind`` attribute; checker dispatches
    each declared rule to the handler registered for its kind.
    """

    def decorator(fn: Callable) -> Callable:
        HANDLERS[kind] = fn
        return fn

    return decorator


def expand_targets(root: Path, pattern: str) -> list[Path]:
    """Expand a rule.applyTo glob (relative to root) into concrete files."""
    if not pattern:
        return []
    pat = pattern.replace("\\", "/")
    if "/" not in pat and "**" not in pat:
        return sorted(p.resolve() for p in iter_files(root, pat))
    hits = [Path(p).resolve() for p in glob.glob(str(root / pat), recursive=True)]
    if not hits and "/" in pat:
        for p in iter_files(root, "*"):
            rel = p.relative_to(root).as_posix()
            if fnmatch.fnmatch(rel, pat):
                hits.append(p.resolve())
    return sorted(set(hits))


def iter_files(root: Path, pattern: str):
    """Yield files under *root* matching *pattern*, skipping nested vendor trees past the IGNORE_DIRS filter."""
    pat = pattern.replace("\\", "/")
    match_name_only = "/" not in pat and "*" in pat
    for base, dirs, files in os.walk(str(root)):
        dirs[:] = sorted(d for d in dirs if d not in IGNORE_DIRS)
        for name in sorted(files):
            if match_name_only:
                hit = fnmatch.fnmatch(name, pat)
            else:
                rel = Path(base).relative_to(root) / name
                hit = fnmatch.fnmatch(rel.as_posix(), pat)
            if hit:
                yield Path(base) / name


def _check_register_order(ctx: RegistryModel, rule: Rule, report) -> None:
    """Enforce that the canonical register order is consistent everywhere."""
    canonical = ctx.registers
    mroot = etree.parse(str(ctx.manifest_path)).getroot()
    catalogs = [c.get("register") for c in mroot.findall(q("catalogs") + "/" + q("catalog"))]
    index_regs = [r.get("name") for r in mroot.findall(q("index") + "/" + q("register"))]
    for label, got in (("catalogs", catalogs), ("index", index_regs)):
        if got != canonical:
            report.add(rule, str(ctx.manifest_path), None,
                       f"{label} register order {got!r} != canonical {canonical!r} (canonical sort by (register, id) requires one order everywhere)")
    for catalog in mroot.findall(q("catalogs") + "/" + q("catalog")):
        declared = catalog.get("register")
        file_el = catalog.find(q("file"))
        if file_el is None or not file_el.text:
            continue
        path = (ctx.manifest_path.parent / file_el.text.strip()).resolve()
        if not path.exists():
            continue
        try:
            actual = etree.parse(str(path)).getroot().get("register")
        except etree.XMLSyntaxError:
            continue
        if actual != declared:
            report.add(rule, str(path), None,
                       f"file declares register={actual!r} but the catalog expects {declared!r}")


def _check_sibling_order(path: Path, rule: Rule, selectors: list[str], report) -> None:
    """Enforce natural sort order of id-bearing sibling lists."""
    from .model import natural_key

    doc = etree.parse(str(path))
    selector_set = set(selectors)
    for parent in doc.iter():
        last: dict[str, list] = {}
        for child in parent:
            name = localname(child.tag)
            if selector_set and name not in selector_set:
                continue
            ident = child.get("id") or child.get("name") or child.get("register")
            if ident is None and name in ("item", "field", "key", "register"):
                ident = (child.text or "").strip()
            if not ident:
                continue
            key = natural_key(ident)
            if name in last and key < last[name]:
                report.add(rule, str(path), child.sourceline,
                           f"{name} {ident!r} out of canonical order (expected non-decreasing natural sort by id/name)")
            last[name] = key
