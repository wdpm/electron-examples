import Vue from 'vue'
import App from './app/App.vue'
import router from './app/router'
import store from './app/store'
import { UpdateInfo } from 'electron-updater'
import { ProgressInfo } from 'builder-util-runtime'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

declare const window: any
const ipcRenderer = window.ipcRenderer

ipcRenderer.on('download-progress', (event: Electron.Event, progressInfo: ProgressInfo) => {
  console.log('download-progress', progressInfo)
})

ipcRenderer.on('update-available', (event: Electron.Event, updateInfo: UpdateInfo) => {
  console.log('update-available', updateInfo)
  // we can should dialog here. Now we can show release notes beautifully
  // step1: show dialog with ok/cancel button
  // step2: only when user click ok button, send confirm message to main process

  // now we suppose user click ok button for testing
  setTimeout(() => {
    ipcRenderer.send('user-confirm-download')
  }, 3000)
})
