"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
    ipcRenderer: electron.ipcRenderer,
});
