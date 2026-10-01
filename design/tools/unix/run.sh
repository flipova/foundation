#!/usr/bin/env bash
# run.sh — run any Python source script in ../sources with the project venv.
#
#   ./run.sh linter.py --schema ../../schema.xsd --dir ../..
#   ./run.sh checker.py --manifest ../../manifest.xml --root ../../.. --schema ../../schema.xsd --check
#
set -euo pipefail

BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$(cd "$BIN_DIR/.." && pwd)"
source "$BIN_DIR/_venv_python.sh"

SCRIPT="${1:-}"
if [[ -z "$SCRIPT" ]]; then
    echo "Usage: $0 <script.py> [args...]" >&2
    exit 1
fi
shift

exec "$VENV_PYTHON" "$TOOLS_DIR/sources/$SCRIPT" "$@"