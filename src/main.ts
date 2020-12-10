import Vue from 'vue'
import App from './app/App.vue'
import router from './app/router'
import store from './app/store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

declare const window: any
const ipcRenderer = window.ipcRenderer
ipcRenderer.on('download-progress', (msg: any) => {
  console.log('download-progress', msg)
})
