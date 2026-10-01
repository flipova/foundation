#!/usr/bin/env python3
"""
docgen.py — documentation generator for Flipova Foundation (thin entry point).

The implementation lives in the ``.docgen`` package (dot-prefixed on
purpose: invisible to casual directory listing / glob patterns), split for
modularity and maintenance:

    .docgen/xsddoc.py    generic XSD -> Markdown walker (Schema Reference)
    .docgen/model.py     parse_manifest / parse_documentation + typed models
    .docgen/reference.py tokens / themes / schema reference renderers
    .docgen/site.py      article rendering, xref resolution, site writing
    .docgen/cli.py       argument parsing & assembly (main)

The documentation site is generated from two declarative sources:
  - `design/manifest.xml`      — registry manifest (meta, catalogs, index)
  - `design/documentation.xml` — documentation tree (navigation + narrative Markdown
    content), SEPARATED from the manifest to keep concerns clean.

No other file in the repository should carry hand-written explanatory
documentation (no parallel README.md, no standalone SCHEMA.md) — this tool
is what turns the manifest + documentation.xml into a browsable static site
under the repo-root `docs/` (not `design/docs/`).
The generated site is composed of three inputs, one per kind of content:
  1. Narrative articles  -> `<article><content>` Markdown in `design/documentation.xml`
     (Getting Started, Theming, Tools, Contributing).
  2. Schema Reference     -> `schema.xsd`, rendered by the generic XSD ->
     Markdown walker (.docgen/xsddoc.py). Never duplicated by hand:
     change the .xsd, regenerate, done.

  3. Registry Reference   -> `tokens.xml` and `themes.xml` read directly
     (.docgen/reference.py).

USAGE
-----
    python3 docgen.py --manifest ../../manifest.xml --documentation ../../documentation.xml --root ../.. --out ../../docs/generated
    (or via the wrappers: design/tools/unix/doc.sh / windows/doc.cmd)
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

_SOURCES_DIR = Path(__file__).resolve().parent
_PKG_DIR = _SOURCES_DIR / ".docgen"
_PKG_NAME = "foundation_docgen"

# ".docgen" starts with a dot, so it is not a valid Python identifier and
# cannot be imported by name. Register it as a synthetic package whose
# __path__ points at the dot-directory, then re-export its public API below.
if _PKG_NAME not in sys.modules:
    _spec = importlib.util.spec_from_file_location(
        _PKG_NAME, _PKG_DIR / "__init__.py",
        submodule_search_locations=[str(_PKG_DIR)],
    )
    _pkg = importlib.util.module_from_spec(_spec)
    sys.modules[_PKG_NAME] = _pkg
    _spec.loader.exec_module(_pkg)

from foundation_docgen import *
from foundation_docgen import main

if __name__ == "__main__":
    sys.exit(main())
