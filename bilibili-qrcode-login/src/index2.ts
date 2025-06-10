import {app, BrowserWindow} from 'electron';
import {join} from "node:path";

import {existLoginCookiesInBrowser, saveLoginCookiesToFile, setupLoginCookiesInBrowser} from './cookie'
import {generateQrcodeImage, checkScanQrcode, prepareQrcodeLogin} from "./login";
import { ipcMain } from 'electron/main';

const COOKIE_SAVE_FILE = 'bilibili-login-cookies.json'

function setupIPCListeners(win) {
    ipcMain.on('check-browser-cookie', (event) => {
        event.sender.send('cookie-response', {
            type: 'check-browser-cookie',
            result: {}
        });
    });

    ipcMain.on('delete-browser-cookie', (event) => {
        event.sender.send('cookie-response', {
            type: 'delete-browser-cookie',
            result: {}
        });
    });

    ipcMain.on('check-external-cookie', (event) => {
        event.sender.send('cookie-response', {
            type: 'check-external-cookie',
            result: {}
        });
    });

    ipcMain.on('delete-external-cookie', (event) => {
        event.sender.send('cookie-response', {
            type: 'delete-external-cookie',
            result: {}
        });
    });
}

async function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // webSecurity: false,
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, 'preload.js'),
        }
    })
    const winSession = win.webContents.session
    await win.loadFile('./build/index.html')

    setupIPCListeners(win)

    // how to persist cookie
    const isLogined = await existLoginCookiesInBrowser(winSession);
    console.log('isLogined=', isLogined)
    if (!isLogined) {
        console.log('Not login, try to login and save login cookies.')

        // 准备二维码，用户扫码登录
        const {url_qrcode, qrcode_key} = await prepareQrcodeLogin()
        const base64url = await generateQrcodeImage(url_qrcode);
        if (base64url) {
            win.webContents.send('qrcode-update', base64url);
        }
        const rawCookieArray = await checkScanQrcode(win, qrcode_key);

        // 浏览器写入cookies
        await setupLoginCookiesInBrowser(winSession, rawCookieArray);

        // double-check
        const isLogined = await existLoginCookiesInBrowser(winSession);
        console.log('浏览器login cookies检查写入结果: ', isLogined)

        // persist cookieArray
        await saveLoginCookiesToFile(winSession, COOKIE_SAVE_FILE)
    }

    const url = "https://www.bilibili.com/blackboard/live/live-activity-player.html?enterTheRoom=0&cid=5895809"
    win.loadURL(url)
}

app.whenReady().then(() => {
        // 当用户手动删除cookie时，可以从用户设置恢复 recover login cookies
        createWindow()
    }
)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})