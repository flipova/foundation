@echo off
REM doc.cmd - regenerate the documentation site (docs\generated\ at the
REM repo root) from design\manifest.xml, design\documentation.xml,
REM design\schema.xsd and the registries. documentation.xml is the single
REM source of documentation truth; do not hand-edit docs\generated\.
setlocal
set "BIN_DIR=%~dp0"
set "TOOLS_DIR=%BIN_DIR%.."
set "DESIGN_DIR=%BIN_DIR%..\.."
set "REPO_ROOT=%BIN_DIR%..\..\.."
"%TOOLS_DIR%\.venv\Scripts\python.exe" "%TOOLS_DIR%\sources\docgen.py" --manifest "%DESIGN_DIR%\manifest.xml" --root "%REPO_ROOT%" --out "%REPO_ROOT%\docs\generated"
exit /b %ERRORLEVEL%