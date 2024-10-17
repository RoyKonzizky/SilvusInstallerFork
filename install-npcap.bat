@echo off
REM Set the working directory to the location of this batch file
cd /d "%~dp0"

REM Check if Npcap is installed by looking for the Npcap directory
if exist "C:\Program Files\Npcap\" (
    echo Npcap is already installed.
) else (
    echo Installing Npcap...
    start /wait npcap-1.79.exe
    echo done
)
