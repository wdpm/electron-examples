// node --inspect=1809 --remote-debugging-port=1810 index.js

let { app, BrowserWindow } = require('electron')
let path = require("path")
let mainWindow

function createMainWindow () {
  let window = new BrowserWindow({ webPreferences: { nodeIntegration: true } })
  window.loadFile(path.join(process.cwd(), "index.html"))
  return window
}
app.on('ready', () => {
  mainWindow = createMainWindow()
})