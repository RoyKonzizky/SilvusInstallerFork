const { app, BrowserWindow, Menu} = require('electron')
const path = require('path')

let mainWindow

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        //frame: false,            // Remove window frame
        transparent: true,       // Allow transparency
        alwaysOnTop: true,       // Keep it always on top
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false  // Allow Electron to load HTML/CSS/JS
        }
    })

    // Load the HTML file
    Menu.setApplicationMenu(null);
    mainWindow.loadFile('index.html')

    // Uncomment to open DevTools for debugging
    // mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => {
        mainWindow = null
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})