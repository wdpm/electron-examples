let path = require("path");
let fs = require("fs");
let { spawn } = require("child_process");
let vite = require("vite");
let esbuild = require("esbuild");
let os = require("os");
let vue = require("@vitejs/plugin-vue");
let dev = {
  bundledDir: path.join(process.cwd(), "release/bundled"),
  server: null,
  serverPort: 900,
  async createServer() {
    let options = {
      configFile: false,
      root: process.cwd(),
      server: {
        port: this.serverPort,
      },
      plugins: [vue()],
      build: {
        rollupOptions: {
          external: ["path", "fs", "os"],
        },
      },
    };
    this.server = await vite.createServer(options);
    await this.server.listen();
  },
  buildMain() {
    let outfile = path.join(this.bundledDir, "entry.js");
    //不能用this.config.main，因为它可能有子路径，主进程必须在根目录下，这样才能让他找到index.html
    let entryFilePath = path.join(process.cwd(), "src/main/app.ts");
    //这个方法得到的结果：{outputFiles: [ { contents: [Uint8Array], path: '<stdout>' } ]}
    esbuild.buildSync({
      entryPoints: [entryFilePath],
      outfile,
      minify: false,
      bundle: true,
      platform: "node",
      sourcemap: true,
      external: ["electron"],
    });
  },
  createElectronProcess() {
    this.electronProcess = spawn(
      require("electron").toString(),
      [path.join(this.bundledDir, "entry.js")],
      {
        cwd: process.cwd(),
      }
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
  async start() {
    if (!fs.existsSync(this.bundledDir)) {
      fs.mkdirSync(this.bundledDir, { recursive: true });
    }
    await this.createServer();
    this.buildMain();
    this.createElectronProcess();
  },
};
dev.start();
