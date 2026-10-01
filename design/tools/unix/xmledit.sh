#!/usr/bin/env bash
# xmledit.sh — visual, XSD-driven XML block editor (design/schema.xsd is the
# single source of truth). No args opens the GUI; pass an XML file to open it,
# or a headless flag (--list-roots, --list-blocks, --describe, --validate,
# --new).
set -euo pipefail

BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$(cd "$BIN_DIR/.." && pwd)"
source "$BIN_DIR/_venv_python.sh"

exec "$VENV_PYTHON" "$TOOLS_DIR/sources/xmleditor.py" "$@"
