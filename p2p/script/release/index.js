let vite = require("vite");
let path = require("path");
let esbuild = require("esbuild");
let os = require("os");
let fs = require("fs");
let vue = require("@vitejs/plugin-vue");

let dev = {
  getEnvScript() {
    let env = require("./env.js");
    let script = "";
    for (let v in env) {
      script += `process.env.${v}="${env[v]}";`;
    }
    script += `process.env.RES_DIR = process.resourcesPath;`;
    return script;
  },
  buildMain() {
    let entryFilePath = path.join(process.cwd(), "src/main/app.ts");
    let outfile = path.join(process.cwd(), "release/bundled/entry.js");
    esbuild.buildSync({
      entryPoints: [entryFilePath],
      outfile,
      minify: true,
      bundle: true,
      platform: "node",
      sourcemap: false,
      external: ["electron"],
    });
    let envScript = this.getEnvScript();
    let js = `${envScript}${os.EOL}${fs.readFileSync(outfile)}`;
    fs.writeFileSync(outfile, js);
  },
  async buildRender() {
    let options = {
      root: process.cwd(),
      build: {
        enableEsbuild: true,
        minify: true,
        outDir: path.join(process.cwd(), "release/bundled"),
      },
      plugins: [vue()],
    };
    await vite.build(options);
  },
  buildModule() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.main = "entry.js";
    localPkgJson.devDependencies = { electron: electronConfig };
    fs.writeFileSync(
      path.join(process.cwd(), "release/bundled/package.json"),
      JSON.stringify(localPkgJson)
    );
    fs.mkdirSync(path.join(process.cwd(), "release/bundled/node_modules"));
  },
  buildInstaller() {
    let options = {
      config: {
        directories: {
          output: path.join(process.cwd(), "release"),
          app: path.join(process.cwd(), "release/bundled"),
        },
        files: ["**"],
        extends: null,
        productName: "yourProductName",
        appId: "com.yourComp.yourProduct",
        asar: true,
        extraResources: require("../common/extraResources.js"),
        win: require("../common/winConfig.js"),
        mac: require("../common/macConfig.js"),
        nsis: require("../common/nsisConfig.js"),
        publish: [{ provider: "generic", url: "" }],
      },
      project: process.cwd(),
    };
    let builder = require("electron-builder");
    return builder.build(options);
  },
  async start() {
    await this.buildRender();
    await this.buildMain();
    await this.buildModule();
    this.buildInstaller();
  },
};
dev.start();
