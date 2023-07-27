import { app, BrowserWindow, dialog } from "electron";
import { WindowConfig } from "./WindowConfig";

app.commandLine.appendSwitch("--disable-site-isolation-trials");
class App {
  win: BrowserWindow;
  winCanBeClosedFlag = false;
  createWindow() {
    let config = new WindowConfig();
    config.frame = true;
    config.width = 1024;
    config.height = 800;
    config.show = true;
    this.win = new BrowserWindow(config);
    this.win.loadURL(`http://localhost:900/#index`);
    this.win.on("close", async (e) => {
      console.log("win close");
      if (!this.winCanBeClosedFlag) {
        e.preventDefault();
        let choice = await dialog.showMessageBox(this.win, {
          title: "do you want to close",
          message: "你确定要关闭窗口吗？",
          buttons: ["否", "是"],
        });
        if (choice.response == 1) {
          this.winCanBeClosedFlag = true;
          this.win.close();
          return;
        }
      }
      this.winCanBeClosedFlag = false;
    });
    this.win.on("closed", () => {
      console.log("win closed");
    });
  }
  constructor() {
    app.on("ready", async () => {
      this.createWindow();
    });

    app.on("window-all-closed", async () => {
      console.log("window-all-closed");
      app.quit();
    });
    app.on("before-quit", async () => {
      console.log("before-quit");
    });
    app.on("will-quit", async () => {
      console.log("will-quit");
    });
    app.on("quit", async () => {
      console.log("quit");
    });
    // setTimeout(() => {
    //   app.quit();
    // }, 6000);
  }
}

globalThis.appEntry = new App();

// win close 第一次
// win close 第二次
// win closed
// window-all-closed
// before-quit
// will-quit
// quit
