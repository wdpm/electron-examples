import {app, BrowserWindow} from "electron";
import {WindowConfig} from "./WindowConfig";
import {eventer} from "../common/eventerIpc";

app.commandLine.appendSwitch("--disable-site-isolation-trials");

class App {
    win: BrowserWindow;
    win2: BrowserWindow;

    createWindow() {
        let config = new WindowConfig();
        config.frame = true;
        config.width = 1024;
        config.height = 800;
        config.show = true;
        this.win = new BrowserWindow(config);
        this.win.loadURL(`http://localhost:900/#index`);
    }

    createWindow2() {
        let config = new WindowConfig();
        config.frame = true;
        config.width = 1024;
        config.height = 800;
        config.show = true;
        this.win2 = new BrowserWindow(config);
        this.win2.loadURL(`http://localhost:900/#page`);
    }

    constructor() {
        app.on("ready", async () => {
            this.createWindow();
            this.createWindow2();
            // 这里打印效果很差，需要一个机制来区别是发送事件还是接受事件。
            // eventer.on("eventName", (args) => {
            //     console.log('Main Process: ', args);
            // });
            //
            // setTimeout(() => {
            //     eventer.emit("eventName", {
            //         param: `hello from main process`,
            //         from: 'MAIN_PROCESS',
            //         to: 'RENDERER_PROCESS'
            //     });
            // }, 3000);
        });
    }
}

globalThis.appEntry = new App();
