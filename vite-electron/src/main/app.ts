let start = Date.now();
import { app, BrowserWindow, protocol } from "electron";
import path from "path";
import fs from "fs";
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
let mainWindow: BrowserWindow;
app.on("ready", () => {
  protocol.registerBufferProtocol("app", (request, response) => {
    let pathName = new URL(request.url).pathname;
    let extension = path.extname(pathName).toLowerCase();
    if (!extension) return;
    pathName = decodeURI(pathName);
    let filePath = path.join(__dirname, pathName);
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
      enableRemoteModule: true,
    },
  });
  if (app.isPackaged) {
    console.log(start, Date.now() - start);
    mainWindow.loadURL(`app://./index.html`);
  } else {
    console.log(start, Date.now() - start);
    mainWindow.loadURL(`http://localhost:${process.env.WEB_PORT}/`);
  }
});
