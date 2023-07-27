let path = require("path");
let fs = require("fs-extra");
let os = require("os");
let builder = require("electron-builder");
let vite = require("vite");
let esbuild = require("esbuild");
let release = {
  bundledDir: path.join(process.cwd(), "release/bundled"),
  async buildRender() {
    let options = {
      root: process.cwd(),
      build: {
        enableEsbuild: true,
        minify: false,
        outDir: this.bundledDir,
        alias: {
          "/@/": path.resolve(__dirname, "./src"),
        },
        optimizeDeps: {
          exclude: ["process"],
        },
      },
    };
    await vite.build(options);
  },
  preparePackageJson() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
    localPkgJson.main = "entry.js";
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.devDependencies = { electron: electronConfig };
    fs.writeFileSync(
      path.join(this.bundledDir, "package.json"),
      JSON.stringify(localPkgJson)
    );
    fs.mkdirSync(path.join(this.bundledDir, "node_modules"));
  },
  buildMain() {
    let outfile = path.join(this.bundledDir, "entry.js");
    let entryFilePath = path.join(process.cwd(), "src/main/app.ts");
    esbuild.buildSync({
      entryPoints: [entryFilePath],
      outfile,
      minify: true,
      bundle: true,
      platform: "node",
      sourcemap: false,
      external: ["electron"],
    });
    let js = `${this.getEnvScript()}${os.EOL}${fs.readFileSync(outfile)}`;
    fs.writeFileSync(outfile, js);
  },
  buildInstaller() {
    let options = {
      config: {
        directories: {
          output: path.join(process.cwd(), "release"),
          app: this.bundledDir,
        },
        files: ["**"],
        extends: null,
        productName: "myApp",
        appId: "com.test.myApp",
        asar: true,
        win: {
          target: [
            {
              target: "nsis",
              arch: ["ia32"],
            },
          ],
        },
        nsis: nsisConfig,
        publish: [{ provider: "generic", url: "" }],
      },
      project: process.cwd(),
    };
    return builder.build(options);
  },
  async start() {
    if (!fs.existsSync(this.bundledDir)) {
      fs.mkdirSync(this.bundledDir, { recursive: true });
    }
    await this.buildRender();
    await this.preparePackageJson();
    await this.buildMain();
    await this.buildInstaller();
  },
};
release.start();
