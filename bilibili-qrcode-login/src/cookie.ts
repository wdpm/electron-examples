import * as path from "path";
import * as fs from "fs";
import {writeFileSync} from "node:fs";


/**
 * 设置单个 Cookie
 * @param {Session} session - Electron session 对象
 * @param {Object} cookieData - 从接口获得的 cookie 对象
 */
async function setCookie(session, cookieData) {
    // ignore `sameSite` field
    const {url, name, value, domain, path, secure, httpOnly, expirationDate} = cookieData

    // 这里不要处理大量数据更改，可以格式化
    await session.cookies.set({
        url,
        name,
        value,
        domain: domain.startsWith('.') ? domain : `.${domain}`, // 处理域名格式
        path: path || '/',
        secure: secure,
        httpOnly: httpOnly,
        // The expiration date of the cookie as the number of seconds since the UNIX epoch.
        // If omitted then the cookie becomes a session cookie and will not be retained between sessions.
        expirationDate: expirationDate || (Date.now() / 1000) + 86400 * 180 // 默认 180 天过期
    })
}

// 批量设置 Cookie
async function setAllCookies(session, cookiesArray) {
    for (const cookie of cookiesArray) {
        try {
            await setCookie(session, cookie)
            console.log(`Cookie set: ${cookie.name}`)
        } catch (error) {
            console.error(`Failed to set ${cookie.name}:`, error)
        }
    }
}

const LOGIN_COOKIE_NAMES = ['SESSDATA', 'bili_jct', 'DedeUserID', 'DedeUserID__ckMd5', 'sid'];

enum CookieExistence {
    Present = "Present",
    Absent = "Absent",
}

enum CookieAvailability {
    Available = "Available",
    Unavailable = "Unavailable",
    Unknown = "Unknown",
}

export interface CookieState {
    existence: CookieExistence;
    availability?: CookieAvailability;
}

export const MissingCookie: CookieState = {
    existence: CookieExistence.Absent,
};

export  const ValidCookie: CookieState = {
    existence: CookieExistence.Present,
    availability: CookieAvailability.Available,
};

export const UnValidCookie: CookieState = {
    existence: CookieExistence.Present,
    availability: CookieAvailability.Unavailable,
};

export const UnDeterminatedCookie: CookieState = {
    existence: CookieExistence.Present,
    availability: CookieAvailability.Unknown,
};

async function existLoginCookiesInBrowser(session) {
    const cookies = await session.cookies.get({domain: '.bilibili.com'})
    return LOGIN_COOKIE_NAMES.every(name =>
        cookies.some(cookie => cookie.name === name)
    );
}

async function getLoginCookiesInBrowser(session) {
    const cookies = await session.cookies.get({domain: '.bilibili.com'})
    return cookies.filter(cookie => LOGIN_COOKIE_NAMES.includes(cookie.name))
}

async function deleteLoginCookieInBrowser(session: Electron.Session){
    LOGIN_COOKIE_NAMES.every(async name =>
        await session.cookies.remove('https://bilibili.com', name)
    );
}

async function recoverLoginCookiesToBrowser(session, absoluteFilePath) {
    const jsonArr = await readJSONFile(absoluteFilePath);
    await setAllCookies(session, jsonArr)
}

async function saveLoginCookiesToFile(session: Electron.Session, absoluteFilePath) {
    const cookiesToSave = (await Promise.all(
        LOGIN_COOKIE_NAMES.map(name => session.cookies.get({name}))
    )).flat().filter(Boolean); // 过滤掉 null/undefined

    try {
        writeFileSync(absoluteFilePath, JSON.stringify(cookiesToSave))
    } catch (err) {
        console.error('Write login cookies failed.', err)
    }
}

async function readJSONFile(absoluteFilePath) {
    try {
        const data = await fs.promises.readFile(absoluteFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('读取JSON文件失败:', error)
        return []
    }
}

async function deleteJSONFile(absoluteFilePath) {
    try {
        const ok = await fs.promises.unlink(absoluteFilePath)
        return true
    } catch (error) {
        console.error('删除JSON文件失败:', error)
        return false
    }
}

function convertToElectronCookies(rawCookieArray, options = {}) {
    // 数据的覆盖在这个方法做
    const defaultOptions = {
        url: 'https://bilibili.com',
        domain: 'bilibili.com',
        path: '/',
        secure: true,
        httpOnly: true,
        expirationDate: Math.floor(Date.now() / 1000) + 86400 * 180 // 默认 30 天过期
    };

    const mergedOptions = {...defaultOptions, ...options};

    return rawCookieArray.map((el, index, arr) => ({
        name: el.key || el.name,
        value: String(el.value),
        url: mergedOptions.url,
        domain: el.domain ?? mergedOptions.domain,
        path: el.path ?? mergedOptions.path,
        // 这里不能这样写 ||, 切记，因为false值也是合理值。使用 ?? 排除 undefined 和 null
        secure: el.secure ?? mergedOptions.secure,
        httpOnly: el.httpOnly ?? mergedOptions.httpOnly,
        // MUST convert date string to number
        expirationDate: Math.floor(new Date(el.expires).getTime()) / 1000 || mergedOptions.expirationDate
    }));
}

async function setupLoginCookiesInBrowser(session, rawCookieArray) {
    const electronCookies = convertToElectronCookies(rawCookieArray, {});
    await setAllCookies(session, electronCookies).then(() => {
    })
}

export {
    deleteLoginCookieInBrowser,
    existLoginCookiesInBrowser,
    getLoginCookiesInBrowser,
    recoverLoginCookiesToBrowser,
    setupLoginCookiesInBrowser,
    saveLoginCookiesToFile,
    readJSONFile,
    deleteJSONFile
}