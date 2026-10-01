#!/usr/bin/env python3
"""
linter.py — XML Schema (XSD) linter for Flipova Foundation (thin entry point).

AGNOSTIC: this tool knows nothing about "Flipova" domain.
It only validates XML files against their XSD schema.

The implementation lives in the ``.linter`` package (dot-prefixed on
purpose: invisible to casual directory listing / glob patterns), split for
modularity and maintenance:

    .linter/errors.py     ValidationError / LintResult
    .linter/linter.py     XSDLinter (schema loading + file validation)
    .linter/discovery.py  catalog-driven file discovery (manifest <file>/<dir>)
    .linter/cli.py        argument parsing & dispatch (main)

USAGE
-----
    python3 linter.py tokens.xml
    python3 linter.py tokens.xml --schema schema.xsd
    python3 linter.py --manifest manifest.xml
    python3 linter.py --dir design/ --schema schema.xsd
(à exécuter depuis design/tools/sources/ ; ou via les wrappers
     design/tools/windows/lint.cmd / design/tools/unix/lint.sh)
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

_SOURCES_DIR = Path(__file__).resolve().parent
_PKG_DIR = _SOURCES_DIR / ".linter"
_PKG_NAME = "foundation_linter"

# ".linter" starts with a dot, so it is not a valid Python identifier and
# cannot be imported by name. Register it as a synthetic package whose
# __path__ points at the dot-directory, then re-export its public API below
# (checker.py --schema uses foundation XSDLinter through `from linter import ...`).
if _PKG_NAME not in sys.modules:
    _spec = importlib.util.spec_from_file_location(
        _PKG_NAME, _PKG_DIR / "__init__.py",
        submodule_search_locations=[str(_PKG_DIR)],
    )
    _pkg = importlib.util.module_from_spec(_spec)
    sys.modules[_PKG_NAME] = _pkg
    _spec.loader.exec_module(_pkg)

from foundation_linter import *
from foundation_linter import main

if __name__ == "__main__":
    sys.exit(main())
