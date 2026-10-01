#!/usr/bin/env python3
"""
generate.py — code generator for Flipova Foundation (thin entry point).

The implementation lives in the ``.generate`` package (dot-prefixed on
purpose: invisible to casual directory listing / glob patterns):

    .generate/common.py  shared imports, XML namespace, q() helper
    .generate/model.py   ManifestModel + load_manifest (manifest.xml)
    .generate/config.py  tokens/themes -> gluestack config.ts renderer
    .generate/cli.py     argument parsing & dispatch (main)

USAGE
-----
    python3 generate.py --manifest ../manifest.xml --root ../..
    python3 generate.py --manifest ../manifest.xml --root ../.. --check
    python3 generate.py --manifest ../manifest.xml --root ../.. --list
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

_SOURCES_DIR = Path(__file__).resolve().parent
_PKG_DIR = _SOURCES_DIR / ".generate"
_PKG_NAME = "foundation_generate"

# ".generate" starts with a dot, so it is not a valid Python identifier and
# cannot be imported by name. Register it as a synthetic package whose
# __path__ points at the dot-directory, then re-export its public API below
# so that `import generate` keeps working (docgen.py uses
# generate.load_manifest).
if _PKG_NAME not in sys.modules:
    _spec = importlib.util.spec_from_file_location(
        _PKG_NAME, _PKG_DIR / "__init__.py",
        submodule_search_locations=[str(_PKG_DIR)],
    )
    _pkg = importlib.util.module_from_spec(_spec)
    sys.modules[_PKG_NAME] = _pkg
    _spec.loader.exec_module(_pkg)

from foundation_generate import *
from foundation_generate import main

if __name__ == "__main__":
    sys.exit(main())
