@echo off
REM Start the PowerShell script and get its process ID
powershell -windowstyle hidden -file "%~dp0start-app-environment.ps1" &
set "psPID=%!"

REM Wait for user to close the batch file
echo Press any key to close this window...
pause >nul

REM Terminate the PowerShell process if the batch file is closed
taskkill /PID %psPID% /F