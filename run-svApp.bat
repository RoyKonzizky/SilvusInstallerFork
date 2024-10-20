@echo off
REM Set the working directory to the location of this batch file
cd /d "%~dp0"

echo Starting server...
start /wait svApp.exe
echo done
