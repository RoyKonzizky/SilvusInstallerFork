@echo off
REM Set the working directory to the location of this batch file
cd /d "%~dp0"

REM Remove REM to see this in the logger
echo Starting server...
REM Removed the "/wait" keyword after the start
start svApp.exe
echo done
