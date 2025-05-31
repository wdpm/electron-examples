# Electron playground 笔记摘录

repo: https://github.com/tal-tech/electron-playground

## overview

### scripts

```
"start": "npm run build && electron .",
"clean": "rimraf dist/**",
"dev": "npm run clean && cross-env NODE_ENV=development concurrently \"npm run dev:main\" \"npm run dev:preload\" \"npm run dev:playground\"",
"dev:main": "webpack --config ./build/webpack.config.main.dev.js --watch",
"dev:preload": "webpack --config ./build/webpack.config.preload.js --watch",
"dev:playground": "cross-env PORT=2333 WDS_SOCKET_HOST=localhost WDS_SOCKET_PORT=2333 node build/playground/scripts/start.js",
"build": "npm run clean &&  cross-env NODE_ENV=production concurrently \"npm run build:preload\" \"npm run build:main\" \"npm run build:playground\"",
"build:main": "webpack --config ./build/webpack.config.main.prod.js",
"build:playground": "node build/playground/scripts/build.js",
"build:preload": "webpack --config ./build/webpack.config.preload.js",
"pack-mac": "electron-builder build --mac",
"pack-win": "electron-builder build --win",
"pack-all": "electron-builder build -mw",
"pack": "ts-node ./build/pack.ts --resolveJsonModule",
"lint": "eslint app/ --fix --ext .js,.ts,.tsx",
"server": "http-server -p $npm_package_config_serverPort ./release",
"postinstall": "electron-builder install-app-deps"
```

- start 命令是构建代码后启动 electron app
- clean 是使用 rimraf 来删除 dist 输出目录
- dev 命令先执行 clean，然后使用 cross-env 来执行 dev 环境下的并行命令，dev:main 和 dev:preload 和 dev:playground
- dev:main 对应 webpack 的 main.dev 配置，启动监听模式
- dev:preload 对应 webpack 的 preload 配置，启动监听模式
- dev:playground 对应跨平台运行 playground 的入口文件，设置了必要的端口和 IP
- build 命令先执行 clean，然后并行执行 build:preload、build:main npm 和 run build:playground
- 省略 build 具体指令
- pack-XXX 是使用 electron-builder 构建对应 OS 的输出
- pack 是自定义的 ts 打包指令
- lint eslint 的语法检测
- server 启动 http 服务器
- postinstall 这个指令一般是准备本地开发环境的。主要作用: 安装 dependencies 依赖，重新构建 native modules，执行部分依赖本身的
  postinstall 脚本等。

### dev dependencies

- @babel/core: Babel 核心库，用于 JavaScript 代码转换。
- @commitlint/cli: 校验 Git 提交消息格式是否符合规范。
- @commitlint/config-conventional: 提供 Conventional Commits 规范的提交规则。
- @heibanfe/eslint-config-react: 自定义 ESLint 配置，适用于 React 项目。
- @heibanfe/stylelint-config: 自定义 Stylelint 配置，用于 CSS/Less/Sass 校验。
- @svgr/webpack: 将 SVG 文件转换为 React 组件并在 Webpack 中使用。
- @types/*: 为 JavaScript 库提供 TypeScript 类型定义（如 dotenv-webpack、jest、react 等）。
- autoprefixer: 自动添加 CSS 浏览器前缀。
- awesome-typescript-loader: Webpack 的 TypeScript 加载器。
- babel-eslint: 允许 ESLint 解析 Babel 转换的代码。
- babel-jest: 让 Jest 支持 Babel 转换的测试代码。
- babel-loader: Webpack 的 Babel 加载器。
- babel-plugin-named-asset-import: 支持命名导入静态资源（如图片）。
- babel-preset-env: 根据目标环境自动确定需要的 Babel 插件。
- babel-preset-react-app: Create React App 的 Babel 预设配置。
- babel-preset-stage-0: 支持实验性 JavaScript 语法（如装饰器）。
- camelcase: 将字符串转换为驼峰命名。
- case-sensitive-paths-webpack-plugin: 强制 Webpack 区分文件路径大小写。
- compressing: 压缩 / 解压缩文件（如 zip、tar）。
- concurrently: 并行运行多个命令。
- copy-webpack-plugin: 复制文件 / 目录到 Webpack 输出目录。
- cross-env: 跨平台设置环境变量。
- css-loader: Webpack 的 CSS 加载器。
- dotenv: 从 .env 文件加载环境变量。
- dotenv-expand: 扩展 .env 文件中的变量引用。
- dotenv-webpack: 在 Webpack 中集成 dotenv。
- electron: 构建跨平台桌面应用。
- electron-builder: 打包 Electron 应用。
- eslint: JavaScript/TypeScript 代码检查工具。
- eslint-config-react-app: Create React App 的 ESLint 配置。
- eslint-loader: 在 Webpack 中运行 ESLint。
- eslint-plugin-*: ESLint 插件（如 flowtype、import、React 等）。
- file-loader: Webpack 的文件加载器（处理图片、字体等）。
- fs-extra: 增强版 fs 模块，支持额外文件操作。
- html-webpack-plugin: 生成 HTML 文件并自动注入资源。
- husky: Git 钩子工具，用于提交前检查。
- identity-obj-proxy: Jest 测试中模拟 CSS Modules。
- img-loader: 优化图片并压缩。
- inquirer: 命令行交互式提问工具。
- js-yaml: 解析和生成 YAML 文件。
- less: Less CSS 预处理器。
- less-loader: Webpack 的 Less 加载器。
- lint-staged: 仅对 Git 暂存区的文件运行 Lint。
- markdown-image-loader: 在 Markdown 中处理图片引用。
- mini-css-extract-plugin: 将 CSS 提取为独立文件。
- moment: 日期时间处理库。
- monaco-editor-webpack-plugin: 集成 Monaco 代码编辑器到 Webpack。
- optimize-css-assets-webpack-plugin: 优化和压缩 CSS 资源。
- pnp-webpack-plugin: 支持 Yarn PnP 模式。
- postcss-*: PostCSS 插件（如自动修复 CSS 兼容性问题）。
- prettier: 代码格式化工具。
- raw-loader: 将文件作为字符串导入。
- resolve: 解析模块路径。
- resolve-url-loader: 修复 CSS 中的相对 URL 路径。
- rimraf: 跨平台递归删除文件 / 目录。
- style-loader: 将 CSS 注入到 DOM 中。
- terser-webpack-plugin: 压缩 JavaScript 代码。
- ts-loader: Webpack 的 TypeScript 加载器。
- ts-node: 直接运行 TypeScript 文件。
- ts-pnp: 支持 TypeScript 的 Yarn PnP 解析。
- typescript: TypeScript 编译器。
- url-loader: 将小文件转换为 Base64 URL。
- urllib: HTTP 请求库。
- wait-on: 等待文件 / 端口 /HTTP 服务就绪。
- webpack: 模块打包工具。
- webpack-*: Webpack 插件 / 工具（如分析包大小、开发服务器等）。
- workbox-webpack-plugin: 集成 Workbox 生成 Service Worker。

### dependencies

- **@blueprintjs/core**: Blueprint UI 组件库的核心样式和组件。
- **@blueprintjs/icons**: Blueprint 的图标库。
- **@electron/get**: 下载和管理 Electron 二进制文件。
- **@sentry/electron**: Electron 应用的错误监控和上报工具。
- **antd**: Ant Design React UI 组件库。
- **autobind-decorator**: 自动绑定类方法的装饰器。
- **blueprint**: 旧版 Blueprint UI 库（已弃用，推荐使用 `@blueprintjs/core`）。
- **classnames**: 动态生成 CSS 类名的工具。
- **colors**: 在终端输出彩色文本。
- **dayjs**: 轻量级日期时间处理库（类似 Moment.js）。
- **electron-log**: Electron 应用的日志记录工具。
- **electron-store**: Electron 的本地数据存储（类似 localStorage）。
- **electron-updater**: Electron 应用的自动更新功能。
- **extract-zip**: 解压 ZIP 文件。
- **github-markdown-css**: GitHub 风格的 Markdown 样式。
- **highlight.js**: 代码语法高亮库。
- **log4js**: 灵活的日志记录工具。
- **markdown-image-loader**: 在 Markdown 中处理图片引用的 Webpack 加载器。
- **monaco-editor**: VS Code 的代码编辑器组件。
- **node-machine-id**: 获取当前设备的唯一标识符。
- **query-string**: 解析和序列化 URL 查询字符串。
- **react**: React 核心库。
- **react-app-polyfill**: 为旧浏览器提供 React 兼容性支持。
- **react-copy-to-clipboard**: 复制文本到剪贴板的 React 组件。
- **react-dev-utils**: Create React App 的开发工具集。
- **react-dom**: React 的 DOM 渲染器。
- **react-highlight**: 代码高亮显示的 React 组件。
- **react-markdown**: 将 Markdown 渲染为 React 组件。
- **react-mosaic-component**: 可拖拽布局面板的 React 组件。
- **react-router-dom**: React 的路由管理库（用于 Web）。
- **react-syntax-highlighter**: 语法高亮显示的 React 组件。
- **terminal-in-react**: 在 React 中模拟终端界面。
- **uuid**: 生成唯一标识符（UUID）。
- **yargs**: 命令行参数解析工具。

## app 源码阅读

### logging

使用了 log4js 作为底层实现

```ts
import log4js from 'log4js'

log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
})

const logger = log4js.getLogger('cheese')
export default logger
```

### machineId

使用 node-machine-id 作为底层实现

```ts
import path from 'path'
import url from 'url'

import {machineIdSync} from 'node-machine-id'

let machineId = ''
export const getMachineId = () => {
  if (machineId) {
    return machineId
  }
  try {
    machineId = machineIdSync()
  } catch (err) {
    console.error('Machine ID retrieval failed:', err)
  }
  return machineId
}
```

---

### load browser extension

核心在于处理不同平台的插件路径

```ts
import path from 'path'
import {readdirSync, existsSync} from 'fs'
import {app, session} from 'electron'

const EXTENSION_FOLDER = (function extensionFolder() {
  const {platform} = process

  // 第一步是获取平台变量
  if (platform !== 'darwin' && platform !== 'win32' && platform !== 'linux') {
    throw new Error(`not support platform: ${platform}`)
  }

  // 根据不同平台获取对应的目录路径
  let folderPath!: string
  if (platform === 'darwin') {
    folderPath = path.resolve(
      app.getPath('home'),
      'Library/Application Support/Google/Chrome/Default/Extensions',
    )
  }
  if (platform === 'win32') {
    folderPath = path.resolve(
      app.getPath('home'),
      'AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions',
    )
  }
  if (platform === 'linux') {
    const availablePaths = [
      '.config/google-chrome/Default/Extensions/',
      '.config/google-chrome-beta/Default/Extensions/',
      '.config/google-chrome-canary/Default/Extensions/',
      '.config/chromium/Default/Extensions/',
    ].map(p => path.resolve(app.getPath('home'), p))

    const exactPath = availablePaths.find(p => existsSync(p))
    if (!exactPath) {
      throw new Error('no extension folder')
    }
    folderPath = exactPath
  }

  // 再次检测目录路径 folderPath 是否存在
  if (existsSync(folderPath)) {
    return folderPath
  } else {
    console.error('no extension folder')
    return ''
  }
})()

function addDevToolsExtension(id: string) {
  if (!EXTENSION_FOLDER) return
  const extensionPath = path.resolve(EXTENSION_FOLDER, id)

  if (!existsSync(extensionPath)) {
    return
  }

  // e.g. 特定插件目录下为 6.42.22_0 这种版本格式的目录
  const versionName = readdirSync(extensionPath).find(
    v => existsSync(path.resolve(extensionPath, v)) && /\d+\.\d+\.\d/.test(v),
  )

  if (versionName) {
    session.defaultSession.loadExtension(path.resolve(extensionPath, versionName)).then(r => {
    })
  }
}

const EXTENSION_IDS: string[] = [
  'fmkadmapgofadopljbjfkapdkoienihi', // React Developer Tools
]

export function addDevToolsExtensionAtDevelopmentMode() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  EXTENSION_IDS.forEach(id => addDevToolsExtension(id))
}
```

### date persistence

use electron-store library

```ts
const schema = {
  foo: {
    type: 'string',
    default: 'This is a test default string'
  }
} as const

export default schema
```

```ts
import Store from 'electron-store'
import schema from './schema'

const store = new Store({
  schema,
  migrations: {
    '0.0.2': store => {
      store.set('foo', 'package change string change too')
    },
  },
})

export default store
```

这个库原生支持 migration，其他很多同类型的库都没有提供这一个设计。

### dialog

```ts
import {dialog, BrowserWindow} from 'electron'

/**
 * @internal
 * @param type
 */
function createMessageBoxShow(type: NonNullable<Electron.MessageBoxOptions['type']>) {
  return function dialogShowMessageBox(
    options: Omit<Electron.MessageBoxOptions, 'type'>,
    window?: BrowserWindow,
  ) {
    if (window) {
      return dialog.showMessageBox(window, { type, ...options})
    }
    return dialog.showMessageBox({type, ...options})
  }
}

// 将不同类型的 messageBox 封装成不同方法，简化调用，有点儿类似 antd 的 message、toast 等
export const messageBox = {
  none: createMessageBoxShow('none'),
  info: createMessageBoxShow('info'),
  error: createMessageBoxShow('error'),
  question: createMessageBoxShow('question'),
  warning: createMessageBoxShow('warning'),
}

```

createMessageBoxShow 是一个闭包函数，预设了 type 类型。因此 dialogShowMessageBox 的参数 options，使用 ts 类型排除了 type
属性。

### code-runner

```ts
import {ipcMain, IpcMainEvent} from 'electron'
import util from 'util'

// require 会被 webpack 代理，要使用原生的 require 的话需要做判断
// __webpack_require__ - Webpack 打包后用来替换原生 require 的内部函数
// __non_webpack_require__ - Webpack 提供的特殊变量，指向原生的 require 函数
declare var __webpack_require__: Function
declare var __non_webpack_require__: Function
const nativeRequire = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require

type LogType = 'log' | 'error' | 'warn' | 'info' | 'debug'

export interface LogItem {
  type: LogType
  content: string
}

class MockConsole {
  private _logs: LogItem[] = []

  private createConsole(type: LogType) {
    return (...args: unknown[]) => {
      if (!args.length) {
        return
      }
      try {
        console.log('args', args)
        // util.inspect() 是 Node.js 内置工具模块 util 提供的方法，用于将任意 JavaScript 对象转换为字符串表示形式，便于调试和日志记录。
        const content = args.reduce(
          (prev, curr) => prev + util.inspect(curr, { showHidden: true}),
          '',
        ) as string
        console.log('content', content)
        this._logs.push({type, content})
      } catch (error) {
        console.error(error)
      }
    }
  }

  // getter 属性访问器
  public get logs() {
    return this._logs
  }

  // 预设
  public log = this.createConsole('log')
  public error = this.createConsole('error')
  public warn = this.createConsole('warn')
  public info = this.createConsole('info')
  public debug = this.createConsole('debug')
}
```

上面这个 MockConsole 是对常规 console 的封装，增加了记录日志的功能，记录到内部私有属性 _logs。这样，就方便将日志通过 IPC 返回给前端页面。

下面的代码实现了一个 Electron 应用中的 IPC (进程间通信) 监听器，用于安全地执行从渲染进程发送过来的动态 JavaScript 代码。

```ts
// 在主进程执行 electron 的代码
export function addCodeRunnerListener() {
  ipcMain.on('ACTION_CODE', (event: IpcMainEvent, fnStr: string) => {
    try {
      const mockConsole = new MockConsole()
      const fn = new Function(
        'exports',
        'require',
        'module',
        '__filename',
        '__dirname',
        'console',
        `return function(){
              try{
                ${fnStr}
              }catch(error){
                console.error('程序执行错误',error)
              }
             }`,
      )(exports, nativeRequire, module, __filename, __dirname, mockConsole)
      const result = fn()
      // 如果 fn() 返回了真值（非 undefined/null/0/"" 等，则会将这个结果也记录到模拟控制台中
      if (result) {
        mockConsole.log(result)
      }
      event.returnValue = mockConsole.logs
    } catch (err) {
      console.log('执行动态代码错误', err)
    }
  })
}
```

使用 new Function() 构造函数动态创建函数，注入以下变量：

- exports, require, module: CommonJS 模块系统变量
- __filename, __dirname: 文件路径变量
- console: 使用模拟控制台替代

代码包裹在 try-catch 中以捕获执行错误，立即调用该函数并传入实际参数。上面的 fn 实际上为

```
// tempFunc 
function() {
  try {
    ${fnStr}
  } catch(error) {
    console.error('程序执行错误', error)
  }
}
```

如果 fnStr 中包含 return 语句，例如：`"return 42;"` 或者 `"const a = 1; return a + 1;"`，那么 fn() 就会返回相应的值。
如果没有 return 语句，则返回 undefined。

### menu
这个一般和业务代码深度耦合，几乎没法提取成通用库。

### preload
将一些实用方法挂载到浏览器的window属性之下。

### browser-window

```ts
const OPTIONS: Electron.BrowserWindowConstructorOptions = {
  width: 600,
  height: 640,
  resizable: false,
  titleBarStyle: 'hidden',
  autoHideMenuBar: true,
  frame: false,
  webPreferences: {
    nodeIntegration: true,
    webSecurity: false,
    preload: PRELOAD_FILE,
    enableRemoteModule: true,
  },
}
```
window 窗口需要留意 webPreferences 的配置，nodeIntegration、webSecurity、和preload都是常用的选项。

### file-manager
实现一个文件下载管理器。

先看下相关的utils函数
```ts
import fs from 'fs'
import path from 'path'
import { app, shell } from 'electron'

export { v4 as uuidV4 } from 'uuid'

// 获取文件后缀名
export const getFileExt = (fileName: string): string => path.extname(fileName)

// 拼接路径
export const pathJoin = (...p: string[]): string => path.join(...p)

// 获取文件名
export const getFileName = (fileName: string, defaultName: string): string => {
  // 处理 Windows 文件名不允许的字符： \ / : * ? " < > |
  fileName = fileName.replace(/[\\/:?*"<>|]/g, '') || path.basename(defaultName)
  // 如果为 .开头的隐藏文件，例如.npmrc, 那么使用默认名称defaultName
  fileName = /^\.(.*)/.test(fileName) ? defaultName : fileName

  const extName = getFileExt(fileName)
  if (!extName) {
    const ext = getFileExt(defaultName)
    fileName = `${fileName}.${ext}`
  }

  return decodeURIComponent(fileName)
}

// 获取文件图标。
export const getFileIcon = async (path: string): Promise<string> => {
  const iconDefault = './icon_default.png'
  if (!path) Promise.resolve(iconDefault)

  const icon = await app.getFileIcon(path, {
    size: 'normal',
  })

  return icon.toDataURL()
}

// 检查文件是否存在
export const isExistFile = (path: string): boolean => fs.existsSync(path)

// 删除指定路径文件
export const removeFile = (path: string): void => {
  if (!isExistFile(path)) return
  fs.unlinkSync(path)
}

// 打开文件
export const openFile = (path: string): boolean => {
  if (!isExistFile(path)) return false
  shell.openPath(path).then(r => {})
  return true
}

// 打开文件所在位置
export const openFileInFolder = (path: string): boolean => {
  if (!isExistFile(path)) return false
  shell.showItemInFolder(path)
  return true
}

/**
 * 获取 base64 图片字节
 * @param base64 - base64 字符串
 */
export const getBase64Bytes = (base64: string): number => {
  // data:[MIME类型];base64,[编码数据]
  if (!/^data:.*;base64/.test(base64)) return 0

  // Base64 编码的末尾可能会包含一个或两个 = 作为填充字符（padding），目的是使数据长度符合 Base64 的 4 字节对齐规则。
  // 但是这个末尾的=不是有效载荷，可以去掉。
  // iVBORw0KGgoAAAANSUhEUg==  // 末尾有两个 =
  // iVBORw0KGgoAAAANSUhEUg=   // 末尾有一个 =
  // iVBORw0KGgoAAAANSUhEUg    // 无填充
  const data = base64.split(',')[1].split('=')[0]
  // 这种写法是取string类型的length属性，等效data.length
  const { length } = data

  // base64编码规则：每 3 字节（24 位） 的二进制数据 → 编码为 4 个 Base64 字符。也就是Base64 字符换算成二进制字节要乘以0.75
  return Math.floor(length * 0.75)
}
```

再看 interface定义，抽象了一个 Electron 下载管理器的核心概念模型。

下载状态抽象层。
```ts
export type DownloadItemState = 'progressing' | 'completed' | 'cancelled' | 'interrupted'
```
定义了下载任务的有限状态机（FSM），覆盖下载全生命周期。
按时间维度区分：progressing → (completed|cancelled|interrupted)，明确区分用户主动取消(cancelled)和系统异常(interrupted)。
此外，completed是理想的成功情况。这个抽象还需要补充【未开始下载】这个状态。

事件通信抽象层。

```ts
export type IPCEventName =
  | 'openDownloadManager'    // 打开下载管理器窗口
  | 'getDownloadData'        // 获取下载列表数据
  | 'newDownloadFile'        // 
  | 'retryDownloadFile'      // 重试失败的任务
  | 'openFileDialog'         // 打开文件选择对话框
  | 'openFile'               // 打开已下载文件
  | 'openFileInFolder'       // 在文件夹中显示文件
  | 'pauseOrResume'          // 暂停/继续下载
  | 'removeDownloadItem'     // 删除下载任务
  | 'clearDownloadDone'      // 清空已完成任务
  | 'newDownloadItem'
  | 'downloadItemUpdate'
  | 'downloadItemDone'
```

数据模型抽象层。

```ts
// 用户点击下载按钮时，对话框中是这三个选项。
// {
//   url: "https://example.com/file.zip",
//   path: "/Users/name/Downloads",
//   fileName: "custom-name.zip" // 可选
// }
export interface INewDownloadFile {
  url: string
  fileName?: string
  path: string
}

// 一个下载任务，对应下载一个文件
export interface IDownloadFile {
  id: string           // 任务唯一ID
  url: string          // 下载地址
  fileName: string     // 文件名
  path: string         // 存储路径
  state: DownloadItemState // 当前状态
  progress: number     // 进度(0-1)
  totalBytes: number   // 文件总大小(字节)
  receivedBytes: number // 已下载字节数
  speed: number        // 下载速度(B/s)
  paused: boolean      // 是否暂停
  _sourceItem?: DownloadItem // 关联的Electron原生对象
}

// 用于计算实时下载进度
export interface IDownloadBytes {
  receivedBytes: number // 已下载量
  totalBytes: number    // 总量
}

// 下载列表显示页的分页参数
export interface IPagination {
  pageIndex: number
  pageCount: number
}

// 这个接口没有 downloadItem: IDownloadFile 属性是因为这是新建，还没开始下载
export interface IAddDownloadItem {
  item: DownloadItem // 关联的Electron原生下载对象
  data: IDownloadFile[] //下载任务列表
  downloadIds: string[] //下载中的 id列表
  newDownloadItem: INewDownloadFile | null // 关联的用户创建的下载任务
}

export interface IUpdateDownloadItem {
  item: DownloadItem     // 关联的Electron原生下载对象
  data: IDownloadFile[]  //下载任务列表
  downloadItem: IDownloadFile // 关联的下载任务
  prevReceivedBytes: number //已下载的数据量
  state: DownloadItemState //下载状态
}
```

再从使用端入手，看看是如何调用的。

`ipc-renderer.ts`
```ts
import { ipcRenderer, IpcRendererEvent, remote } from 'electron'
import {
  IDownloadFile,
  INewDownloadFile,
  IPagination,
  IPCEventName,
} from 'app/file-manager/interface'

/**
 * 添加 ipc 调用监听事件
 * @param eventName - ipc 事件名
 * @param callback - 回调函数
 */
export const ipcRendererListener = (
  eventName: IPCEventName,
  callback: (event: IpcRendererEvent, ...args: any[]) => void,
): void => {
  ipcRenderer.on(eventName, (event, ...args: any[]) => {
    callback(event, ...args)
  })
}

/**
 * 调用 ipc 的处理事件
 * @param eventName - ipc 事件名
 * @param args - 参数
 * @returns `Promise<any>`
 */
export const ipcRendererInvoke = <T>(eventName: IPCEventName, ...args: any[]): Promise<T> =>
  ipcRenderer.invoke(eventName, ...args)

/**
 * 获取下载路径
 */
export const getDownloadPath = (): string => remote.app.getPath('downloads')

/**
 * 打开文件
 * @param path - 路径
 */
export const openFile = (path: string): Promise<string> => ipcRendererInvoke('openFile', path)

/**
 * 打开下载管理器
 */
export const openDownloadManager = (): void => {
  ipcRendererInvoke('openDownloadManager', '/download-manager/demo')
}

/**
 * 新建下载项
 * @param formData - 下载数据
 */
export const newDownloadFile = (formData: INewDownloadFile): Promise<IDownloadFile | null> =>
  ipcRendererInvoke<IDownloadFile | null>('newDownloadFile', formData)

/**
 * 重新下载
 */
export const retryDownloadFile = (item: IDownloadFile): Promise<boolean> =>
  ipcRendererInvoke<boolean>('retryDownloadFile', item)

/**
 * 打开选择保存位置对话框
 * @param path - 路径
 */
export const openFileDialog = (path: string): Promise<string> =>
  ipcRendererInvoke<string>('openFileDialog', path)

/**
 * 暂停或恢复下载
 * @param item - 下载项
 */
export const pauseOrResume = (item: IDownloadFile): Promise<IDownloadFile> =>
  ipcRendererInvoke<IDownloadFile>('pauseOrResume', item)

/**
 * 打开文件所在位置
 * @param path - 路径
 */
export const openFileInFolder = (path: string): Promise<boolean> =>
  ipcRendererInvoke<boolean>('openFileInFolder', path)

/**
 * 获取下载数据
 * @param page - 分页
 */
export const getDownloadData = (page: IPagination): Promise<IDownloadFile[]> =>
  ipcRendererInvoke('getDownloadData', page)

/**
 * 删除下载项。下载中的将先取消，再删除
 * @param item - 下载项
 * @param index - 下载项的下标
 */
export const removeDownloadItem = (item: IDownloadFile, index: number): Promise<IDownloadFile> =>
  ipcRendererInvoke<IDownloadFile>('removeDownloadItem', item, index)

/**
 * 清空下载完成项
 */
export const clearDownloadDone = (): Promise<IDownloadFile[]> =>
  ipcRendererInvoke('clearDownloadDone')

/**
 * 监听新建下载项事件
 * @param callback - 回调函数
 */
export const listenerNewDownloadItem = (
  callback: (event: IpcRendererEvent, ...args: any[]) => void,
): void => ipcRendererListener('newDownloadItem', callback)

/**
 * 监听下载项更新事件
 * @param callback - 回调函数
 */
export const listenerDownloadItemUpdate = (
  callback: (event: IpcRendererEvent, ...args: any[]) => void,
): void => ipcRendererListener('downloadItemUpdate', callback)

/**
 * 监听下载项完成事件
 * @param callback - 回调函数
 */
export const listenerDownloadItemDone = (
  callback: (event: IpcRendererEvent, ...args: any[]) => void,
): void => ipcRendererListener('downloadItemDone', callback)
```

最后，来看下具体实现。首先是一大片的import，`from '../util'`这里是导入通用文件操作工具库，`from './helper'`
这里是导入和文件下载强相关的工具函数。

```ts
import { createWindow } from 'app/browser-window'
import { IDownloadFile, INewDownloadFile, IPagination } from '../interface'
import {
  getFileName,
  isExistFile,
  openFile,
  openFileInFolder,
  pathJoin,
  removeFile,
  uuidV4,
} from '../util'
import { ipcMainHandle } from '../ipc-main'
import {
  addDownloadItem,
  deleteSourceItem,
  download,
  getDownloadBytes,
  getDownloadData,
  getDownloadItem,
  initDownloadData,
  isExistItem,
  setDownloadStore,
  setTaskbar,
  updateDownloadItem,
} from './helper'

let win: BrowserWindow | null
// 这里命名区别很大，可以改善
let newDownloadItem: INewDownloadFile | null
let downloadItemData: IDownloadFile[] = []
let downloadCompletedIds: string[] = [] // 下载完成的 id
const tempDownloadItemIds: string[] = [] // 下载中的 id
```
打开下载管理器窗口的实现

```ts
const openDownloadManager = (url: string) => {
  if (win) {
    win.show()
    return
  }

  win = createWindow('download-manager')

  win.on('ready-to-show', () => {
    win?.show()
  })

  win.on('close', () => {
    // 窗口关闭时，将下载中或中断的项暂停，并删除本地缓存（这里就不能断点继续下载了）
    downloadItemData.forEach(item => {
      if (['progressing', 'interrupted'].includes(item.state)) {
        item._sourceItem?.pause()
        item.paused = true
        removeFile(item.path)
      }
    })

    // 下载任务的信息还是保留的
    setDownloadStore(downloadItemData)

    // 清除全局数据
    downloadItemData = []
    downloadCompletedIds = []
    setTaskbar(downloadItemData, downloadCompletedIds, -1, win)
    win = null
  })
}
```

---

假设用户正常创建任务，那么对应的就是这个方法

```ts
/**
 * 下载文件
 * @param newItem - 新下载项
 */
const downloadFile = (newItem: INewDownloadFile) => {
  const { url, fileName, path: savePath } = newItem
  const newFileName = getFileName(fileName ?? '', url) // 处理文件名

  // 处理保存路径
  const downloadPath = pathJoin(savePath, newFileName)
  // 查找下载记录中是否存在历史下载
  const existItem = isExistItem(url, downloadItemData)

  // 这里最好是copy一份newItem来修改，不要直接修改入参。如果后续还要参考原任务的数据，就会混乱      。
  newItem.fileName = newFileName
  newItem.path = downloadPath

  // 如果对应路径的文件已经存在，那认为之前已经下载过，直接返回
  if (isExistFile(downloadPath)) {
    const id = existItem?.id || uuidV4()
    return { id, ...newItem }
  }

  // 如果对应路径的文件不存在，但是下载任务列表却含有这个任务。那么可能是本地缓存被清除掉了，
  //  - 之前下载成功，但是用户自己删掉了或者转移了文件
  //  - 之前下载失败，文件缓存被删了       
  // 此时，需要重新下载        
  if (existItem) {
    retryDownloadFile({ ...existItem, ...newItem })
    return null
  }

  // 如果代码走到这里，那就是全新的下载
  newDownloadItem = {
    url,
    fileName: newFileName,
    path: downloadPath,
  }

  // 这里也应该将此任务记录为下载中的状态
  // tempDownloadItemIds.push(data.id)
  download(url, win)
  return null
}
```
这里我们重点关注 download()的实现，真正的下载触发逻辑。
```ts
export const download = (url: string, win: BrowserWindow | null): void => {
  if (!win) return
  win.webContents.downloadURL(url)
}
```
跟踪func call可以看到委托给了浏览器的.webContents.downloadURL()。

我们接着看下重新下载的实现。
```ts
const retryDownloadFile = (data: IDownloadFile): boolean => {
  newDownloadItem = {
    fileName: data.fileName,
    path: data.path,
    url: data.url,
  }
  tempDownloadItemIds.push(data.id)
  download(data.url, win)
  return true
}
```
这里有了变化，多了这么一行 `tempDownloadItemIds.push(data.id)`，用于记录下载中状态的任务。

---

如果是一打开下载管理时，已经有任务记录了，此时对应的逻辑是继续执行之前中断下载的任务，以及读取已完成任务的列表。

```ts
export const initDownloadData = (): IDownloadFile[] => {
  // 从持久化存储取回下载任务列表到内存中。按时间倒序排，任务开始时间越晚的在前面
  const data = getDownloadStore().sort((a, b) => Math.floor(b.startTime) - Math.floor(a.startTime))
  return data
}

const handleDownloadData = () => {
  downloadItemData = initDownloadData()
  
  downloadItemData.forEach(item => {
    // 如果下载中或中断的，继续下载
    if (['progressing', 'interrupted'].includes(item.state)) {
      newDownloadItem = {
        url: item.url,
        fileName: item.fileName,
        path: item.path,
      }
      item.paused = true

      tempDownloadItemIds.push(item.id)
      download(item.url, win)
      return
    }

    // 如果之前已经下载完毕，那就简单地更新到已完成任务列表中
    downloadCompletedIds.push(item.id)
  })
}
```
---

打开文件选择框的实现
```ts

const openFileDialog = async (oldPath: string = app.getPath('downloads')) => {
  if (!win) return oldPath

  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: '选择保存位置',
    properties: ['openDirectory', 'createDirectory'],
    defaultPath: oldPath,
  })

  return !canceled ? filePaths[0] : oldPath
}
```

---

暂停或恢复某个下载任务

```ts
const pauseOrResume = (item: IDownloadFile) => {
  const sourceItem = getDownloadItem(downloadItemData, item.id)
  // 找不到任务就直接返回
  if (!sourceItem) return item

  // 切换任务执行的状态
  if (item.paused) {
    sourceItem.resume()
  } else {
    sourceItem.pause()
  }

  // 再次读取任务的暂停状态，并update item属性
  item.paused = sourceItem.isPaused()
  // 触发下载任务列表的持久化，因为某个任务的执行状态改变了，指上面的paused属性
  setDownloadStore(downloadItemData)
  return item
}

export const setDownloadStore = (data: IDownloadFile[]): void => {
  store.set('downloadManager', data)
}
```

删除某个下载任务

```ts
const removeDownloadItem = (item: IDownloadFile, index: number) => {
  const sourceItem = getDownloadItem(downloadItemData, item.id)

  downloadItemData.splice(index, 1)
  // 如果下载项的状态是下载中，需要取消
  if (item.state === 'progressing') {
    sourceItem && sourceItem.cancel()
  }

  // 不管这个item之前是否已下载完毕，都尝试移除
  downloadCompletedIds = downloadCompletedIds.filter(id => id !== item.id)
  setDownloadStore(downloadItemData)
  return item
}
```

清空已完成的下载项

```ts
const clearDownloadDone = () => {
  // 仅保留下载中的任务，并持久化
  downloadItemData = downloadItemData.filter(item => item.state === 'progressing')
  setDownloadStore(downloadItemData)
  
  // 已完成的下载任务ids重置
  downloadCompletedIds = []
  return deleteSourceItem(downloadItemData)
}

// 移除下载数据中的 _sourceItem 属性
export const deleteSourceItem = (data: IDownloadFile[]): IDownloadFile[] => {
  data = data.map(item => ({...item, _sourceItem: undefined}))
  return data
}
```

---

添加主进程 ipc 调用事件
```ts
const listenerEvent = () => {
  // 打开下载管理器
  ipcMainHandle('openDownloadManager', (event, url) => {
    openDownloadManager(url)
    handleDownloadData()
  })

  // 获取下载数据
  ipcMainHandle('getDownloadData', (event, page: IPagination) => {
    return getDownloadData(downloadItemData, page)
  })

  // 新建下载
  ipcMainHandle('newDownloadFile', (event, data: INewDownloadFile) => downloadFile(data))

  // 重新下载
  ipcMainHandle('retryDownloadFile', (event, data: IDownloadFile) => retryDownloadFile(data))

  // 选择保存位置对话框
  ipcMainHandle('openFileDialog', (event, oldPath?: string) => openFileDialog(oldPath))

  // 打开文件
  ipcMainHandle('openFile', (event, path: string) => openFile(path))

  // 打开文件所在路径
  ipcMainHandle('openFileInFolder', (event, path: string) => openFileInFolder(path))

  // 暂停或恢复下载
  ipcMainHandle('pauseOrResume', (event, item: IDownloadFile) => pauseOrResume(item))

  // 清空已完成（非下载中的）的下载项
  ipcMainHandle('clearDownloadDone', () => clearDownloadDone())

  // 删除下载项
  ipcMainHandle('removeDownloadItem', (event, item: IDownloadFile, index: number) =>
          removeDownloadItem(item, index),
  )

  // 调用 download 方法后，触发 will-download 事件
  session.defaultSession.on('will-download', listenerDownload)
}
```

listenerDownload 实现
```ts
/**
 * 监听下载
 * @param event - electron 事件
 * @param item - 下载项
 * @param webContents - webContents
 */
export const listenerDownload = async (
                event: Event,
                item: DownloadItem,
                webContents: WebContents,
        ): Promise<void> => {
          // 新建下载为空时，会执行 electron 默认的下载处理
          if (!newDownloadItem) return

          let prevReceivedBytes = 0 // 记录上一次下载的字节数据
          // 添加下载项
          const downloadItem: IDownloadFile = await addDownloadItem({
            item,
            downloadIds: tempDownloadItemIds,
            data: downloadItemData,
            newDownloadItem,
          })

          setTaskbar(downloadItemData, downloadCompletedIds, -1, win)

          // 新下载任务创建完成，渲染进程监听该事件，添加到下载管理器列表
          webContents.send('newDownloadItem', { ...downloadItem, _sourceItem: null })

          // 更新下载
          item.on('updated', (e, state) => {
            const receivedBytes = updateDownloadItem({
              item,
              downloadItem,
              data: downloadItemData,
              prevReceivedBytes,
              state,
            })
            prevReceivedBytes = receivedBytes

            // 获取所有下载中的接受字节和总字节数据
            const bytes = getDownloadBytes(downloadItemData)
            // 更新任务栏进度
            win?.setProgressBar(bytes.receivedBytes / bytes.totalBytes)
            // 通知渲染进程，更新下载状态
            webContents.send('downloadItemUpdate', { ...downloadItem, _sourceItem: null })
          })

          // 下载完成
          item.on('done', (e, state) => {
            downloadItem.state = state
            downloadItem.receivedBytes = item.getReceivedBytes()

            if (state !== 'cancelled') {
              downloadCompletedIds.push(downloadItem.id)
            }

            setTaskbar(downloadItemData, downloadCompletedIds, 0, win)
            // 下载成功
            if (state === 'completed' && process.platform === 'darwin') {
              app.dock.downloadFinished(downloadItem.path)
            }

            setDownloadStore(downloadItemData)
            // 通知渲染进程，更新下载状态
            webContents.send('downloadItemDone', { ...downloadItem, _sourceItem: null })
          })
        }
```
这个函数设计两个关键的函数调用
- addDownloadItem
- updateDownloadItem

```ts
/**
 * 添加下载项
 * @param param
 */
export const addDownloadItem = async ({
                                        item,
                                        downloadIds,
                                        data,
                                        newDownloadItem,
                                      }: IAddDownloadItem): Promise<IDownloadFile> => {
    const id = downloadIds.shift() || ''
    // 判断下载项是否存在，存在先移除，再添加
    const itemIndex = getDownloadIndex(data, id)

    const fileUrl = item.getURL()
    const fileName = getFileName(newDownloadItem?.fileName || '', item.getFilename())
    const startTime = item.getStartTime() * 1000
    const totalBytes = getBase64Bytes(fileUrl) || item.getTotalBytes()

    let fileId = uuidV4()
    const savePath = newDownloadItem?.path || app.getPath('downloads')

    // 删除原下载任务，仅保留原任务id，其他属性去掉，维持暂停状态     
    if (itemIndex > -1) {
      const newItems = data.splice(itemIndex, 1)
      const newItem = newItems[0]

      fileId = newItem.id
      if (newItem.paused) {
        item.pause()
      }
    }

    // 阻止系统保存对话框
    item.setSavePath(savePath)

    const fileIcon = await getFileIcon(savePath)
    // 重建新下载任务      
    const downloadItem: IDownloadFile = {
      id: fileId,
      url: fileUrl,
      icon: fileIcon,
      fileName,
      path: savePath,
      state: item.getState(),
      startTime,
      speed: 0,
      progress: 0,
      totalBytes,
      receivedBytes: item.getReceivedBytes(),
      paused: item.isPaused(),
      _sourceItem: item,
    }

    // 将更新的新任务加入任务列表
    data.unshift(downloadItem)
    // 持久化任务列表
    setDownloadStore(data)
    // 清空缓存数据
    newDownloadItem = null

    return downloadItem
  }
```

```ts
/**
 * 更新下载中数据
 * @param item - 下载项，electron 生成的对象
 * @param downloadItem - 更新的下载项
 * @param prevReceivedBytes - 上一次下载字节数
 * @param state - 下载状态
 */
export const updateDownloadItem = ({
                                     item,
                                     downloadItem,
                                     data,
                                     prevReceivedBytes,
                                     state,
                                   }: IUpdateDownloadItem): number => {
          const receivedBytes = item.getReceivedBytes()

          downloadItem.receivedBytes = receivedBytes
          // 计算每秒下载的速度
          downloadItem.speed = receivedBytes - prevReceivedBytes

          downloadItem.progress = receivedBytes / downloadItem.totalBytes
          downloadItem.state = state
          downloadItem.paused = item.isPaused()

          setDownloadStore(data)
          return receivedBytes
        }
```

此外，还有几个工具函数

```ts
/**
 * 获取下载中的字节数据
 * @param data - 下载项
 */
export const getDownloadBytes = (data: IDownloadFile[]): IDownloadBytes => {
    const allBytes = data.reduce<IDownloadBytes>(
      (prev, current) => {
        if (current.state === 'progressing') {
          prev.receivedBytes += current.receivedBytes
          prev.totalBytes += current.totalBytes
        }
        return prev
      },
      { receivedBytes: 0, totalBytes: 0 },
    )
    return allBytes
  }
```

```ts
/**
 * 设置任务栏
 */
export const setTaskbar = (
                data: IDownloadFile[],
                completedData: string[],
                progress: number,
                win: BrowserWindow | null,
        ): void => {
          const count = data.length - completedData.length

          if (win) {
            win.setProgressBar(count < 1 ? -1 : progress)
          }

          if (process.platform === 'darwin') {
            app.badgeCount = count
          }
        }
```

```ts
/**
 * 分页获取下载数据
 * @param param
 * pageIndex - 当前页
 * pageCount - 每页数
 * @param data
 */
export const getDownloadData = (
                data: IDownloadFile[],
                { pageIndex = 1, pageCount = 10 }: IPagination,
        ): IDownloadFile[] => {
          data = deleteSourceItem(data)
          
          const offset = (pageIndex - 1) * pageCount
          // 最后一页需要特殊处理
          const newData =
                  offset + pageCount >= data.length
                          ? data.slice(offset, data.length)
                          : data.slice(offset, offset + pageCount)

          return newData
        }
```

> See `electron-playground\app\file-manager`

### 单例app
```ts
const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
  return
}
```

## npm 换源

`.npmrc`

```
registry=https://registry.npmmirror.com/
electron_mirror=https://npmmirror.com/mirrors/electron/
chromedriver_cdnurl=https://registry.npmmirror.com/binary.html?path=chromedriver/
```

这种 links 很容易随着时间推移而失效，使用前最好到浏览器访问来验证是否还可用。

## 错误上报

集成 sentry.js，或者实现收集错误的后端服务器设施。

## 打包

- [electron-packager](https://github.com/electron/electron-packager)
- [electron-forge](https://github.com/electron-userland/electron-forge)
- [electron-builder](https://github.com/electron-userland/electron-builder)

`electron-packager` 较为轻量，适合简单的项目打包。相对而言 `electron-builder` 配置更加复杂和全面一些。

插件加载

```ts
let pluginName
switch (process.platform) {
  case 'win32':
    pluginName = 'pepflashplayer.dll'
    break
  case 'darwin':
    pluginName = 'PepperFlashPlayer.plugin'
    break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, '..', 'plugins', pluginName as string))
const window = new BrowserWindow({ webPreferences: { preload: PRELOAD, plugins: true } })
```

### 多平台多环境打包的命令行工具

根据功能流程设计来划分功能模块：

1. Inquirer: 读取用户输入项并提供校验;
2. CommandExecutor: 执行命令行命令的函数;
3. JsonUpdater: 提供读写操作更新 package.json 和 package-lock.json;
4. ChangelogUpdater: 更新 CHANGELOG
5. Builder: 使用 electron-builder 进行打包操作
6. FileUploader: 通过 ftp 进行文件上传

`build/packaging-cli/inquirer.ts`

```ts
import * as inquirer from 'inquirer'

const envs = ['test', 'prod'] as const 
const platforms = ['win', 'mac'] as const 

export type envType = typeof envs[number]
export type platformType = typeof platforms[number]

const options = [
  { type: 'input', name: 'version', message: ` 版本号？` },
  { type: 'input', name: 'releaseName', message: ` 更新标题 `, default: '更新' },
  { type: 'editor', name: 'releaseNotes', message: ` 更新描述:` },
  {
    type: 'list',
    name: 'env',
    message: '环境？',
    choices: envs.map((e) => ({ name: e, value: e })),
  },
  {
    type: 'list',
    name: 'platforms',
    message: '平台？',
    choices: [
      { name: 'all', value: platforms },
      ...platforms.map((p) => ({ name: p, value: [p] })),
    ],
  },
]

interface QueryResult {
  env: envType;
  platforms: platformType[];
  version: string;
  releaseName: string;
  releaseNotes: string;
}

export async function query() {
  const result = await inquirer.prompt <QueryResult>(options)
  console.log(result)
  return result
}
```

`build/packaging-cli/command-executor.ts`

```ts
import {spawn} from 'child_process'

export function execCommand(command: string, args: string[]) {
  return new Promise((resolve, reject) => {
    const ls = spawn(command, args, { stdio: 'inherit' })

    ls.on('error', error => {
      console.error(error.message)
    })

    ls.on('close', code => {
      console.log(`[${command} ${args.join(' ')}]` + `exited with code ${code}`)
      code === 0 ? resolve(): reject(code)
    })
  })
}
```

`build/packaging-cli/json-updater.ts`

```ts
import * as path from "path";
import {readJsonSync, writeJSONSync} from "fs-extra";

export const PACKAGE_JSON_PATH = path.resolve(__dirname, "..", "..", "package.json");
export const PACKAGE_JSON_LOCK_PATH = path.resolve(__dirname, "..", "..", "package-lock.json");

// 读取 json 内容
export const readJSON = (path: string) => ()=> readJsonSync(path);

// 覆写 json 变量
export const writeJSON = (path: string) => (vars: any) => writeJSONSync(path, vars);
```

`build/packaging-cli/builder.ts`

```js
import {envType, platformType} from "./inquirer";
import {execCommand} from "./command-executor";

export async function build(env: envType, platforms: platformType[]) {
  process.env.ENV = env;
  await execCommand(`npm`, ["run", "build"]);

  let buildArgs = ["build"];
  if (platforms.includes("win")) buildArgs.push("--win");
  if (platforms.includes("mac")) buildArgs.push("--mac");

  await execCommand(`electron-builder`, buildArgs);
}
```

`file-uploader.ts`

```ts
import FTPClient from "ftp";
import * as path from "path";
import * as fs from "fs";

const clientConfig = {
  host: "host.to.your.server",
  port: 60021,
  user: "username",
  password: "password",
};

const Client = new FTPClient();

function connectClient() {
  return new Promise((resolve, reject) => {
    Client.on("ready", resolve);
    Client.on("error", reject);
    Client.connect(clientConfig);
  });
}

function putFile(file: string, dest: string) {
  return new Promise((resolve, reject) => {
    Client.put(file, dest, (err) => (err ? reject(err) : resolve()));
  });
}

export async function uploadDir(dir: string, dest: string) {
  await connectClient();

  const task: [string, string][] = fs
    .readdirSync(dir)
    .map((f) => path.resolve(dir, f))
    .filter((f) => fs.statSync(f).isFile())
    .map((f) => ([f, `${dest}/${path.basename(f)}`]));

  await Promise.all(task.map(([src, dest]) => putFile(src, dest)));

  Client.end();
}
```

最后是一个 index 入口文件: `build/packaging-cli/index.ts`

```js
import {query} from "./inquirer";
import {readJSON, PACKAGE_JSON_PATH} from "./json-updater";
import {execCommand} from "./command-executor";
import {updateChangeLog} from "./changelog-updater";
import {build} from "./builder";
import * as path from "path";
import {uploadDir} from "./file-uploader";

const RELEASE_DIR = path.resolve(__dirname, "..", "..", "release");

async function startPackaging() {
  let {version, env, platforms, releaseName, releaseNotes} = await query();

  // 更新版本号
  await execCommand("npm", ["version", version ? version : "patch"]);
  version = readJSON(PACKAGE_JSON_PATH)().version;
  // 更新 CHANGELOG
  updateChangeLog({version, releaseName, releaseNotes});
  // 开始打包
  await build(env, platforms);
  // 上传文件
  await uploadDir(path.resolve(RELEASE_DIR, version), "test-app-temp")
}

startPackaging();
```

在 package.json 中添加命令

```json
"pack": "ts-node ./build/packaging-cli/index.ts",
```

## 程序更新

基于 [electron-updater]()

### API

API 方法 / 功能

- `checkForUpdates()` 检查更新
- `checkForUpdatesAndNotify() ` 检查更新，有更新则提示
- `downloadUpdate(cancellationToken) ` 下载更新
- `getFeedURL() ` 获取更新服务链接
- `setFeedURL(options)` 设置更新服务链接
- `quitAndInstall(isSilent, isForceRunAfter) ` 退出应用并安装更新

### Event

事件 / 触发

- error 更新错误
- checking-for-update 检查更新中
- update-available 有可用更新
- update-not-available 没有可用更新
- download-progress 下载更新中
- update-downloaded 更新下载完成

在主进程监听检查更新事件

```js
import {autoUpdater} from 'electron-updater'
import {ipcMain} from 'electron'

ipcMain.on('CHECK_FOR_UPDATE', function() {
  autoUpdater.checkForUpdatesAndNotify()
})
```

在渲染进程点击按钮发送 ipc 事件检查更新 (以 React 为例)

```js
import React from 'react';
import {ipcRenderer} from 'electron'
import './App.css';

function App() {
  return (
    <div className="App">
      <button onClick={ipcRenderer.send('CHECK_FOR_UPDATE')}> 检查更新 </button>
    </div>
  );
}

export default App;
```

### 更新服务的设计

需要实现的功能

1. 查看更新信息
2. 用户手动检查更新;
3. 应用启动时静默检查更新;
4. 应用在后台定时检查更新;
5. 用户手动下载更新;
6. 下载进度显示;
7. 用户手动退出安装更新;
8. 通过版本号控制强制更新;
9. 日志;
10. 开发时请求本地服务做测试;

更新过程的所有状态:

| 状态          | 描述     |
|-------------|--------|
| Idle        | 空闲     |
| Checking    | 检查中    |
| Available   | 有可下载更新 |
| Downloading | 下载中    |
| Downloaded  | 下载完成   |

更新服务的初步的设计

```ts
// app/updater.ts
import { autoUpdater, UpdateInfo } from 'electron-updater'

interface CheckResult {
  // 是否有更新
  available: boolean
  // 更新内容
  updateInfo: UpdateInfo
}

interface ProgressInfo {
  total: number
  delta: number
  transferred: number
  percent: number
  bytesPerSecond: number
}

// 下载进度回调
type DownloadProgressCallback = (p: ProgressInfo) => void
// 下载结束回调
type DownloadedCallback = () => void

abstract class AppUpdateService {
  // 检查更新
  public abstract checkUpdate(): CheckResult

  // 下载更新
  public abstract downloadUpdate(params: {
    onDownloadProgress: DownloadProgressCallback,
    onDownloaded: DownloadedCallback
  }): void

  // 应用更新
  public abstract applyUpdate(): void
}
```

由于 ipc 通信的限制，无法传递回调函数，因此在这里考虑将更新服务的业务功能封装都移到渲染进程，主进程只提供基本的初始化服务和接口方法的封装。

app/updater.ts

```ts
import {autoUpdater} from "electron-updater";
import logger from "electron-log";
import {BrowserWindow, ipcMain, app} from 'electron';

function checkUpdate() {
  return autoUpdater.checkForUpdates();
}

function downloadUpdate() {
  return autoUpdater.downloadUpdate();
}

function applyUpdate() {
  return autoUpdater.quitAndInstall();
}

function sendToAllBrowserWindows(channel: string, ...args: unknown[]) {
  const browserWindows = BrowserWindow.getAllWindows()
  // 这里向每一个活跃的 window 发送 event 是合理的吗？
  browserWindows.forEach(bw => bw.webContents.send(channel, ...args))
}

function init() {
  // 日志
  logger.transports.file.level = "info";
  autoUpdater.logger = logger;

  // 禁用自动下载
  autoUpdater.autoDownload = false;
  // 启用退出 app 时自动安装更新
  autoUpdater.autoInstallOnAppQuit = true;

  // 监听事件并发送到渲染进程
  const events = [
    "error",
    "checking-for-update",
    "update-available",
    "update-not-available",
    "download-progress",
    "update-downloaded",
  ]
  // 这里应该传 eventName 到 sendToAllBrowserWindows
  // 即 sendToAllBrowserWindows.bind(null, 'APP_UPDATER/STATUS_CHANGE',eventName)
  events.forEach((eventName) => autoUpdater.on(eventName, sendToAllBrowserWindows.bind(null, 'APP_UPDATER/STATUS_CHANGE')));

  // 通过接收渲染进程发送的 ipc 调用方法
  ipcMain.on('APP_UPDATER/CHECK_UPDATE', checkUpdate)
  ipcMain.on('APP_UPDATER/DOWNLOAD_UPDATE', downloadUpdate)
  ipcMain.on('APP_UPDATER/APPLY_UPDATE', applyUpdate)
}

app.once('will-finish-launching', init)

export const AppUpdater = {
  checkUpdate,
  downloadUpdate,
  applyUpdate,
}
```

在渲染进程，首先创建一个自定义 hooks 来实现接收更新状态变更并通过 `createContext` 来实现组件状态共享。
`renderer/src/Hooks/useAppUpdate.js`

```ts
import React, {useState, useEffect, useContext, createContext} from "react";
import {ipcRenderer} from "electron";

export function useAppUpdate() {
  const [status, setStatus] = useState(null);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [updateProgressInfo, setUpdateProgressInfo] = useState(null);
  const [error, setError] = useState(null);

  const checkUpdate = () => ipcRenderer.send('APP_UPDATER/CHECK_UPDATE')
  const downloadUpdate = () => ipcRenderer.send('APP_UPDATER/DOWNLOAD_UPDATE')
  const applyUpdate = () => ipcRenderer.send('APP_UPDATER/APPLY_UPDATE')

  useEffect(() => {
    // (event, updateEventName, ...args) 这个函数签名和前面似乎不对应？
    ipcRenderer.on("APP_UPDATER/STATUS_CHANGE", (event, updateEventName, ...args) => {
        console.log(`updater#${updateEventName}: `, ...args);

        setStatus(updateEventName);

        switch (updateEventName) {
          case "error":
            setError(args[0]);
            break;
          case "checking-for-update":
            break;
          case "update-available":
            setUpdateInfo(args[0]);
            break;
          case "update-not-available":
            break;
          case "download-progress":
            setUpdateProgressInfo(args[0]);
            break;
          case "update-downloaded":
            setUpdateInfo(args[0]);
            break;

          default:
            break;
        }
      }
    );
  }, []);

  return {
    status, updateInfo, updateProgressInfo, error,
    checkUpdate, downloadUpdate, applyUpdate,
  };
}

const UpdaterContext = createContext();

export const UpdaterProvider = ({children}) => {
  const state = useAppUpdate();
  return <UpdaterContext.Provider value={state}>{children}</UpdaterContext.Provider>;
};

export function useUpdaterContext() {
  const store = useContext(UpdaterContext)
  return store
}
```

新建一个 AboutPanel 组件，在组件中显示更新信息下载进度，已经更新按钮等 `renderer/src/Components/AboutPanel/index.jsx`

```ts
import React, {useMemo} from 'react'
import {useUpdaterContext} from '../../Hooks/useAppUpdate'

export function AboutPanel() {
  const {
    status, updateInfo, updateProgressInfo, error,
    checkUpdate, downloadUpdate, applyUpdate,
  } = useUpdaterContext()

  const Button = useMemo(() => {
    if (status === 'update-available') {
      return <button onClick={downloadUpdate}>Download Updates</button>
    }
    if (status === 'download-progress') {
      return <button>Downloading...</button>
    }
    if (status === 'update-downloaded') {
      return <button onClick={applyUpdate}>Apply Updates</button>
    }
    return <button onClick={checkUpdate}>Check for Updates</button>
  }, [status])

  const Info = useMemo(() => {
    if (status === 'error') {
      console.log('error', error)
      return <>
        <p style={{ color: 'lightpink' }}>{error?.name}</p>
        <p style={{ color: 'lightpink' }}>{error?.message}</p>
        <p style={{ color: 'lightpink' }}>{error?.stack}</p>
      </>
    }
    if (status === 'checking-for-update') {
      return <p>Checking...</p>
    }
    if (status === 'update-not-available') {
      return <p>No Updates Available</p>
    }
    if (updateInfo) {
      const {version, releaseName, releaseNotes, releaseDate} = updateInfo
      return <>
        <p>version: {version}</p>
        <p>date: {releaseDate}</p>
        <p>name: {releaseName}</p>
        <p>notes: {releaseNotes}</p>
      </>
    }
  }, [status, updateInfo, error])

  return <div>
    {Info}

    {
      status === 'download-progress' && Boolean(updateProgressInfo) &&
      <div style={{ backgroundColor: 'grey', width: 300, height: 20, margin: '12px auto' }}>
        <div style={{
          backgroundColor: 'cornflowerblue',
          height: 20,
          width: 300 * updateProgressInfo.percent / 100
        }}></div>
      </div>
    }

    {Button}
  </div>
}
```

新建一个 UpdateChecker 组件，在这个组件中做静默检查、定时检查和更新提示 `renderer/src/Components/UpdateChecker/index.jsx`

```js
import React from 'react'
import {useAppUpdate} from '../../Hooks/useAppUpdate'
import {useEffect} from 'react'

export function UpdateChecker() {
  const {checkUpdate, downloadUpdate, applyUpdate, updateInfo, status, updateProgressInfo} = useAppUpdate()

  useEffect(() => {
    // 这里是定时检测更新，如果更细一点，暴露 API 设置检查更新的间隔
    let timeout

    function scheduleCheckUpdate() {
      if (!['checking-for-update', 'update-available', 'download-progress', 'update-downloaded'].includes(status)) {
        checkUpdate()
      }
      timeout = setTimeout(() => {
        scheduleCheckUpdate()
      }, 1000 * 60 * 60);
    }

    scheduleCheckUpdate()

    // 取消定时检测更新，这个函数返回值怎么触发？
    // https://zhuanlan.zhihu.com/p/489229220
    // 1、首先渲染，并不会执行 useEffect 中的 return
    // 2、变量修改后，导致的重新 render，会先执行 useEffect 中的 return，再执行 useEffect 内除了 return 部分代码。
    return ()=> clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (status === 'update-available') {
      // eslint-disable-next-line no-restricted-globals
      const result = confirm('Updates available, download instantly?')
      if (result) {
        downloadUpdate()
      }
    }
    if (status === 'update-downloaded') {
      // eslint-disable-next-line no-restricted-globals
      const result = confirm('Download completed, apply updates?')
      if (result) {
        applyUpdate()
      }
    }
  }, [status])

  return null
}
```

## 应用协议

从网页端唤起特定的 Electron 应用，通过自定义协议来实现，示例代码：

```js
const agreement = 'my-electron-app' // 自定义协议名
app.setAsDefaultProtocolClient(agreement)
```

唤起方式：

```
my-electron-app:path/to
```

应用程序唤起，mac 系统会触发 open-url 事件，window 系统会触发 second-instance 事件。

```js
const {app, dialog} = require('electron')
const agreement = 'my-electron-app'
const AGREEMENT_REGEXP = new RegExp(`^${agreement}://`)

// 监听自定义协议唤起
function watchProtocol() {
  // mac 唤醒应用 会激活 open-url 事件 在 open-url 中判断是否为自定义协议打开事件
  app.on('open-url', (event, url) => {
    const isProtocol = AGREEMENT_REGEXP.test(url)
    if (isProtocol) {
      dialog.showMessageBox({
        type: 'info',
        message: 'Mac protocol 自定义协议打开',
        detail: ` 自定义协议链接:${url}`,
      })
    }
  })
  // window 系统下唤醒应用会激活 second-instance 事件 它在 ready 执行之后才能被监听
  app.on('second-instance', (event, commandLine) => {
    // commandLine 是一个数组， 唤醒的链接作为数组的一个元素放在这里面
    commandLine.forEach(str => {
      if (AGREEMENT_REGEXP.test(str)) {
        dialog.showMessageBox({
          type: 'info',
          message: 'window protocol 自定义协议打开',
          detail: ` 自定义协议链接:${str}`,
        })
      }
    })
  })
}

// 在 ready 事件回调中监听自定义协议唤起
watchProtocol()
```

一些其他 API

- **app.removeAsDefaultProtocolClient(protocol)** 删除注册的协议, 返回是否成功删除的 Boolean
- **Mac: app.isDefaultProtocolClient(protocol)** 当前程序是否为协议的处理程序。
- **app.getApplicationNameForProtocol(url)** 获取该协议链接的应用处理程序

对于自定义文件协议
```ts
const myScheme = 'myscheme'

// 需要再 ready 事件前调用, 并且只调用一次
protocol.registerSchemesAsPrivileged([
  {scheme: myScheme, privileges: { bypassCSP: true} },
])

// 请求文件自定义协议拦截 重新设置请求链接
function registerStringProtocol() {
  protocol.registerFileProtocol(
    myScheme,
    (request, callback) => {
      const resolvePath = path.resolve(__dirname, '../../project-root')
      let url = request.url.replace(`${myScheme}://`, '')
      // 去掉 scheme 前缀后拼接父级目录 => 最终的文件路径
      url = `${resolvePath}/${url}`
      return callback({path: decodeURIComponent(url) })
    },
  )
}
```


## 托盘

```js
const {Tray, Menu, nativeTheme, BrowserWindow} = require('electron')
const path = require('path')

let tray

// 设置顶部 APP 图标的操作和图标
const lightIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_light.png')
const darkIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_dark.png')

// 根据系统主题显示不同的主题图标
tray = new Tray(nativeTheme.shouldUseDarkColors ? darkIcon : lightIcon)
tray.setToolTip('some-tip-texts')

const contextMenu = Menu.buildFromTemplate([
  {
    label: '打开新窗口',
    click: () => {
      let child = new BrowserWindow({parent: BrowserWindow.getFocusedWindow() })
      child.loadURL('https://electronjs.org')
      child.show()
    },
  },
  {
    label: '删除图标',
    click: () => {
      tray.destroy()
    },
  },
])

tray.setContextMenu(contextMenu)
```

我们设置了托盘根据系统主题显示不同的图标，但是系统主题是动态的，继续完善：

```js
nativeTheme.on('updated', () => {
  tray.setImage(nativeTheme.shouldUseDarkColors ? darkIcon : lightIcon)
})
```

---

### 有未读消息时图标闪动 (windows)

```js
const {Tray, Menu, nativeTheme, BrowserWindow, nativeImage} = require('electron')
const path = require('path')

let tray
let timer
let toggle = true
let haveMessage = true

const lightIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_light.png')
const darkIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_dark.png')

const win = BrowserWindow.getFocusedWindow();

tray = new Tray(lightIcon)

const contextMenu = Menu.buildFromTemplate([
  {
    label: '张三的消息',
    click: () => {
      let child = new BrowserWindow({parent: BrowserWindow.getFocusedWindow() })
      child.loadURL('https://electronjs.org')
      child.show()
    },
  },
  { type: 'separator' },
  {
    label: '删除图标',
    click: () => {
      tray.destroy()
      clearInterval(timer)
    },
  },
])

tray.setContextMenu(contextMenu)

tray.setToolTip('Electron-Playground')

if (haveMessage) {
  timer = setInterval(() => {
    toggle = !toggle
    if (toggle) {
      tray.setImage(nativeImage.createEmpty())
    } else {
      tray.setImage(lightIcon)
    }
  }, 600)
}
```

## 下载管理器

在 electron 中的下载行为，都会触发 session
的 [will-download](https://www.electronjs.org/docs/api/session#instance-events)
事件。在该事件里面可以获取到 [downloadItem](https://www.electronjs.org/docs/api/download-item)
对象，通过 [downloadItem](https://www.electronjs.org/docs/api/download-item) 对象实现一个简单的文件下载管理器：

由于 electron 是基于 chromium 实现的，通过调用 webContents
的 [downloadURL](https://www.electronjs.org/docs/api/web-contents#contentsdownloadurlurl) 方法，相当于调用了 chromium
底层实现的下载，会忽略响应头信息，触发 [will-download](https://www.electronjs.org/docs/api/session#instance-events) 事件。

```js
// 触发下载
win.webContents.downloadURL(url)

// 监听 will-download
session.defaultSession.on('will-download', (event, item, webContents) => {
})
```

在上面的效果图中，实现的简单文件下载管理器功能包含：

- 设置保存路径
- 暂停 / 恢复和取消
- 下载进度
- 下载速度
- 下载完成
- 打开文件和打开文件所在位置
- 文件图标
- 下载记录

### 设置保存路径

如果没有设置保存路径，electron
会自动弹出系统的保存对话框。不想使用系统的保存对话框，可以使用 [setSavePath](https://www.electronjs.org/docs/api/download-item#downloaditemsetsavepathpath)
方法，当有重名文件时，会直接覆盖下载。

```js
item.setSavePath(path)
```

为了更好的用户体验，可以让用户自己选择保存位置操作。当点击位置输入框时，渲染进程通过 ipc 与主进程通信，打开系统文件选择对话框。

主进程实现代码：

```ts
/**
 * 打开文件选择框
 * @param oldPath - 上一次打开的路径
 */
const openFileDialog = async (oldPath: string = app.getPath('downloads')) => {
    if (!win) return oldPath

    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      title: '选择保存位置',
      properties: ['openDirectory', 'createDirectory'],
      defaultPath: oldPath,
    })

    return !canceled ? filePaths[0] : oldPath
  }

ipcMain.handle('openFileDialog', (event, oldPath ?: string) => openFileDialog(oldPath))
```

渲染进程代码：

```ts
const path = await ipcRenderer.invoke('openFileDialog', 'PATH')
console.log(path)
```

### 暂停 / 恢复和取消

拿到 [downloadItem](https://www.electronjs.org/docs/api/download-item) 后，暂停、恢复和取消分别调用 `pause`、`resume` 和
`cancel` 方法。当我们要删除列表中正在下载的项，需要先调用 cancel 方法取消下载。

### 下载进度

在 [downloadItem](https://www.electronjs.org/docs/api/download-item) 中监听 updated 事件，可以实时获取到已下载的字节数据，来计算下载进度和每秒下载的速度。

```js
// 计算下载进度
const progress = item.getReceivedBytes()/ item.getTotalBytes()
```

在下载的时候，想在 Mac 系统的程序坞和 Windows 系统的任务栏展示下载信息，比如：

- 下载数：通过 app 的 [badgeCount](https://www.electronjs.org/docs/api/app#appbadgecount-linux-macos) 属性设置，当为 0
  时，不会显示。也可以通过 dock 的 [setBadge](https://www.electronjs.org/docs/api/app#appsetbadgecountcount-linux-macos)
  方法设置，该方法支持的是字符串，如果不要显示，需要设置为 ''。
-

下载进度：通过窗口的 [setProgressBar](https://www.electronjs.org/docs/api/browser-window#winsetprogressbarprogress-options)
方法设置。

由于 Mac 和 Windows 系统差异，下载数仅在 Mac 系统中生效。加上 process.platform === 'darwin' 条件，避免在非 Mac、Linux
系统下出现异常错误。

```js
// mac 程序坞显示下载数：
// 方式一
app.badgeCount = 1
// 方式二
app.dock.setBadge('1')

// mac 程序坞、windows 任务栏显示进度
win.setProgressBar(progress)
```

### 下载速度

由于 [downloadItem](https://www.electronjs.org/docs/api/download-item) 没有直接为我们提供方法或属性获取下载速度，需要自己实现。

思路：在 updated 事件里通过 getReceivedBytes 方法拿到本次下载的字节数据减去上一次下载的字节数据。这个差值就是这次下载的数据大小。

```ts
// 记录上一次下载的字节数据
let prevReceivedBytes = 0

item.on('updated', (e, state) => {
  const receivedBytes = item.getReceivedBytes()
  // 计算每秒下载的速度
  downloadItem.speed = receivedBytes - prevReceivedBytes
  prevReceivedBytes = receivedBytes
})
```

需要注意的是，updated 事件执行的时间约 500ms 一次，上面的代码中时间 delta=500ms。实际上，应该换算为每秒的速度。

### 下载完成

当一个文件下载完成、中断或者被取消，需要通知渲染进程修改状态，通过监听 [downloadItem](https://www.electronjs.org/docs/api/download-item)
的 done 事件。

```js
item.on('done', (e, state) => {
  downloadItem.state = state
  downloadItem.receivedBytes = item.getReceivedBytes()
  downloadItem.lastModifiedTime = item.getLastModifiedTime()

  // 通知渲染进程，更新下载状态
  webContents.send('downloadItemDone', downloadItem)
})
```

### 打开文件和打开文件所在位置

使用 electron 的 shell 模块来实现打开文件（[openPath](https://www.electronjs.org/docs/api/shell#shellopenpathpath)
）和打开文件所在位置（[showItemInFolder](https://www.electronjs.org/docs/api/shell#shellshowiteminfolderfullpath)）。

- 由于 openPath 方法支持返回值 `Promise<string>`，当不支持打开的文件，系统会有相应的提示，
- showItemInFolder 方法返回值是 `void`。如果需要更好的用户体验，可使用 nodejs 的 fs 模块，先检查文件是否存在。

```ts
import fs from 'fs'

// 打开文件
const openFile = (path: string): boolean => {
  if (!fs.existsSync(path)) return false
  shell.openPath(path)
  return true
}

// 打开文件所在位置
const openFileInFolder = (path: string): boolean => {
  if (!fs.existsSync(path)) return false
  shell.showItemInFolder(path)
  return true
}
```

### 文件图标

很方便的是使用 app 模块的 [getFileIcon](https://www.electronjs.org/docs/api/app#appgetfileiconpath-options)
方法来获取系统关联的文件图标，返回的是 `Promise<NativeImage>` 类型，可以用 toDataURL 方法转换成
base64，不需要我们去处理不同文件类型显示不同的图标。

```js
const getFileIcon = async (path: string) => {
  const iconDefault = './icon_default.png'
  if (!path) Promise.resolve(iconDefault)

  const icon = await app.getFileIcon(path, {
    size: 'normal'
  })

  return icon.toDataURL()
}
```

### 下载记录

使用 [electron-store](https://github.com/sindresorhus/electron-store) 将下载记录保存在本地。

