import { app, BrowserWindow } from "electron";
import { WindowConfig } from "./WindowConfig";
import path from "path";
app.commandLine.appendSwitch("--disable-site-isolation-trials");
// app.allowRendererProcessReuse = false;
class App {
  win: BrowserWindow;
  createWindow() {
    let config = new WindowConfig();
    config.frame = true;
    config.width = 1024;
    config.height = 800;
    config.show = true;
    this.win = new BrowserWindow(config);
    this.win.loadURL(`http://localhost:900/#index`);
  }
  constructor() {
    app.on("ready", async () => {
      this.createWindow();
      // let addonPath = path.join(
      //   process.cwd(),
      //   "src/addon/build/Release/addon.node"
      // );
      // let addon = require(addonPath);
      // console.log("addon count", addon.count());
      // console.log("addon obj", addon.getObj());
      // setTimeout(() => {
      //   let addon = require(addonPath);
      //   console.log("addon count", addon.count());
      // }, 6000);
      let addonPath = `D:\\Code\\OtherGithubProjects\\simple-but-profound-electron\\nativeModule\\addonElectron\\addonNodeApi\\build\\Release\\addon.node`;
      let addon = require(addonPath);
      console.log("addon hello", addon.hello());
    });
  }
}

globalThis.appEntry = new App();
