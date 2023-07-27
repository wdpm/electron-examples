let events = require("events");
let crypto = require("crypto");
class Eventer {
  private instance;
  emit(eventName, eventArgs) {
    let rnd = crypto.randomBytes(6).toString("hex");
    let now = Date.now();
    let name = `eventerEx${now}${rnd}`;
    let dataStr = JSON.stringify({ eventName, eventArgs });
    localStorage.setItem(name, dataStr);
    this.instance.emit(eventName, eventArgs);
  }
  on(eventName, callBack) {
    this.instance.on(eventName, callBack);
  }
  storageListener() {
    // read or write
    window.addEventListener("storage", (e) => {
      if (e.storageArea != localStorage) return;
      if (e.key && !e.key.startsWith("eventerEx")) return;
      if (!e.newValue) return;
      let dataStr = localStorage.getItem(e.key);
      let data = JSON.parse(dataStr);
      this.instance.emit(data.eventName, data.eventArgs);
      localStorage.removeItem(e.key);
    });
  }
  constructor() {
    this.instance = new events.EventEmitter();
    this.instance.setMaxListeners(Infinity);
    this.storageListener();
  }
}
export let eventer = new Eventer();
