import qrcode from "qrcode";
import CookieParser from "tough-cookie";

const CONFIG = {
    "url": {
        "url_get_qrcode": "https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
        "url_check_scan": "https://passport.bilibili.com/x/passport-login/web/qrcode/poll"
    },
    "headers": {
        "user-agent": "Mozilla/5.0",
        "referer": "https://www.bilibili.com/"
    },
    "qrcode_location": "./qrcode.png"
}


async function getQrcodeMessage(url, headers) {
    try {
        const response = await fetch(url, {headers});
        const responseData = await response.json();

        if (responseData.code !== 0) {
            throw new Error('getQrcodeMessage failed.');
        }

        return {
            qrcode_key: responseData.data.qrcode_key,
            url_qrcode: responseData.data.url
        };
    } catch (error) {
        console.error('Error fetching QR code:', error);
        return {}
    }
}

async function prepareQrcodeLogin() {
    return await getQrcodeMessage(CONFIG['url'].url_get_qrcode, CONFIG.headers)
}

async function check_scan(url, qrcode_key, headers) {
    try {
        const finalUrl = url + "?qrcode_key=" + qrcode_key;
        const response = await fetch(finalUrl, {
            method: 'GET',
            headers
        });
        const responseData = await response.json();
        const cookies = response.headers.getSetCookie();

        if (responseData.code !== 0) {
            throw new Error('check_scan failed.');
        }

        return {"data": responseData['data'], "cookies": cookies};
    } catch (error) {
        console.error('Error check_scan:', error);
        return {}
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateQrcodeImage(url_qrcode) {
    try {
        return await qrcode.toDataURL(url_qrcode);
    } catch (err) {
        console.error('Error generating QR code image base64:', err);
        return ''
    }
}

function parseCookies(cookies) {
    return cookies.reduce((prevVal, curVal, curIdx, arr) => {
        const oneCookie = CookieParser.parse(curVal)
        if (oneCookie) {
            prevVal.push(oneCookie);
        }
        return prevVal
    }, [])
}

async function checkScanQrcode(win, qrcode_key) {
    let local_qrcode_key = qrcode_key

    while (true) {
        const checkScanResp = await check_scan(CONFIG['url'].url_check_scan, local_qrcode_key, CONFIG.headers);
        const checkScanData = checkScanResp['data'];

        const resultCode = checkScanData['code']
        switch (resultCode) {
            case 86101:
                console.log(resultCode, "未扫码")
                console.log()
                await sleep(3000)
                break;
            case 86090:
                console.log(resultCode, "二维码已扫码未确认")
                console.log()
                await sleep(3000)
                break;
            case 86038:
                console.log(checkScanData['message'], "二维码已失效，重新获取中")
                console.log()
                const {url_qrcode, qrcode_key} = await prepareQrcodeLogin();
                local_qrcode_key = qrcode_key

                await sleep(2000)
                const base64url = await generateQrcodeImage(url_qrcode);
                if (base64url) {
                    win.webContents.send('qrcode-update', base64url);
                }
                break;
            case 0:
                console.log("登录成功，获取cookie中")
                // string []
                const cookies = checkScanResp['cookies'];
                // string [] -> object []
                return parseCookies(cookies)
            default:
                console.log('未知状态码：', resultCode)
                break;
        }
    }
}

enum LoginStatus {
    /** Cookie 有效且登录状态正常 */
    VALID = 'VALID',
    /** Cookie 明确失效 */
    INVALID = 'INVALID',
    /** 网络错误或其他异常情况 */
    UNKNOWN = 'UNKNOWN'
}

// 定义返回类型
interface CheckLoginStatusRS {
    status: LoginStatus
    message: string
    data?: any
    error?: Error
}

function cookieArrayToString(cookieArray) {
    return cookieArray
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');
}


// 检查B站Cookie有效性
async function checkBiliLoginCookie(cookieArray: [], timeoutMillis: number = 5000): Promise<CheckLoginStatusRS> {
    try {
        const controller = new AbortController()
        // 设定5秒就abort
        const timeoutId = setTimeout(() => controller.abort(), timeoutMillis)

        const response = await fetch('https://api.bilibili.com/x/web-interface/nav', {
            headers: {
                'Cookie': cookieArrayToString(cookieArray),
                'User-Agent': 'Mozilla/5.0'
            },
            // 告诉这个http请求，5秒拿不到就放弃
            signal: controller.signal
        })

        // 如果能走到这里，说明早于5秒出结果，可能成功也可能失败
        clearTimeout(timeoutId)

        if (!response.ok) {
            return {
                status: LoginStatus.UNKNOWN,
                message: `HTTP错误: ${response.status}`,
                error: new Error(`HTTP ${response.status}`)
            }
        }

        const data = await response.json()

        if (data.code === 0 && data.data?.isLogin) {
            return {
                status: LoginStatus.VALID,
                message: 'Cookie有效',
                data: data.data
            }
        } else {
            return {
                status: LoginStatus.INVALID,
                message: data.message || 'B站API返回非零状态码',
                data: data
            }
        }

    } catch (error) {
        return {
            status: LoginStatus.UNKNOWN,
            message: error instanceof Error ? error.message : '未知网络错误',
            error: error instanceof Error ? error : new Error(String(error))
        }
    }
}

// 带重试的高级检查
async function checkLoginStatusWithRetry(cookieArray: [], maxTries = 3): Promise<CheckLoginStatusRS> {
    for (let attempt = 1; attempt <= maxTries; attempt++) {
        const result = await checkBiliLoginCookie(cookieArray)

        if (result.status !== LoginStatus.UNKNOWN) {
            return result
        }

        if (attempt < maxTries) {
            const delay = attempt * 1000
            console.warn(`第${attempt}次检测失败，${delay}ms后重试...`)
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }

    return {
        status: LoginStatus.UNKNOWN,
        message: `达到最大重试次数（${maxTries}次）仍无法确定状态`
    }
}

export {
    checkLoginStatusWithRetry,
    prepareQrcodeLogin,
    generateQrcodeImage,
    checkScanQrcode
}

