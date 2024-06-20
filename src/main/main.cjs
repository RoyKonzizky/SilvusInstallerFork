const { app, BrowserWindow } = require('electron');
const os = require('os');
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
    const homeDir = os.homedir();
    const pythonPath = path.join(homeDir, 'Documents', 'svApp', 'venv', 'Scripts', 'python.exe');
    const scriptPath = path.join(homeDir, 'Documents', 'svApp', 'app', 'main.py');

    pythonServer = exec(`${pythonPath} ${scriptPath}`);

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