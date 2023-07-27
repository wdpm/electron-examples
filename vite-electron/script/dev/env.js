module.exports = {
  APP_VERSION: require("../../package.json").version,
  ENV_NOW: "development",
  PROTOBUF_SERVER: "******.com",
  SENTRY_SERVICE: "https://******.com/34",
  //屏蔽Electron开发者调试工具中的安全警告
  ELECTRON_DISABLE_SECURITY_WARNINGS: true,
};
