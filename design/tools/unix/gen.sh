#!/usr/bin/env bash
# gen.sh - compile design/tokens.xml + design/themes.xml into the
#          gluestack/nativewind theme config
#          (components/ui/gluestack-ui-provider/config.ts).
# Pass --check to verify regeneration is a no-op.
set -euo pipefail

BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$(cd "$BIN_DIR/.." && pwd)"
source "$BIN_DIR/_venv_python.sh"
DESIGN_DIR="$(cd "$TOOLS_DIR/.." && pwd)"
REPO_ROOT="$(cd "$TOOLS_DIR/../.." && pwd)"

"$VENV_PYTHON" "$TOOLS_DIR/sources/generate.py" --manifest "$DESIGN_DIR/manifest.xml" --root "$REPO_ROOT" "$@"