#!/usr/bin/env python3
"""
xmleditor.py — visual, XSD-driven XML block editor (thin entry point).

The implementation lives in the ``.xmleditor`` package (dot-prefixed on
purpose: invisible to casual directory listing / glob patterns), split for
modularity and maintenance:

    .xmleditor/xsdmodel.py  XSD introspection -> SchemaModel (the block model)
    .xmleditor/blocks.py    block profile + contextual palette (what goes where)
    .xmleditor/model.py     editable document: mutations, undo/redo, validation
    .xmleditor/widgets.py   ttk widgets: palette, block tree, diagram, inspector
    .xmleditor/editor.py    main window
    .xmleditor/cli.py       CLI + headless modes (main)

The design/schema.xsd file is the single source of truth: roots, nested
blocks, cardinalities, attributes, enumerations and documentation are read
from it at runtime, so every schema-valid XML is editable — and new XML is
creatable — without touching this tool. Validation reuses
``design/tools/sources/linter.py``, the same XSD validator as the CLI
pipeline, so the editor and ``check.sh`` / ``lint.cmd`` can never disagree.

USAGE (see design/tools/windows/xmledit.cmd / design/tools/unix/xmledit.sh)
-----
    python3 xmleditor.py                                  # open the GUI
    python3 xmleditor.py ../../themes.xml                 # GUI on one file
    python3 xmleditor.py --list-roots                     # schema roots
    python3 xmleditor.py --list-blocks                    # block profile
    python3 xmleditor.py --list-blocks themes             # allowed children
    python3 xmleditor.py --describe themes                # full XSD view
    python3 xmleditor.py --validate ../../*.xml           # headless check
    python3 xmleditor.py --new tokens --out ../../tokens.xml  # headless create
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

_SOURCES_DIR = Path(__file__).resolve().parent
_PKG_DIR = _SOURCES_DIR / ".xmleditor"
_PKG_NAME = "foundation_xmleditor"

# ".xmleditor" starts with a dot, so it is not a valid Python identifier and
# cannot be imported by name. Register it as a synthetic package whose
# __path__ points at the dot-directory, then re-export its public API below
# (same convention as checker.py / docgen.py / generate.py / linter.py).
if _PKG_NAME not in sys.modules:
    _spec = importlib.util.spec_from_file_location(
        _PKG_NAME, _PKG_DIR / "__init__.py",
        submodule_search_locations=[str(_PKG_DIR)],
    )
    _pkg = importlib.util.module_from_spec(_spec)
    sys.modules[_PKG_NAME] = _pkg
    _spec.loader.exec_module(_pkg)

from foundation_xmleditor import *
from foundation_xmleditor import main

if __name__ == "__main__":
    sys.exit(main())
