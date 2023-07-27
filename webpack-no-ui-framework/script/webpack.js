let HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = function (context) {
  context.plugins.forEach((plugin) => {
    if (plugin.constructor.name === "MiniCssExtractPlugin") {
      plugin.options.filename = "[name].css";
      plugin.options.sourceMap = false;
      plugin.options.moduleFilename = (name) => {
        return "[name].css";
      };
    }
  });
  let addPages = (arr) => {
    for (let name of arr) {
      context.entry[name] = `./src/renderer/${name}.js`;
      let plugin = new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: `./src/renderer/${name}.html`,
        inject: "true",
        hash: false,
        chunks: ["theme", name],
      });
      context.plugins.push(plugin);
    }
  };
  addPages([
    "index",
  ]);
  return context;
};