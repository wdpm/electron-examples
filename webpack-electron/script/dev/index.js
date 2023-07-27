let fs = require("fs");
let path = require("path");
let { spawn } = require("child_process");
let webpack = require("webpack");
let WebpackDevServer = require("webpack-dev-server");
let { CleanWebpackPlugin } = require("clean-webpack-plugin");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let { merge } = require("webpack-merge");
let baseConfig = require("../common/baseConfig.js");

let dev = {
  server: null,
  serverPort: 1600,
  electronProcess: null,
  injectEnvScript() {
    let env = require("./env.js");
    env.WEB_PORT = this.serverPort;
    env.RES_DIR = path.join(process.cwd(), "resource/release");
    let script = "";
    for (let v in env) {
      script += `process.env.${v}="${env[v]}";`;
    }
    let outfile = path.join(process.cwd(), "release/bundled/entry.js");
    // 注意，设置环境变量的脚本与业务脚本之间并没有换行符：'${script}${fs.readFileSync(outfile)}'，如果这里设置了换行符，代码
    // 映射文件将无法起到调试作用。
    let js = `${script}${fs.readFileSync(outfile)}`;
    fs.writeFileSync(outfile, js);
  },
  buildMain() {
    let config = merge(baseConfig, {
      entry: { entry: path.join(process.cwd(), "./src/main/app.ts") },
      plugins: [new CleanWebpackPlugin()],
      output: {
        filename: "entry.js",
        path: path.join(process.cwd(), "release/bundled"),
      },
      mode: "production",
      devtool: "source-map",
    });
    return new Promise((resolve, reject) => {
      webpack(config).run((err, stats) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        if (stats.hasErrors()) {
          reject(stats);
          return;
        }
        this.injectEnvScript();
        resolve();
      });
    });
  },
  getRendererObj() {
    let result = { entry: {}, plugins: [] };
    let rendererPath = path.join(process.cwd(), "src/renderer");
    let rendererFiles = fs.readdirSync(rendererPath);
    //[ 'another', 'another.html', 'index', 'index.html' ]
    for (let fileName of rendererFiles) {
      if (fileName.endsWith(".html")) continue;
      let plainName = path.basename(fileName, ".html");
      result.entry[plainName] = `./src/renderer/${plainName}/index.ts`;
      result.plugins.push(
        new HtmlWebpackPlugin({
          chunks: [plainName],
          template: `./src/renderer/${plainName}.html`,
          filename: `${plainName}.html`,
          minify: true,
        })
      );
    }
    return result;
  },
  createElectronProcess() {
    this.electronProcess = spawn(
      require("electron").toString(),
      [path.join(process.cwd(), "release/bundled/entry.js")],
      { cwd: process.cwd() }
    );
    this.electronProcess.on("close", () => {
      this.server.close();
      process.exit();
    });
    this.electronProcess.stdout.on("data", (data) => {
      data = data.toString();
      console.log(data);
    });
  },
  startServer() {
    let rendererObj = this.getRendererObj();
    let config = merge(baseConfig, {
      entry: rendererObj.entry,
      plugins: rendererObj.plugins,
      output: {
        filename: "[name].bundle.js",
        path: path.join(process.cwd(), "release/bundled"),
      },
      mode: "development",
      devtool: "source-map",
    });
    let devServerConfig = {
      logLevel: "silent",
      clientLogLevel: "silent",
      contentBase: path.join(process.cwd(), "release/bundled"),
      port: this.serverPort,
      after: async (app, server, compiler) => {
        //即在这个方法中启动Electron子进程
        this.createElectronProcess();
      },
    };
    let compiler = webpack(config);
    this.server = new WebpackDevServer(compiler, devServerConfig);
    this.server.listen(this.serverPort);
  },
  async start() {
    await this.buildMain();
    this.startServer();
  },
};
dev.start();
