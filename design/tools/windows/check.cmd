@echo off
REM check.cmd — enforce the determinism rules declared in manifest.xml (checker),
REM        with the optional XSD conformance pass and the ruff lint of
REM        design/tools/sources (skip it with --no-ruff). Runs from the repo
REM        root so applyTo globs (e.g. design/*.xml) resolve correctly.
setlocal
set "BIN_DIR=%~dp0"
set "TOOLS_DIR=%BIN_DIR%.."
set "DESIGN_DIR=%BIN_DIR%..\.."
set "REPO_ROOT=%BIN_DIR%..\..\.."
"%TOOLS_DIR%\.venv\Scripts\python.exe" "%TOOLS_DIR%\sources\checker.py" --manifest "%DESIGN_DIR%\manifest.xml" --root "%REPO_ROOT%" --schema "%DESIGN_DIR%\schema.xsd" --check %*
exit /b %ERRORLEVEL%