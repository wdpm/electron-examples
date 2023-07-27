let vite = require("vite");
let vue = require("@vitejs/plugin-vue");
let path = require("path");
let esbuild = require("esbuild");
let os = require("os");
let fs = require("fs");
let spectron = require("spectron");

let dev = {
  server: null,
  serverPort: 1600,
  electronProcess: null,
  async createServer() {
    let options = {
      configFile: false,
      root: process.cwd(),
      server: {
        port: this.serverPort,
      },
      logLevel: "silent",
      plugins: [vue()],
    };
    this.server = await vite.createServer(options);
    await this.server.listen();
  },
  getEnvScript() {
    let env = require("./env.js");
    env.WEB_PORT = this.serverPort;
    env.RES_DIR = path.join(process.cwd(), "resource/release");
    let script = "";
    for (let v in env) {
      script += `process.env.${v}="${env[v]}";`;
    }
    return script;
  },
  buildMain() {
    let entryFilePath = path.join(process.cwd(), "src/main/app.ts");
    let outfile = path.join(process.cwd(), "release/bundled/entry.js");
    esbuild.buildSync({
      entryPoints: [entryFilePath],
      outfile,
      minify: false,
      bundle: true,
      platform: "node",
      sourcemap: true,
      external: ["electron"],
    });
    let envScript = this.getEnvScript();
    let js = `${envScript}${os.EOL}${fs.readFileSync(outfile)}`;
    fs.writeFileSync(outfile, js);
  },
  async createElectronProcess() {
    let app = new spectron.Application({
      path: require("electron").toString(),
      args: [path.join(process.cwd(), "release/bundled/entry.js")],
      workingDirectory: process.cwd(),
    });
    await app.start();
    return app;
  },
  async start() {
    await this.createServer();
    await this.buildMain();
    let app = await this.createElectronProcess();
    return app;
  },
};
module.exports = dev;
