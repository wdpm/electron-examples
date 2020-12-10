/**
 * original link: https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * This is modified version for me
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
import { dialog, MenuItem, MessageBoxReturnValue } from "electron";
import { autoUpdater, UpdateDownloadedEvent, UpdateInfo } from "electron-updater";

let updater: MenuItem
autoUpdater.autoDownload = false

autoUpdater.on('error', (error: any) => {
  dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString())
})

autoUpdater.on('update-available', (info: UpdateInfo) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: `New version: ${info.version}. do you want update now?`,
    detail: "Change log: " + info.releaseNotes,
    buttons: ['YES', 'NO']
  }).then((returnValue: MessageBoxReturnValue) => {
    if (returnValue.response === 0) {
      autoUpdater.downloadUpdate()
    } else {
      updater.enabled = true
    }
  })
})

// this event sometimes will NOT emit because of differential download
// https://github.com/electron-userland/electron-builder/issues/2521
autoUpdater.on('download-progress', (progressInfo: any) => {
  // do better: show download progress bar
  // mainWindow.send()...
})

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.'
  })
  updater.enabled = true
})

autoUpdater.on('update-downloaded', (updateDownloadedEvent: UpdateDownloadedEvent) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Install Updates',
    message: 'Updates downloaded, choose quit for update, or not update temporarily...',
    buttons: ['quit and install', 'not update temporarily']
  }).then((value: MessageBoxReturnValue) => {
    if (value.response === 0) {
      setImmediate(() => autoUpdater.quitAndInstall())
    }
  })
})

// export this to MenuItem click callback
export function checkForUpdates (menuItem: any, focusedWindow: any) {
  updater = menuItem
  updater.enabled = false
  autoUpdater.checkForUpdates()
}
