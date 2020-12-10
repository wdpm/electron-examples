// https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/configuration.html
module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        publish: ['github']
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
