import { app, BrowserWindow } from "electron";
import { WindowConfig } from "./WindowConfig";

app.commandLine.appendSwitch("--disable-site-isolation-trials");
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

class App {
  win1: BrowserWindow;
  win2: BrowserWindow;
  createWindow() {
    let config = new WindowConfig();
    config.frame = true;
    config.width = 1024;
    config.height = 800;
    config.show = true;
    this.win1 = new BrowserWindow(config);
    this.win1.loadURL(`http://localhost:900/#index`);

    // this.win2 = new BrowserWindow(config);
    // this.win2.loadURL(`http://localhost:900/#index`);
  }
  constructor() {
    app.on("ready", async () => {
      this.createWindow();
    });
  }
}

globalThis.appEntry = new App();
