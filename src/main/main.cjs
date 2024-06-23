const { app, BrowserWindow } = require('electron');
const os = require('os');
const path = require('path');
const { spawn} = require('child_process');
const electron = require("electron");

let pythonServer;
let isQuiting = false;

function createWindow() {
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadURL('http://localhost:5173');

    mainWindow.on("closed", () => {
        stopPythonServer();
        mainWindow = null;
    });

    mainWindow.on("minimize", (event) => {
        event.preventDefault();
    });

    mainWindow.on("close", (event) => {
        if (!isQuiting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
}

function startPythonServer() {
    const homeDir = os.homedir();
    const pythonPath = path.join(homeDir, "Documents", "svApp", "venv", "Scripts", "python.exe");
    const scriptPath = path.join(homeDir, "Documents", "svApp", "app", "main.py");

    pythonServer = spawn(pythonPath, [scriptPath], {
        detached: true, // Ensure the process is detached
        stdio: ["ignore", "pipe", "pipe"]
    });

    pythonServer.stdout.on("data", (data) => {
        console.log(`Python server stdout: ${data}`);
    });

    pythonServer.stderr.on("data", (data) => {
        console.error(`Python server stderr: ${data}`);
    });

    pythonServer.on("close", (code) => {
        console.log(`Python server exited with code ${code}`);
    });

    pythonServer.unref(); // Ensure the parent process doesn't wait for the child process to exit
}

function stopPythonServer() {
    if (pythonServer) {
        pythonServer.kill();
    }
}

app.on('ready', () => {
    startPythonServer();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        stopPythonServer();
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    } else {
        BrowserWindow.show();
    }
});

electron.app.on('before-quit', () => {
    isQuiting = true;
    stopPythonServer(); // Stop the Python server when Electron app is quitting
});