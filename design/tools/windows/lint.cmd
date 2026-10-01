@echo off
REM lint.cmd — validate every design XML against schema.xsd (agnostic linter).
REM Uses the project venv at ..\.venv.
setlocal
set "BIN_DIR=%~dp0"
set "TOOLS_DIR=%BIN_DIR%.."
set "DESIGN_DIR=%BIN_DIR%..\.."
"%TOOLS_DIR%\.venv\Scripts\python.exe" "%TOOLS_DIR%\sources\linter.py" --schema "%DESIGN_DIR%\schema.xsd" --manifest "%DESIGN_DIR%\manifest.xml" --dir "%DESIGN_DIR%"
exit /b %ERRORLEVEL%