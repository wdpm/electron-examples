const rollup = require("rollup");
let typescript = require("@rollup/plugin-typescript");
let commonjs = require("@rollup/plugin-commonjs");
let svelte = require("rollup-plugin-svelte");
let {default: resolve} = require("@rollup/plugin-node-resolve");
let {terser} = require("rollup-plugin-terser");
let sveltePreprocess = require("svelte-preprocess");
let css = require("rollup-plugin-css-only");
let path = require("path");
let fs = require("fs");
let dev = {
  async buildMain() {
    let inputOptions = {
      input: "src/main/main.ts",
      plugins: [
        typescript({sourceMap: false, inlineSources: false}),
        commonjs(),
        terser(),
      ],
      external: ["electron"],
    };
    let bundle = await rollup.rollup(inputOptions);
    let outputOption = {
      file: "public/entry.js",
      format: "cjs",
      sourcemap: false,
    };
    await bundle.write(outputOption);
  },
  async buildRender() {
    let inputOptions = {
      input: "src/render/main.ts",
      plugins: [
        svelte({
          preprocess: sveltePreprocess({sourceMap: false}),
          compilerOptions: {dev: false},
        }),
        css({output: "bundle.css"}),
        resolve({browser: false, dedupe: ["svelte"]}),
        commonjs(),
        typescript({sourceMap: false, inlineSources: false}),
        // terser模块的主要作用是压缩源码，移除不必要的空格、注释等
        terser(),
      ],
      external: ["electron"],
    };
    let bundle = await rollup.rollup(inputOptions);
    let outputOption = {
      sourcemap: false,
      format: "cjs",
      name: "app",
      file: "public/build/bundle.js",
    };
    await bundle.write(outputOption);
  },
  buildModule() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.main = "entry.js";
    localPkgJson.devDependencies = {electron: electronConfig};
    fs.writeFileSync(
        path.join(process.cwd(), "public/package.json"),
        JSON.stringify(localPkgJson)
    );
    try {
      fs.rmdirSync(path.join(process.cwd(), "public/node_modules"), {force: true});
    } catch (e) {
    }
    fs.mkdirSync(path.join(process.cwd(), "public/node_modules"));
  },
  buildInstaller() {
    let options = {
      config: {
        directories: {
          output: path.join(process.cwd(), "release"),
          app: path.join(process.cwd(), "public"),
        },
        files: ["**/*", "!**/*.map"],
        extends: null,
        productName: "yourProductName",
        appId: "com.yourComp.yourProduct",
        asar: false,
        nsis: {
          perMachine: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "yourProductName",
          oneClick: false,
        },
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
    // 注意该release无效，启动白屏，原因未知
    await this.buildInstaller();
  },
};
dev.start();
