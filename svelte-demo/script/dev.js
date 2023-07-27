let { spawn } = require("child_process");
const rollup = require("rollup");
let typescript = require("@rollup/plugin-typescript");
let commonjs = require("@rollup/plugin-commonjs");
let svelte = require("rollup-plugin-svelte");
let { default: resolve } = require("@rollup/plugin-node-resolve");
let livereload = require("rollup-plugin-livereload");
let sveltePreprocess = require("svelte-preprocess");
let css = require("rollup-plugin-css-only");
let sirv = require("sirv");
let dev = {
  electronProcess: null,
  async buildMain() {
    let inputOptions = {
      input: "src/main/main.ts",
      plugins: [
        typescript({ sourceMap: true, inlineSources: true }),
        commonjs(),
      ],
      external: ["electron"],
    };
    let bundle = await rollup.rollup(inputOptions);
    let outputOption = {
      file: "public/entry.js",
      format: "cjs",
      sourcemap: true,
    };
    await bundle.write(outputOption);
  },
  renderServerPlugin() {
    let server;
    function toExit() {
      console.log("exit", server);
    }
    return {
      writeBundle() {
        if (server) return;
        fn = sirv("public", { dev: true });
        server = require("http").createServer(fn);
        server.listen(5916, "localhost", (err) => {
          if (err) throw err;
        });
      },
    };
  },
  async buildRender() {
    let inputOptions = {
      input: "src/render/main.ts",
      plugins: [
        svelte({
          preprocess: sveltePreprocess({ sourceMap: true }),
          compilerOptions: { dev: true },
        }),
        css({ output: "bundle.css" }),
        resolve({ browser: false, dedupe: ["svelte"] }),
        commonjs(),
        typescript({ sourceMap: true, inlineSources: true }),
        this.renderServerPlugin(),
        livereload("public"),
      ],
      external: ["electron"],
    };
    let bundle = await rollup.rollup(inputOptions);
    let outputOption = {
      sourcemap: true,
      format: "cjs",
      name: "app",
      file: "public/build/bundle.js",
    };
    await bundle.write(outputOption);
    rollup.watch({ ...inputOptions, output: outputOption });
  },
  startMain() {
    this.electronProcess = spawn(
      require("electron").toString(),
      ["public/entry.js"],
      {
        cwd: process.cwd(),
      }
    );
    this.electronProcess.on("close", () => {
      this.electronProcess.kill(0);
      process.exit();
    });
    this.electronProcess.stdout.on("data", (data) => {
      data = data.toString();
      console.log(data);
    });
  },
  async start() {
    await this.buildRender();
    await this.buildMain();
    this.startMain();
  },
};
dev.start();
