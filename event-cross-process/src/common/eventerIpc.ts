let {ipcRenderer, ipcMain, webContents} = require("electron");
let events = require("events");

// 这个文件是work的。

// 性能问题，比如绝大多数事件只会在当前进程发射和接收，只有少部分的事件是需要跨进程传递的。
// 使用这个机制之后程序会做很多无意义的工作(if判断)，
// 只要在事件的消息体内增加一个开关变量，比如叫作isCrossProcess，当这个变量值为true时，我们再执行跨进程的逻辑即可。
// 具体为根据isCrossProcess的值来包裹【ipcMain和ipcRenderer判断代码块】
class Eventer {
    private instance;

    emit(eventName, eventArgs) {
        // 发送给自身
        this.instance.emit(eventName, eventArgs);

        // 如果在主线程，发送给其他渲染进程
        if (ipcMain) {
            webContents.getAllWebContents().forEach((wc) => {
                wc.send("__eventPipe", {eventName, eventArgs});
            });
        }

        // 如果在渲染进程，发送给主进程
        if (ipcRenderer) {
            ipcRenderer.invoke("__eventPipe", {eventName, eventArgs});
        }
    }

    on(eventName, callBack) {
        // onXXX 委托给EventEmitter 实例
        this.instance.on(eventName, callBack);
    }

    initEventPipe() {
        // 如果在渲染线程，那就监听__eventPipe，如果收到事件，那就
        // - 发送事件给自身
        if (ipcRenderer) {
            ipcRenderer.on("__eventPipe", (e, {eventName, eventArgs}) => {
                this.instance.emit(eventName, eventArgs);
            });
        }

        // 如果在主线程，那就监听__eventPipe，如果收到事件，那就
        // - 发送事件给自身
        // - 发送事件给所有渲染进程
        if (ipcMain) {
            ipcMain.handle("__eventPipe", (e, {eventName, eventArgs}) => {
                this.instance.emit(eventName, eventArgs);
                webContents.getAllWebContents().forEach((wc) => {
                    if (wc.id != e.sender.id) {
                        wc.send("__eventPipe", {eventName, eventArgs});
                    }
                });
            });
        }
    }

    constructor() {
        this.instance = new events.EventEmitter();
        this.instance.setMaxListeners(Infinity);
        this.initEventPipe();
    }
}

export let eventer = new Eventer();