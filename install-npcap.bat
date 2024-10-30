@echo off
REM Set the working directory to the location of this batch file
cd /d "%~dp0"

REM Check if Npcap is installed by looking for the Npcap directory
if exist "C:\Program Files\Npcap\" (
REM Remove REM to see this in the logger
    REM echo Npcap is already installed.
) else (
REM Remove REM to see this in the logger
    echo Installing Npcap...
    REM Removed the "/wait" keyword after the start
    start npcap-1.79.exe
    echo done
)
