import { app, BrowserWindow, ipcMain } from "electron";
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
class App {
  win: BrowserWindow;
  private createWindow() {
    this.win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        nodeIntegrationInSubFrames: true,
        enableRemoteModule: true,
        allowRunningInsecureContent: true,
        webSecurity: false,
        enableWebSQL: false,
        spellcheck: false,
        contextIsolation: false,
      },
    });
    this.win.loadURL("http://localhost:5916/");
    this.win.maximize();
    this.win.webContents.openDevTools({ mode: "undocked" });
  }
  private sendSizeChangeMsg() {
    let bounds = this.win.getBounds();
    let msg = {
      width: bounds.width,
      height: bounds.height,
      isMaximized: this.win.isMaximized(),
    };
    console.log('debug: ',msg)
    this.win.webContents.send("windowResize", msg);
  }
  private initEvent() {
    this.win.on("maximize", (e) => this.sendSizeChangeMsg());
    this.win.on("unmaximize", (e) => this.sendSizeChangeMsg());
    this.win.on("resized", (e) => this.sendSizeChangeMsg());
  }
  private initHandle() {
    ipcMain.handle("windowToolCall", (e, param) => {
      if (param == "maxsize") this.win.maximize();
      else if (param == "minisize") this.win.minimize();
      else if (param == "restore") this.win.unmaximize();
      else if (param == "close") this.win.close();
    });
  }
  async start() {
    await app.whenReady();
    this.createWindow();
    this.initEvent();
    this.initHandle();
    // this.win.loadURL("https://www.baidu.com/");
  }
}
globalThis.entry = new App();
globalThis.entry.start();
