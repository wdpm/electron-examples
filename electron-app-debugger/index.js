let path = require("path");
let { spawn } = require("child_process");
let http = require("http");
let os = require("os");
const { config } = require("process");
let debug = {
  port: {
    node: 7676,
    page: 7878,
  },
  startTarget() {
    let exeFile = `D:\\Code\\OtherGithubProjects\\simple-but-profound-electron\\vite-electron\\release\\win-ia32-unpacked\\yourProductName.exe`;
    let childProcess = spawn(
      exeFile,
      [
        `--inspect=${this.port.node}`,
        `--remote-debugging-port=${this.port.page}`,
      ],
      {
        cwd: path.dirname(exeFile),
      }
    );
    childProcess.on("close", () => {
      console.log("closed");
    });
    childProcess.on("error", (error) => {
      console.error(error);
    });
    childProcess.stdout.on("data", (data) => {
      data = data.toString();
      //   console.log(data); //主进程在控制台输出的内容
    });
  },
  async getDebugUrl() {
    let result = [];
    for (let key in this.port) {
      let configs = await this.fetch(`http://127.0.0.1:${this.port[key]}/json`);
      configs = JSON.parse(configs);
      for (let config of configs) {
        let devUrl = config.devtoolsFrontendUrl.replace(
          /^\/devtools/,
          "devtools://devtools/bundled"
        );
        let item = {
          title: config.title,
          type: config.type,
          url: config.url,
          devUrl,
        };
        result.push(item);
      }
    }
    return result;
  },
  fetch(url) {
    return new Promise((resolve, reject) => {
      let result = "";
      http.get(url, (res) => {
        if (res.statusCode !== 200) reject();
        res.on("data", (chunk) => (result += chunk.toString()));
        res.on("end", () => resolve(result));
        res.on("error", () => reject());
      });
    });
  },
  sleep(span) {
    return new Promise((resolve) => setTimeout(resolve, span));
  },
  async start() {
    this.startTarget();
    await this.sleep(6000);
    let result = await this.getDebugUrl();
    console.log(result);
  },
};
debug.start();
