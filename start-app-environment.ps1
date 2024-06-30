# PowerShell script to start the Vite development server and Electron app

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
Stop-Process -Name "node" -ErrorAction SilentlyContinue

# Build the app
Write-Output "Building the app..."
$process = Start-Process "npm" "run package" -NoNewWindow -PassThru -RedirectStandardOutput "building-app-output.log" -RedirectStandardError "building-app-error.log"

# Wait for app to build
Start-Sleep -Seconds 40

# Start the app
Write-Output "Starting the app..."
$process = Start-Process "npm" "run dev" -NoNewWindow -PassThru -RedirectStandardOutput "app-output.log" -RedirectStandardError "app-error.log"

# Wait for app to start
Start-Sleep -Seconds 10

# Check if the app is running
if (Test-Process -Name "node") {
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