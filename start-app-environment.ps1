# PowerShell script to start the Vite development server and Electron app

# Path to local Node.js and npm executables
$nodePath = ".\node_modules\.bin\node.exe"
$npmPath = ".\node_modules\.bin\npm.cmd"

# Function to check if a process is running
function Test-Process {
    param (
        [string]$Name
    )
    $process = Get-Process -Name $Name -ErrorAction SilentlyContinue
    return $null -ne $process
}

# Stop any previous instances of the app
Write-Output "Stopping any previous instances of the app..."
Stop-Process -Name $nodePath -ErrorAction SilentlyContinue

## Check if the directory exists
#if (-Not (Test-Path "C:\Silvus-win32-x64")) {
#    # Build the app
#    Write-Output "Building the app..."
#    $process = Start-Process $npmPath "run package" -NoNewWindow -PassThru -RedirectStandardOutput "building-app-output.log" -RedirectStandardError "building-app-error.log"
#
#    # Wait for app to build
#    Start-Sleep -Seconds 40
#} else {
#    Write-Output "The app has already been built. Skipping build step."
#}

# Start the app
Write-Output "Starting the app..."
$process = Start-Process $npmPath "run dev" -NoNewWindow -PassThru -RedirectStandardOutput "app-output.log" -RedirectStandardError "app-error.log"

# Wait for app to start
Start-Sleep -Seconds 20

# Check if the app is running
if (Test-Process -Name $nodePath) {
    Write-Output "The app is running."
} else {
    Write-Output "Failed to start the app."
    exit 1
}

# Keep the script running until the app is closed
while ($process.HasExited -eq $false) {
    Start-Sleep -Seconds 5
}

Write-Output "The app has exited."
exit