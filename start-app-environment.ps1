# Paths to local Node.js and Python binaries
$localNodeDir = ".\local_node"
$localPythonDir = ".\local_python"
$npmPath = "$localNodeDir\npm.cmd"
$pythonPath = "$localPythonDir\python.exe"
$pythonServer = "..\svAppPy39-main"
$localPythonPackages = ".\local_python_packages"
$npcapPackage = ".\npcap-1.79.exe"

# Function to check if a process is running
function Test-Process {
    param (
        [string]$Name
    )
    $process = Get-Process -Name $Name -ErrorAction SilentlyContinue
    return $null -ne $process
}

# Add local Node.js and Python binaries to the PATH
$env:PATH = "$localNodeDir;$localPythonDir;$env:PATH"

# Stop any previous instances of the app
Write-Output "Stopping any previous instances of the app..."
Stop-Process -Name "node" -ErrorAction SilentlyContinue

# Set up npcap if it doesn't exist
if (-Not (Test-Path "C:\Program Files\Npcap")) {
    Write-Output "Setting up npcap environment..."
    $process = Start-Process $npcapPackage -Wait -PassThru
    $process.WaitForExit()
    if ($process.ExitCode -ne 0) {
        Write-Output "Failed to install Npcap."
        exit 1
    }
}

# Set up Python virtual environment if it doesn't exist
if (-Not (Test-Path "$pythonServer\venv")) {
    Write-Output "Setting up Python virtual environment..."
    $process = Start-Process -FilePath $pythonPath -ArgumentList "-m venv $pythonServer\venv" -NoNewWindow -Wait -PassThru -RedirectStandardOutput "venv-output.log" -RedirectStandardError "venv-error.log"
    $process.WaitForExit()
    if ($process.ExitCode -ne 0) {
        Write-Output "Failed to set up Python virtual environment."
        exit 1
    }
}

# Activate the virtual environment and install requirements from local directory
Write-Output "Activating Python virtual environment and installing requirements from local directory..."
& "$pythonServer\venv\Scripts\activate"

# Install setuptools and wheel first
$process = Start-Process "$pythonServer\venv\Scripts\pip.exe" -ArgumentList "install --no-index --find-links=$localPythonPackages setuptools wheel" -NoNewWindow -Wait -PassThru -RedirectStandardOutput "first-pip-output.log" -RedirectStandardError "first-pip-error.log"
$process.WaitForExit()
if ($process.ExitCode -ne 0) {
    Write-Output "Failed to install setuptools and wheel."
    exit 1
}

# Install the rest of the requirements
$process = Start-Process "$pythonServer\venv\Scripts\pip.exe" -ArgumentList "install --no-index --find-links=$localPythonPackages -r $pythonServer\requirements.txt" -NoNewWindow -Wait -PassThru -RedirectStandardOutput "second-pip-output.log" -RedirectStandardError "second-pip-error.log"
$process.WaitForExit()
if ($process.ExitCode -ne 0) {
    Write-Output "Failed to install Python requirements from local directory."
    exit 1
}

# Start the app
Write-Output "Starting the app..."
$process = Start-Process $npmPath -ArgumentList "run dev" -NoNewWindow -PassThru -RedirectStandardOutput "app-output.log" -RedirectStandardError "app-error.log"

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