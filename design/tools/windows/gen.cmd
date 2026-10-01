@echo off
REM gen.cmd - compile design\tokens.xml + design\themes.xml into the
REM           gluestack/nativewind theme config (components\ui\gluestack-ui-provider\config.ts).
REM Pass --check to verify regeneration is a no-op.
setlocal
set "BIN_DIR=%~dp0"
set "TOOLS_DIR=%BIN_DIR%.."
set "DESIGN_DIR=%BIN_DIR%..\.."
set "REPO_ROOT=%BIN_DIR%..\..\.."
"%TOOLS_DIR%\.venv\Scripts\python.exe" "%TOOLS_DIR%\sources\generate.py" --manifest "%DESIGN_DIR%\manifest.xml" --root "%REPO_ROOT%" %*
exit /b %ERRORLEVEL%