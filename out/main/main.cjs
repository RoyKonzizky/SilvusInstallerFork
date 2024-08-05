"use strict";
const electron = require("electron");
const path = require("path");
const { spawn } = require("child_process");

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
let isQuiting = false;

async function handleFileOpen() {
  const { canceled, filePaths } = await electron.dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
}

function startPythonServer() {
  const projectRoot = path.resolve(__dirname, "../..");
  const svAppDir = path.join(projectRoot, "../svApp");
  const pythonPath = path.join(svAppDir, "venv", "Scripts", "python.exe");
  const scriptPath = path.join(svAppDir, "app", "main.py");
  const env = { ...process.env };

  env.PATH = `../../local_python/python.exe:${env.PATH}`;
  pythonServer = spawn(pythonPath, [scriptPath], {
    env: env
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
}

function stopPythonServer() {
  if (pythonServer) {
    pythonServer.kill();
  }
}

function createWindow() {
  mainWindow = new electron.BrowserWindow({
    // fullscreen: true,
    icon: path.join(__dirname, '../../public/Lizi.ico'),
    webPreferences: {
      preload: path__namespace.join(__dirname, "../preload/preload.cjs"),
      webSecurity: false
    }
  });

  electron.Menu.setApplicationMenu(null);

  mainWindow.loadURL("http://localhost:5173");

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

electron.app.whenReady().then(() => {
  electron.ipcMain.handle("dialog:openFile", handleFileOpen);
  startPythonServer(); // Start the Python server when Electron is ready
  createWindow();
});

electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});

electron.app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

electron.app.on("before-quit", () => {
  isQuiting = true;
  stopPythonServer(); // Stop the Python server when Electron app is quitting
});