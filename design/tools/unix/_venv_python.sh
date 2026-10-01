#!/usr/bin/env bash
# _venv_python.sh — resolve the project venv Python.
# Sourced by the other unix/ wrappers; sets $VENV_PYTHON.
# Handles both POSIX (bin/python) and Windows-layout (Scripts/python.exe) venvs,
# so these wrappers also work from git-bash on a Windows-hosted .venv.
BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$(cd "$BIN_DIR/.." && pwd)"
if [[ -x "$TOOLS_DIR/.venv/bin/python" ]]; then
    VENV_PYTHON="$TOOLS_DIR/.venv/bin/python"
elif [[ -x "$TOOLS_DIR/.venv/Scripts/python.exe" ]]; then
    VENV_PYTHON="$TOOLS_DIR/.venv/Scripts/python.exe"
else
    echo "venv python not found under $TOOLS_DIR/.venv (looked for bin/python and Scripts/python.exe)" >&2
    echo "create it with: python3 -m venv $TOOLS_DIR/.venv && $TOOLS_DIR/.venv/bin/pip install -r $TOOLS_DIR/requirements.txt" >&2
    exit 1
fi