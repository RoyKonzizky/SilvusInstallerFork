"use strict";
const electron = require("electron");
const path = require("path");
const { exec } = require('child_process');

function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
let mainWindow;
let pythonServer;

async function handleFileOpen() {
  const { canceled, filePaths } = await electron.dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
}

function startPythonServer() {
  pythonServer = exec('c:/Users/Hadar/Documents/svApp/venv/Scripts/python.exe c:/Users/Hadar/Documents/svApp/app/main.py');

  pythonServer.stdout.on('data', (data) => {
    console.log(`Python server stdout: ${data}`);
  });

  pythonServer.stderr.on('data', (data) => {
    console.error(`Python server stderr: ${data}`);
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

function createWindow() {
  mainWindow = new electron.BrowserWindow({
    webPreferences: {
      preload: path__namespace.join(__dirname, "../preload/preload.cjs"),
      webSecurity: false
    }
  });

  mainWindow.loadURL("http://localhost:5173");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

electron.app.whenReady().then(() => {
  electron.ipcMain.handle("dialog:openFile", handleFileOpen);
  startPythonServer(); // Start the Python server when Electron is ready
  createWindow();
});

electron.app.on("window-all-closed", () => {
  stopPythonServer(); // Stop the Python server when all windows are closed
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});

electron.app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

electron.app.on('will-quit', () => {
  stopPythonServer(); // Stop the Python server when Electron app is quitting
});