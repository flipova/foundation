#!/usr/bin/env python3
"""
checker.py — Manifest-driven determinism checker (thin entry point).

The implementation lives in the ``.checker`` package (dot-prefixed on
purpose: invisible to casual directory listing / glob patterns), split for
modularity and maintenance:

    .checker/model.py     Rule / Diagnostic / RegistryModel, reference resolution
    .checker/registry.py  handler registry, applyTo expansion, ordering checks
    .checker/checks.py    one handler per rule kind (ids, ordering, references,
                          timestamps, locale, style, sync)
    .checker/io.py        build_model, canonical index, sync-version, XSD pass
    .checker/cli.py       argument parsing & dispatch (main)
    .checker/report.py    Report (diagnostics collector)

USAGE (unchanged; see design/tools/windows/check.cmd / design/tools/unix/check.sh)
-------
    python3 checker.py --manifest ../../manifest.xml --root ../../.. --check
    python3 checker.py --manifest ../../manifest.xml --schema ../../schema.xsd
    python3 checker.py --manifest ../../manifest.xml --list-rules
    python3 checker.py --manifest ../../manifest.xml --emit-canonical
    python3 checker.py --manifest ../../manifest.xml --verify-canonical
    python3 checker.py --manifest ../../manifest.xml --sync-version
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

_SOURCES_DIR = Path(__file__).resolve().parent
_PKG_DIR = _SOURCES_DIR / ".checker"
_PKG_NAME = "foundation_checker"

# ".checker" starts with a dot, so it is not a valid Python identifier and
# cannot be imported by name. Register it as a synthetic package whose
# __path__ points at the dot-directory, then re-export its public API below
# so that `import checker` keeps working (docgen.py, generate.py use
# checker.build_model / checker.localname / ...).
if _PKG_NAME not in sys.modules:
    _spec = importlib.util.spec_from_file_location(
        _PKG_NAME, _PKG_DIR / "__init__.py",
        submodule_search_locations=[str(_PKG_DIR)],
    )
    _pkg = importlib.util.module_from_spec(_spec)
    sys.modules[_PKG_NAME] = _pkg
    _spec.loader.exec_module(_pkg)

from foundation_checker import *
from foundation_checker import main

if __name__ == "__main__":
    sys.exit(main())
