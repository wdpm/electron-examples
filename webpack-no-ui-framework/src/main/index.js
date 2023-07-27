import { app, BrowserWindow } from 'electron'
import * as path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'
let mainWindow

function createMainWindow() {
  const window = new BrowserWindow({webPreferences: {nodeIntegration: true}})
  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(`file://${path.join(__dirname, 'index.html')}`)
  }
  return window
}
app.on('ready', () => {
  mainWindow = createMainWindow()
})