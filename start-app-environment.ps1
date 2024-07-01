# PowerShell script to start the Vite development server and Electron app

# Function to check if running as administrator
function Test-Admin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Paths to local Node.js binaries
$localNodeDir = ".\local_node"
$nodePath = "$localNodeDir\node.exe"
$npmPath = "$localNodeDir\npm.cmd"

# Path to copy Node.js binaries if necessary
$installDir = "C:\Program Files\nodejs"
$installNodePath = "$installDir\node.exe"
$installNpmPath = "$installDir\npm.cmd"

# Function to check if a process is running
function Test-Process {
    param (
        [string]$Name
    )
    $process = Get-Process -Name $Name -ErrorAction SilentlyContinue
    return $null -ne $process
}

# Function to check if Node.js is installed
function Test-Node {
    if (Test-Path $installNodePath) {
        return $true
    } else {
        return $false
    }
}

# Copy Node.js binaries if not installed
if (-Not (Test-Node)) {
    if (-Not (Test-Admin)) {
        Write-Output "Node.js is not installed. The script needs to run as administrator to copy Node.js binaries. Restarting with elevated privileges..."
        Start-Process powershell -ArgumentList "-File `"$PSCommandPath`"" -Verb RunAs
        while (-Not (Test-Node)) {
            Start-Sleep -Seconds 1
        }
    } else {
        Write-Output "Node.js is not installed. Copying Node.js binaries..."
        Copy-Item -Path "$localNodeDir\*" -Destination $installDir -Recurse -Force

        if (-Not (Test-Node)) {
            Write-Output "Failed to copy Node.js binaries."
            exit 1
        }
        Write-Output "Node.js binaries copied successfully."
    }
}

# Stop any previous instances of the app
Write-Output "Stopping any previous instances of the app..."
Stop-Process -Name "node" -ErrorAction SilentlyContinue

# Check if the directory exists
if (-Not (Test-Path "C:\Silvus-win32-x64")) {
    # Build the app
    Write-Output "Building the app..."
    $process = Start-Process $installNpmPath "run package" -NoNewWindow -PassThru -RedirectStandardOutput "building-app-output.log" -RedirectStandardError "building-app-error.log"

    # Wait for app to build
    Start-Sleep -Seconds 40
} else {
    Write-Output "The app has already been built. Skipping build step."
}

# Start the app
Write-Output "Starting the app..."
$process = Start-Process $installNpmPath "run dev" -NoNewWindow -PassThru -RedirectStandardOutput "app-output.log" -RedirectStandardError "app-error.log"

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