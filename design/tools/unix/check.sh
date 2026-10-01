#!/usr/bin/env bash
# check.sh — enforce the determinism rules declared in manifest.xml (checker),
#           with the optional XSD conformance pass and the ruff lint of
#           design/tools/sources (skip it with --no-ruff).
set -euo pipefail

BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$(cd "$BIN_DIR/.." && pwd)"
source "$BIN_DIR/_venv_python.sh"
DESIGN_DIR="$(cd "$TOOLS_DIR/.." && pwd)"
REPO_ROOT="$(cd "$TOOLS_DIR/../.." && pwd)"

"$VENV_PYTHON" "$TOOLS_DIR/sources/checker.py" --manifest "$DESIGN_DIR/manifest.xml" --root "$REPO_ROOT" --schema "$DESIGN_DIR/schema.xsd" --check "$@"