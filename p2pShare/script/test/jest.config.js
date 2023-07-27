let dev = require("./index");
module.exports = async () => {
  let app = await dev.start();
  return {
    rootDir: process.cwd(),
    testMatch: ["/test/**/*.js"],
    globals: {
      app,
    },
  };
};
