if (process.platform !== "darwin") module.exports = {};
else
    // 默认情况下electron_builder不会使用第三方工具打包Mac安装包，而是使用Mac操作系统下XBuild提供的命令行工具完成打包和签名的工作，
    // 所以开发者要制作Mac安装包的话需要先安装XBuild开发工具，identity 属性是签名证书的标记字符串，如果开发者不提供此配置，
    // electron_builder也能完成打包工作，只不过生成的安装包没有签名，最终用户安装时，需要用户确认授权后方可安装。
  module.exports = {
    icon: "resource/unrelease/icon.icns",
    type: "distribution",
    identity:
        "Apple Distribution: Hangzhou ****** System Technology Co., Ltd. (******BACWL)",
  };
