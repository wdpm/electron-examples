'use strict'

import { app, protocol, BrowserWindow, dialog, Menu, shell, MenuItem } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import { checkForUpdates } from './updater'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let mainWindow
let aboutModal

function createAboutModal (parentWindow: Electron.BrowserWindow, devPath: string, prodPath: string) {
  const window = new BrowserWindow({
    parent: parentWindow,
    modal: true,
    width: 400,
    height: 250,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath)
    if (!process.env.IS_TEST) window.webContents.openDevTools()
  } else {
    window.loadURL(`app://./${prodPath}`)
  }

  window.on('close', () => {
    console.log('about page close')
  })
}

async function createWindow (devPath: string, prodPath: string) {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const template = [
    ...(process.platform === 'darwin' ? [{
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []), {
      label: '帮助',
      submenu: [
        {
          label: '检测更新',
          click: (item: MenuItem, focusedWindow: Electron.BrowserWindow) => {
            checkForUpdates(item, focusedWindow)
          }
        },
        {
          label: '关于',
          click: (item: MenuItem, focusedWindow: Electron.BrowserWindow) => {
            createAboutModal(focusedWindow, 'modalUpdate', 'modalUpdate.html')
          }
        }
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template as any)
  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(menu)
  } else {
    win.setMenu(menu)
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string + devPath) // "/"
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    // Load the index.html when not in development
    await win.loadURL(`app://./${prodPath}`) // "index.html"
    await win.webContents.openDevTools()
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow('', 'index.html')
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  // register app:// protocol globally
  if (!process.env.WEBPACK_DEV_SERVER_URL) {
    createProtocol('app')
  }

  await createWindow('', 'index.html')
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
