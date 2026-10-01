#!/usr/bin/env bash
# doc.sh — regenerate the full documentation site (docs/generated/ at the repo
# root) from design/manifest.xml, design/documentation.xml, design/schema.xsd
# and the registries. documentation.xml is the single source of documentation
# truth; do not hand-edit docs/generated/.
set -euo pipefail

BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$(cd "$BIN_DIR/.." && pwd)"
source "$BIN_DIR/_venv_python.sh"
DESIGN_DIR="$(cd "$TOOLS_DIR/.." && pwd)"
REPO_ROOT="$(cd "$DESIGN_DIR/.." && pwd)"

"$VENV_PYTHON" "$TOOLS_DIR/sources/docgen.py" --manifest "$DESIGN_DIR/manifest.xml" --root "$REPO_ROOT" --out "$REPO_ROOT/docs/generated"
