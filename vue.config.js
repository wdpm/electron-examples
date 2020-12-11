// https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/configuration.html

const packageVersion = require('./package.json').version
const packageName = require('./package.json').name
const artifactNameInAppId = packageName.replace(/-/g, '_')
const winIconPath = './public/icons/icon.ico'

module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      // for more options, see https://www.electron.build/configuration/configuration
      // you can use file macros(https://www.electron.build/file-patterns#file-macros) such as ${name} – package.json name
      builderOptions: {
        publish: ['github'],
        productName: `${packageName}`,
        appId: `com.dd_center.${artifactNameInAppId}`,
        copyright: 'Copyright © 2020 DD-Center',
        // files: [
        //   'dist_electron',
        //   'public'
        // ],
        // directories: {
        //   output: 'build'
        // },
        releaseInfo: {
          releaseName: `${packageVersion} 版本更新`
          // waring: releaseNotes will override github release notes. if you want to override github release note, enable it
          // releaseNotes: packageVersion + ' change log'
        },
        win: {
          icon: winIconPath
        },
        // nsis configuration. see https://www.electron.build/configuration/nsis
        nsis: {
          artifactName: `${packageName}-${packageVersion}-setup.exe`,
          oneClick: false,
          perMachine: false, // false means can choose specific user or global installation
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          installerIcon: winIconPath,
          uninstallerIcon: winIconPath,
          installerHeaderIcon: winIconPath,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: 'Bilibili DD监控室'
        }
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map',
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
    plugins: []
  }
}
