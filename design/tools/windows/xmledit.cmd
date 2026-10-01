@echo off
REM xmledit.cmd — visual, XSD-driven XML block editor (design/schema.xsd is the
REM single source of truth). No args opens the GUI; pass an XML file to open it,
REM or a headless flag (--list-roots, --list-blocks, --describe, --validate,
REM --new). Uses the project venv at ..\.venv.
setlocal
set "BIN_DIR=%~dp0"
set "TOOLS_DIR=%BIN_DIR%.."
"%TOOLS_DIR%\.venv\Scripts\python.exe" "%TOOLS_DIR%\sources\xmleditor.py" %*
exit /b %ERRORLEVEL%
