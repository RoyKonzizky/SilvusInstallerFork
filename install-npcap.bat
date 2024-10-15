@echo off
REM Check if Npcap is installed by looking for the Npcap directory
if exist "C:\Program Files\Npcap\" (
    echo Npcap is already installed.
) else (
    echo Installing Npcap...
    start /wait npcap-1.79.exe /S
)
