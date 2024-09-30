const {app, BrowserWindow} = require('electron')
const path = require('path')

let mainWindow

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        frame: false,            // Remove window frame
        transparent: true,       // Allow transparency
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false  // Allow Electron to load HTML/CSS/JS
        }
    })

    // Load the HTML file
    mainWindow.loadFile('index.html')

    mainWindow.on('closed', () => {
        mainWindow = null
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})