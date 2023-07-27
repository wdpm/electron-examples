## 安装

- 使用electron_config_cache的环境变量来自定义缓存目录
- `npm run dev` => `electron.cmd ./index.js` => `node /node_modules/electron/cli.js ./index.js`
- .npmrc文件夹可以在项目根目录放置，纳入GIT版本控制。

## 原理

- Electron使用了Chromium的渲染引擎来显示HTML、CSS和JavaScript，同时使用了Node.js的环境来访问操作系统的API和文件系统等功能。
  在Electron中，你可以使用渲染进程和主进程来分别处理前端和后端的逻辑。
- electron为Node运行时添加了许多扩展模块，这些模块提供了本地机器访问的能力。
- Mojo框架完成的进程间IPC通信。

## 打包

- electron-builder vs electron-packager
- package.json文件的devDependencies配置节应包含一个 electron项，并明确当前项目所使用的Electron版本，这个信息将被提供
  给electron-builder，在electron-builder制成安装包时使用正确的Electron 版本。
- electron-builder下载Electron时使用的镜像环境 变量为ELECTRON_BUILDER_BINARIES_MIRROR，缓存路径环境变量为
  ELECTRON_BUILDER_CACHE。
- 伪交叉编译：下载预先制作的某个electron平台包。
- app-builder.exe 负责下载electron远程依赖包。
- 虽然electron-builder支持编译并安装原生模块，但不推荐使用它的 这个能力。建议使用electron-rebuild工具（https://github.com/electron/electron-rebuild）
先把原生模块编译好，再通过extraResources 的方式把编译好的addon文件配置到你的安装包内。
- NSIS打包。
- electron-updater 与对应的latest.yml文件协作。
- elevate.exe，可以通过Node.js的内置模块child_process来使用elevate.exe启动你的目标程序。
- MAC OS升级机制：当electron-updater下载并验证过安装文件后，并不能直接把安装包 交给Squirrel.Mac进行升级，
而是需要在本地启动一个localhost的http服务，以Squirrel.Mac要求的方式提供响应。https://github.com/Squirrel/Squirrel.Mac

## 起步

- electron-vue或vue-cli-plugin-electron-builder是脚手架。
- 初始化 electronand vite
  ```bash
  > npm init vite-app project-name
  > cd project-name
  > npm install
  > npm install electron --save-dev
  ```
- 使用dotenv库来设置环境变量：https://github.com/motdotla/dotenv
- 在渲染进程中使用环境变量必须写作：`process["env"].XXX`，以防Vite编译时改写你的代码。
- Spectron is officially deprecated as of February 1, 2022. 
Easily test your Electron apps using [ChromeDriver](https://sites.google.com/chromium.org/driver) and WebdriverIO.

## 应用分发
- js代码混淆：`npm install -g javascript-obfuscator`
- 应用签名，只能购买，没有免费的个人自签模式。在 uploadToSign 函数中获取config，并使用curl上传需要签名的exe文件。
`-O`表示接受响应并覆盖文件。
- 静默安装 `yourAppInstaller.exe /S`。然而静默安装的Electron应用存在一个问题：由于静默安装工作执行
完成后，安装进程不会启动Electron应用，所以一些比较特殊的逻辑就得不到执行，比如Electron的开机自启动逻辑。
    ```
    // Electron提供了开机自启动的API给开发者使用
    app.setLoginItemSettings({ openAtLogin: true })
    ```
  可以通过nsis的nsh脚本来实现。
- 自定义安装画面。ultimatepp（www.ultimatepp.org）、gaclib（http://vczh-libraries.github.io/）
- 软件防杀，主动上报软件到白名单。

## 其他
- app.getPath("userData")，参数还可以提供：home。desktop、documents、downloads、pictures、music、video。
- 注册表。如果开发者使用Electron提供的开机自启动API为应用程序设置了开机自启动功能，在Windows操作系统下，用户注册表此路径（计算机
\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run）下会增加如下键值对。
  ```
  键：electron.app.[yourAppName]
  值：C:\Program Files
  (x86)\[yourAppName]\[yourAppName].exe
  ```
- 常规安装的对应卸载的注册表项目。
    ```
    计算机\HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall
    计算机\HKEY_LOCAL_MACHINE\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall
    计算机\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Uninstall
    ```
- 外部应用唤起: 开发者使用app对象的setAsDefaultProtocolClient方法把自己的应用设置成可以通过外部连接唤起的应用。
以GithubDesktop APP为例。
```
键：计算机\HKEY_CURRENT_USER\Software\Classes\github-windows\shell\open\command
值："C:\Users\[USER]\AppData\Local\GitHubDesktop\app-2.9.0\GitHubDesktop. exe" --protocol-launcher "%1"
```
- 自研逆向调试工具。
- 子应用实现：iframe、微前端、webview（webPreferences的属性webviewTag设置为true）、BrowserView（仅主进程）

## 实践
- Tiny 200 byte functional event emitter / pubsub. https://github.com/developit/mitt

## 事件通信
- 事件通信。ipcMain.handle和ipcRenderer.invoke方法，ipcMain.on和ipcRenderer.send方法。
> 但ipcMain.handle和ipcRenderer.invoke方法提供的是Promise风格的
  API，在ipcMain.handle的回调方法里可以直接返回一个值给渲染进程，
  通过await ipcRenderer.invoke方法就可以得到这个返回值。ipcMain.on
  和ipcRenderer.send则没有这么灵活，所以建议优先选择使用
  ipcMain.handle和ipcRenderer.invoke方法完成渲染进程与主进程通信的需求。

- 通用事件建模。

| 字段名 | 描述 |
| --- | --- |
| from * | 事件的发送者 |
| to * | 事件的接收者 |
| msg * | 事件的消息主题 |
| timestamp * | 事件发生的时间戳 |
| type *| 事件的类型，例如“消息”、“通知”、“错误”等。这个可以区分用户事件还是系统事件 |
| priority | 事件的优先级，例如“高”、“中”、“低”等 |
| status | 事件的状态，例如“已发送”、“已读取”、“未读取”等 |
| content | 事件的具体内容，例如消息正文、通知内容等 |
| attachments | 事件的附件，例如图片、文件等 |
| tags | 事件的标签，例如“工作”、“个人”、“重要”等 |

```json
{
  "from": "Alice",
  "to": "Bob",
  "msg": "Hello, how are you?",
  "timestamp": "2023-07-25T10:30:00Z",
  "type": "message",
  "priority": "medium",
  "status": "sent",
  "content": "Hey Bob, just wanted to check in and see how you're doing. Let's catch up soon!",
  "attachments": [
    {
      "name": "vacation_photo.jpg",
      "url": "https://example.com/vacation_photo.jpg"
    },
    {
      "name": "report.pdf",
      "url": "https://example.com/report.pdf"
    }
  ],
  "tags": [
    "personal",
    "friends"
  ]
}
```

## 窗口池
- 和线程池、连接池的原理一致，都是使用了资源池化的技术来使得利用资源的效率更高。具体实现是使用一个array自行管理。
- modal遮罩层的实现。
  - 通过setSkipTaskbar方法控制窗口不显示在任务栏区域，
  - 接着通过setParentWindow方法设置父窗口，
  - 然后通过webContents.executeJavaScript方法迫使除这个模态窗口之外的所有其他窗口执行一段JavaScript脚本，给其他窗口添加遮罩层。
  - 当模态窗口关闭时，要把其他窗口的遮罩层去掉，在这个模态窗口的关闭事件中增加JS逻辑。
  
## 原生模块
- node-gyp为特定Node版本编译原生模块。
- 模块开发有两种方式：C语言模块原生开发；使用Node-API开发。
- 步骤。
```
npm i -g node-gyp
node-gyp configure
node-gyp build
```
输出在 `build\Release\addon.node` 路径,使用test.js测试。
- 使用electron-rebuild 来针对Electron内置的ABI来编译你的原生模块。

## 应用控制

- 应用单开；
```js
import { app } from 'electron'
let appInstanceLock = app.requestSingleInstanceLock()
  if (!appInstanceLock) {
app.quit()
} else {
  startYorApp() 
}

app.on('second-instance', (e, argv) => {
  mainWindow.show()
})
```
- 注册唤起协议等内容；
```typescript
import { app } from 'electron'
app.setAsDefaultProtocolClient('yourAppProtocal')

private getSchemaParam = async (argv) => {
    let url = argv.find(str => str.startsWith("YourAppName:// "))
    if (!url) return;
    // your code
}

// 需要注意的是，如果你的应用禁用了应用多开的能力，那么你需要考虑在app的second-instance事件中接收外部应用唤起本应用的url参数

// 如果你的应用并没有启动，用户点击了YourAppName://连接，操作
// 系统会唤起你的应用，你应该记下连接内的信息，待应用正常启动后，再让应用执行连接中的信息对应的任务

app.on('second-instance', (e, argv) => {
    this.getSchemaParam(argv)
    mainWindow.show() // 点击启动图标，唤醒窗口
})
```
- 控制外部应用，比如唤起外部应用、封装第三方dll并为Electron所用等。
```js
async function _spawn(exe: string, args: Array<string>): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const process = spawn(exe, args, {
        detached: true,
        stdio: "ignore",
      })
      process.on("error", error => {
        reject(error)
      })
      // 去掉进程间的父子引用关系
      process.unref()
      if (process.pid !== undefined) {
        resolve(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}
```
- 原生截图方案。
```js
// MAIN
import {BrowserWindow} from "electron";

let win = new BrowserWindow({
  fullscreen: true,
  frame: false,
  resizable: false,
  enableLargerThanScreen: true,
  skipTaskbar: true, // 伪装，不显示状态栏图标
  alwaysOnTop: true,
  show: false, // 默认隐藏
  webPreferences: {
    nodeIntegration: true,
    webSecurity: false
  }
})
win.show();
// ========================

// RENDERER
// 在这个窗口的渲染进程中使用desktopCapturer模块的getSources方法获取到屏幕的图像
let {desktopCapturer, ipcRenderer} = require("electron")
desktopCapturer.getSources({
  types: ['screen'],
  thumbnailSize: {width: 1920, height: 1080} // 实际屏幕尺寸可以通过主进程的screen模块获得
}).then(imgs => {
  yourImgDom.src = imgs[0].thumbnail.toDataURL()
  ipcRenderer.invoke("showWindow") // 屏幕拍照完成后再显示这个窗口，不然这个窗口也会被拍进去
})

// NEXT
// 使用第三方库完成图像截取并保存为本地文件或写入用户剪贴板。这里图像截取操作可以使用HTML 5的Canvas技术实现，也可以使用
// 现成的库，比如Jimp（https://github.com/oliver-moran/jimp）或ImageMagick（https://imagemagick.org）
```

- 使用第三方截图库。
  - `execFile(yourExePath)` 
  - MAC OS: `spawn('screencapture', ["-c","-i"])`
  
## Electron与Qt的整合

- 一旦我们注册了app对象的window-all-closed事件，那么before-quit、will-quit和quit事件都不会再自动触发了，应用也不会退出，
除非我们在window-all-closed事件的回调函数中执行app对象的quit方法。
- 当用户关闭最后一个窗口时，先触发窗口对象的close事件，再触发closed事件，接着依次触发window-all-closed
（其处理函数调用了app.quit方法）、before-quit、will-quit和quit事件。
- 当用户调用了app对象的quit方法时，先触发app的before-quit事件，再依次触发每个窗口对象的close事件和closed事件，最后依次触发will-
quit和quit事件。也就是说Electron会在before-quit事件之后，尝试关闭所有窗口。
- 两个特例：
  - 如果由autoUpdater.quitAndInstal()退出应用程序，那么在所有窗口触发close事件之后，才会触发before-quit并关闭所有窗口。
  - 在Windows系统中，如果应用程序因系统关机、重启或用户注销而关闭，那么所有这些事件均不会被触发。
- 一个自定义关闭窗口的逻辑。
```js
import {app, BrowserWindow, dialog} from "electron";

// 自定义一个开关变量
let winCanBeClosedFlag = false;
win.on("close", async (e) => {
  if (!winCanBeClosedFlag) {
    e.preventDefault();
    let choice = await dialog.showMessageBox(win, {
      title: "do you want to close",
      message: "你确定要关闭窗口吗？",
      buttons: ["否", "是"],
    });
    if (choice.response === 1) {
      winCanBeClosedFlag = true;
      // 再次触发 win.on("close")调用
      win.close();
      return;
    }
  }
  winCanBeClosedFlag = false;
});
```

## 大数据列表

- 网页技术中，大数据列表通常是分页（切割式按需加载）或者虚拟DOM列表（持续式按需加载）来处理。

原书的例子过于玩具，也存在极大的卡顿，推荐参考开源的虚拟列表实现。

## WebRTC

- peer: server side
- peerjs: client side

## 请求转发和拦截替代
```js
// 拦截替代
function redirectCoreJsRequest() {
  this.win.webContents.session.webRequest.onBeforeRequest(
      {
        urls: ["https://g.targetDomin.com/dt/op-mc/*"]
      },
      (details, cb) => {
        if (details.url.endsWith("vendors.js")) {
          cb({redirectURL: "http://yourDomin.com/download/vendors.js"});
        } else {
          // ?这里的参数不应该是{}，应该是details.url原样透传
          cb({});
        }
      }
  );
}

// inject脚本
win.webContents.once('did-finish-load', async () => {
  let result = await win.webContents.executeJavaScript("window.__my_decrypt(localStorage.getItem('encryptStr'))");
  console.log(result);
})
```

- cookie监控
```js
this.win.webContents.session.cookies.on("changed",
    async (e, cookie, cacuse, removed) => {
     
    }
)
```

## 其他实践指导
- 如何分析首屏（第一个窗口）的加载时间。
- 如何模拟弱网环境测试自己的产品在弱网环境下的表现。
```js
window.webContents.session.enableNetworkEmulation({
latency: 500,
downloadThroughput: 6400,
uploadThroughput: 6400
})
```
或者使用
```js
const dbg = win.webContents.debugger
dbg.attach()
await dbg.sendCommand('Network.enable')
await dbg.sendCommand('Network.emulateNetworkConditions', {
latency: 500,
downloadThroughput: 6400,
uploadThroughput: 6400
})
```
- 数据持久化方案对比
  - Cookie 🆗
  - LocalStorage 🆗
  - SessionStorage 🆗
  - IndexedDB 🆗
  - WebSQL 🚫
  - SQLite 🆗
  - Realm ?观望
  ```
  npm install sqlite3 --build-from-source --runtime=electron --target=12.0.2 --dist-url=https://electronjs.org/headers
  ```
- 加载本地图片注意点
```js
schema.registerFileProtocol('file', (req, cb) => {
    // 有时候要显示用户指定的图片,去掉本地file:///协议
    let pathname = decodeURI(req.url.replace('file:///', ''))
    cb(pathname)
})
```
- 以及桌面端编程的现状和Electron的竞争对手
  - 原生传统派 QT/GTK/CEF
  - 前端派 Electron/Tauri
  - 后起之秀 Flutter-Desktop/MAUI/Compose