@echo off
REM run.cmd — run any Python source script in ..\sources with the project venv.
REM
REM   run.cmd linter.py --schema ..\..\schema.xsd --dir ..\..
REM   run.cmd checker.py --manifest ..\..\manifest.xml --root ..\..\.. --schema ..\..\schema.xsd --check
setlocal
set "BIN_DIR=%~dp0"
set "TOOLS_DIR=%BIN_DIR%.."
set "SCRIPT=%~1"
if "%SCRIPT%"=="" (
    echo Usage: run.cmd ^<script.py^> [args...]
    exit /b 1
)
shift

REM %* ignores ^shift, so rebuild the argument list from the 2nd arg on.
set "ARGS="
:loop
if "%~1"=="" goto :run
set "ARGS=%ARGS% "%~1""
shift
goto :loop

:run
"%TOOLS_DIR%\.venv\Scripts\python.exe" "%TOOLS_DIR%\sources\%SCRIPT%" %ARGS%
exit /b %ERRORLEVEL%