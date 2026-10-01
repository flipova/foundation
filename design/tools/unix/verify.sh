#!/usr/bin/env bash
# verify.sh — verify the committed canonical registry index
# (design/canonical.index.txt) is in sync with the registry.
set -euo pipefail

BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$(cd "$BIN_DIR/.." && pwd)"
source "$BIN_DIR/_venv_python.sh"
DESIGN_DIR="$(cd "$TOOLS_DIR/.." && pwd)"
REPO_ROOT="$(cd "$TOOLS_DIR/../.." && pwd)"

"$VENV_PYTHON" "$TOOLS_DIR/sources/checker.py" --manifest "$DESIGN_DIR/manifest.xml" --root "$REPO_ROOT" --verify-canonical