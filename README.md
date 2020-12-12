# vue-electron-app-starter
![Build Electron App](https://github.com/wdpm/vue-electron-app-starter/workflows/Build%20Electron%20App/badge.svg?branch=main)

## Project command line
```
"serve": "vue-cli-service serve",
"build": "vue-cli-service build",
"lint": "vue-cli-service lint",
"electron:build": "vue-cli-service electron:build",
"electron:build-win": "vue-cli-service electron:build -w",
"electron:build-mac": "vue-cli-service electron:build -m",
"electron:build-linux": "vue-cli-service electron:build -l",
"electron:serve": "vue-cli-service electron:serve",
"electron:publish": "vue-cli-service electron:build -p always",
"electron:publish-win": "vue-cli-service electron:build -w -p always",
"electron:publish-mac": "vue-cli-service electron:build -m -p always",
"electron:publish-linux": "vue-cli-service electron:build -l -p always",
"electron:generate-icons": "electron-icon-builder --input=./public/icon.png --output=public --flatten",
"release": "vue-cli-service electron:build -mwl -p always",
"postinstall": "electron-builder install-app-deps",
"postuninstall": "electron-builder install-app-deps"
```

## todo
- setup FOSSA for license scan
