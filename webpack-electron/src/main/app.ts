import { app, BrowserWindow, protocol } from "electron";
import path from "path";
import fs from "fs";
import test from "./test";

// file://协议无法处理这种情况：通过src="/logo.png"这样的路径查找根目录下的图片。
// 因此，一般最佳做法是自定义协议，然后注册
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      supportFetchAPI: true,
      secure: true,
      corsEnabled: true,
    },
  },
]);
let mainWindow;
let log = (str) => {
  fs.appendFileSync(`d:\\log.txt`, str + "\r\n");
};
app.on("ready", () => {
  protocol.registerBufferProtocol("app", (request, response) => {
    let pathName = new URL(request.url).pathname;
    let extension = path.extname(pathName).toLowerCase();

    // 如果文件扩展名为空，我们则认为这个请求是一个页内跳转
    // （Vue Router创建的连接都是页内跳转），无须任何响应
    if (!extension) return;

    pathName = decodeURI(pathName);
    log(pathName);
    let filePath = path.join(process.resourcesPath, "app.asar", pathName);
    log(filePath);
    fs.readFile(filePath, (error, data) => {
      if (error) return;
      let mimeType = "";
      if (extension === ".js") {
        mimeType = "text/javascript";
      } else if (extension === ".html") {
        mimeType = "text/html";
      } else if (extension === ".css") {
        mimeType = "text/css";
      } else if (extension === ".svg") {
        mimeType = "image/svg+xml";
      } else if (extension === ".json") {
        mimeType = "application/json";
      }
      log(data);
      response({ mimeType, data });
    });
  });
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  if (app.isPackaged) {
    log("app://./index.html");
    mainWindow.loadURL(`app://./index.html`);
    // mainWindow.loadURL(`https://www.baidu.com`);
  } else {
    mainWindow.loadURL(`http://localhost:${process.env.WEB_PORT}/`);
  }
  //   console.log(test);
  log(JSON.stringify(test));
});
