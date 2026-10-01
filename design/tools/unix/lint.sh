#!/usr/bin/env bash
# lint.sh — validate every design XML against schema.xsd (agnostic linter).
set -euo pipefail

BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$(cd "$BIN_DIR/.." && pwd)"
source "$BIN_DIR/_venv_python.sh"
DESIGN_DIR="$(cd "$TOOLS_DIR/.." && pwd)"

"$VENV_PYTHON" "$TOOLS_DIR/sources/linter.py" --schema "$DESIGN_DIR/schema.xsd" --manifest "$DESIGN_DIR/manifest.xml" --dir "$DESIGN_DIR"