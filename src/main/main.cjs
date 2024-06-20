const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let pythonServer;

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

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function startPythonServer() {
    pythonServer = exec('c:/Users/Hadar/Documents/svApp/venv/Scripts/python.exe c:/Users/Hadar/Documents/svApp/app/main.py');

    pythonServer.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    pythonServer.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonServer.on('close', (code) => {
        console.log(`Python server exited with code ${code}`);
    });
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
    }
});

app.on('will-quit', stopPythonServer);