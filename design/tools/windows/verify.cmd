@echo off
REM verify.cmd — verify the committed canonical registry index
REM (design/canonical.index.txt) is in sync with the registry.
setlocal
set "BIN_DIR=%~dp0"
set "TOOLS_DIR=%BIN_DIR%.."
set "DESIGN_DIR=%BIN_DIR%..\.."
set "REPO_ROOT=%BIN_DIR%..\..\.."
"%TOOLS_DIR%\.venv\Scripts\python.exe" "%TOOLS_DIR%\sources\checker.py" --manifest "%DESIGN_DIR%\manifest.xml" --root "%REPO_ROOT%" --verify-canonical
exit /b %ERRORLEVEL%