let path = require("path");
let fs = require("fs");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let { CleanWebpackPlugin } = require("clean-webpack-plugin");
let dev = require("./script/dev/index.js");

class ElectronBuilderPlugin {
  apply(compiler) {
    compiler.hooks.done.tapAsync(
      "ElectronBuilderPlugin",
      (compilation, callback) => {
        let flag = fs.existsSync(
          path.join(process.cwd(), "dist/main.bundle.js")
        );
        let flag2 = fs.existsSync(path.join(process.cwd(), "dist/index.html"));
        console.log(`This is an example plugin! ${flag} ${flag}`);
        callback();
      }
    );
  }
}

module.exports = {
  entry: {
    entry: "./src/main/app.ts",
    ...dev.getRendererEntry(),
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    port: 1600,
    after: function (app, server, compiler) {
      console.log(server.options.port);
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      chunks: ["index"],
      filename: "index.html",
      minify: true,
    }),
    new HtmlWebpackPlugin({
      chunks: ["another"],
      filename: "another.html",
      minify: true,
    }),
    new ElectronBuilderPlugin(),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
