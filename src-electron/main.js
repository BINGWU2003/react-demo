/*
 * @Author: BINGWU
 * @Date: 2024-07-23 10:28:06
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-23 18:02:42
 * @FilePath: \print_client_service\src-electron\main.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
const { app, BrowserWindow, Tray, Menu, ipcMain,shell,dialog } = require('electron')
const { createPrintWindow } = require('./print')
const { exec } = require('child_process')
const { join } = require('path')
const { existsSync } = require('fs');
const dayjs = require("dayjs");
const os = require('os')
const AutoLaunch = require('auto-launch')
const log = require("./log");
const {devMainWidowOpt} = require("./config/devConfig");
const https = require('https')
const tls = require('tls');

let mainWindow
let tray
let isDevMode = process.env.VITE_DEV_SERVER_URL;

function createWindow() {
    if (mainWindow) {
        mainWindow.show()
        return
    }
    let mainWidowOpt = {
        width: 464,
        height: 640,
        icon: join(__dirname, 'logo.ico'),
        resizable: false,
        maximizable: false,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        },
        show: false
    }
    if(isDevMode){
        mainWidowOpt = Object.assign(mainWidowOpt, devMainWidowOpt);
    }
    mainWindow = new BrowserWindow(mainWidowOpt)
    // 未打包时打开开发者工具

    if (isDevMode) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
        // 开启调试台
        mainWindow.webContents.openDevTools()
    } else {
        Menu.setApplicationMenu(null)
        mainWindow.loadFile(join(__dirname, '../dist/index.html'))
    }
    mainWindow.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault()
            mainWindow.hide()
            event.returnValue = false
        }
    })
}

function createTray() {
    tray = new Tray(join(__dirname, 'logo.ico')) // 替换为你的托盘图标路径
    const contextMenu = Menu.buildFromTemplate([
        {
            label:'日志',
            submenu:[
                {
                    label: '查看所有日志', click: () => {
                        shell.openPath(app.getPath("logs"));
                    }
                },
                {
                    label: '查看当天日志', click: () => {
                        const logFilePath = join(app.getPath("logs"), `${dayjs().format("YYYY-MM-DD")}.log`); // 替换为你的日志文件名
                        if (existsSync(logFilePath)) {
                            shell.openPath(logFilePath);
                        } else {
                            dialog.showMessageBox({
                                type: 'warning',
                                title: '日志文件不存在',
                                message: '日志文件不存在，请确认是否有日志文件生成',
                                buttons: ['确定']
                            });
                        }
                    }
                }
            ]
        },
        {
            label: '显示', click: () => {
                mainWindow.show()
            }
        },
        {
            label: '退出', click: () => {
                log('应用退出')
                app.isQuiting = true
                app.quit()
            }
        }
    ])

    tray.setToolTip('智衣通')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        mainWindow.show()
    })
}
// 确保只启动一个应用实例
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时，这里将会被调用，我们需要激活现有的窗口
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.show()
        }
    })
    app.on('ready', () => {
        createWindow()
        // 设置开机启动
        const autoLauncher = new AutoLaunch({
            name: app.getName(),
            path: app.getPath('exe')
        })
        autoLauncher.isEnabled().then((isEnabled) => {
            if (!isEnabled) {
                // 如果未启用，则启用开机自启动
                autoLauncher.enable()
            }
        }).catch((err) => {
            console.error('Error checking auto-launch status:', err)
        })
        createTray()
        log('应用启动成功')
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        } else if (mainWindow) {
            mainWindow.show()
        }
    })
}




ipcMain.handle('get-mac-address', async () => {
    const networkInterfaces = os.networkInterfaces()
    for (const interfaceName in networkInterfaces) {
        const networkInterface = networkInterfaces[interfaceName]
        for (const net of networkInterface) {
            if (net.mac && net.mac !== '00:00:00:00:00:00') {
                return net.mac
            }
        }
    }
    throw new Error('MAC address not found')
})

// 处理获取电脑名称的请求
ipcMain.handle('get-computer-name', () => {
    return os.hostname()
})


// 处理打印请求
ipcMain.handle('print', async (event, htmlContent, options) => {
    try {
        await createPrintWindow(htmlContent, options)
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
})

// 处理获取打印机列表的请求
ipcMain.handle('get-printers', (event) => {
    return mainWindow.webContents.getPrintersAsync()
})

ipcMain.handle('get-app-version', (event) => {
    return app.getVersion()
})

// 处理获取打印机脱机状态的请求
ipcMain.handle('get-printer-status', async (event, printerName) => {
    // 此状态目前只正对Xprinter打印机有效，其余打印机未验证
    let result = {
        // 在线和脱机时，返回的值不一样，且在线时的值会比脱机时的值要小，在不同电脑上，这个值会不一样
        attributes:'',
        // 正常为3or1(HP打印机)
        isError: false,
        // JobCountSinceLastReset > 0未队列中还有任务，此时为在忙
        isBusy: false,
        isOnline: false
    }
    return new Promise((resolve, reject) => {
        let cmd = `wmic printer where name="${printerName}" get Attributes,PrinterStatus,JobCountSinceLastReset, PrinterState, WorkOffline`;
        // console.log(cmd);
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error: ${error}`)
                return
            }
            if (stderr) {
                reject(`stderr: ${stderr}`)
                return
            }
            let stdoutArr = stdout.split("\n");
            let stdoutObj = arrayToMap(trimArray(stdoutArr[0].split(" ")),trimArray(stdoutArr[1].split(" ")));
            console.log(stdoutObj);
            result.attributes = stdoutObj.Attributes;
            // 4为打印中
            result.isError = !['1','3','4'].includes(stdoutObj.PrinterStatus);
            result.isPrinting = stdoutObj.PrinterStatus === '4';
            result.isBusy = stdoutObj.JobCountSinceLastReset > 0;
            result.isOnline = stdoutObj.WorkOffline.toLocaleLowerCase() === 'false';
            // console.log(result);
            resolve(result)
        })
    })

    function arrayToMap(arr1,arr2) {
        let result = {};
        arr1.forEach((key, index) => {
            result[key] = arr2[index];
        })
        return result;
    }

    // 整理数组，清除空字符串和\r\n等字符
    function trimArray(oldArr){
        return oldArr.filter(e=>e.trim());
    }
})

// 处理日志
ipcMain.handle('generate-log', (event, message) => {
    log(message);
})

// 检查系统是否支持HTTPS
ipcMain.handle('check-https-support', async () => {
    try {
        // 根据操作系统版本检查HTTPS支持
        const platform = os.platform()
        const release = os.release()
        log('操作系统版本: ' + platform + ' ' + release)
        // Windows XP (5.1) 及以下版本不支持现代HTTPS
        if (platform === 'win32') {
            const majorVersion = parseInt(release.split('.')[0])
            if (majorVersion < 6) {  // Windows Vista及以上是6.0+
                log('操作系统版本过低不支持HTTPS，退化为HTTP请求')
                return false
            }
        }

        // 检查TLS版本支持
        const tlsSupport = await checkTLSSupport()
        if (!tlsSupport.supported) {
            log(`TLS版本检查失败: ${tlsSupport.reason}, 退化为HTTP请求`)
            return false
        }

        return true
    } catch (error) {
        log('检查HTTPS支持时出错: ' + error.message)
        // 出错时保守策略：返回false表示不支持HTTPS
        return false
    }
})

// 检查TLS版本支持
async function checkTLSSupport() {
    return new Promise((resolve) => {
        try {
            // 检查Windows注册表中的TLS设置
            if (os.platform() === 'win32') {
                exec('reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Client" /v Enabled', (error, stdout) => {
                    if (error || stdout.indexOf('0x1') === -1) {
                        // 如果命令执行错误或TLS 1.2未启用，尝试进行实际TLS连接测试
                        testTLSConnection().then(result => resolve(result))
                        return
                    }

                    // TLS 1.2在注册表中被标记为启用
                    resolve({ supported: true, version: '1.2', source: 'registry' })
                })
            } else {
                // 对于非Windows系统，进行实际TLS连接测试
                testTLSConnection().then(result => resolve(result))
            }
        } catch (error) {
            log(`TLS版本检查异常: ${error.message}`)
            // 出现异常时进行实际TLS连接测试作为备用方案
            testTLSConnection().then(result => resolve(result))
        }
    })
}

// 通过尝试连接到外部服务器测试TLS版本
async function testTLSConnection() {
    return new Promise((resolve) => {
        // 设置超时，避免长时间等待
        const timeout = setTimeout(() => {
            log('TLS连接测试超时')
            resolve({ supported: false, reason: '连接测试超时', version: null })
        }, 10000)

        try {
            // 创建TLS上下文来获取支持的最高TLS版本
            // 使用中国国内可靠的HTTPS服务进行测试
            // 按顺序尝试多个国内服务，提高测试成功率
            const chineseServices = [
                { host: 'www.baidu.com', port: 443 },
                { host: 'www.qq.com', port: 443 },
                { host: 'www.taobao.com', port: 443 },
                { host: 'www.aliyun.com', port: 443 }
            ]

            // 随机选择一个服务，避免总是请求同一个服务
            const service = chineseServices[Math.floor(Math.random() * chineseServices.length)]

            log(`正在测试TLS连接: ${service.host}:${service.port}`)

            const socket = tls.connect({
                host: service.host,
                port: service.port,
                rejectUnauthorized: false, // 允许自签名证书，仅用于测试
                timeout: 10000,
                servername: service.host // 指定SNI，避免某些服务器的限制
            }, () => {
                clearTimeout(timeout)

                // 检查TLS版本
                const version = socket.getProtocol()
                log(`检测到TLS版本: ${version}`)

                // TLS 1.2及以上版本认为是安全的
                if (version && (version.includes('TLSv1.2') || version.includes('TLSv1.3'))) {
                    resolve({ supported: true, version: version, source: 'connection-test', host: service.host })
                } else {
                    resolve({ supported: false, reason: `TLS版本过低: ${version || '未知'}`, version: version })
                }

                socket.end()
            })

            socket.on('error', (error) => {
                clearTimeout(timeout)
                log(`TLS连接到 ${service.host} 测试错误: ${error.message}`)

                // 如果第一个服务失败，尝试下一个服务
                // 找到当前失败服务在数组中的位置
                const currentIndex = chineseServices.findIndex(s => s.host === service.host)
                const nextIndex = (currentIndex + 1) % chineseServices.length

                // 如果尝试过所有服务，则返回失败
                if (nextIndex <= currentIndex) {
                    resolve({ supported: false, reason: error.message, version: null })
                } else {
                    // 否则尝试下一个服务
                    const nextService = chineseServices[nextIndex]
                    log(`尝试连接下一个服务: ${nextService.host}`)

                    const nextSocket = tls.connect({
                        host: nextService.host,
                        port: nextService.port,
                        rejectUnauthorized: false,
                        timeout: 10000,
                        servername: nextService.host
                    }, () => {
                        clearTimeout(timeout)
                        const version = nextSocket.getProtocol()
                        log(`检测到TLS版本: ${version} (备用服务器: ${nextService.host})`)

                        if (version && (version.includes('TLSv1.2') || version.includes('TLSv1.3'))) {
                            resolve({ supported: true, version: version, source: 'connection-test-fallback', host: nextService.host })
                        } else {
                            resolve({ supported: false, reason: `TLS版本过低: ${version || '未知'}`, version: version })
                        }
                        nextSocket.end()
                    })

                    nextSocket.on('error', (nextError) => {
                        clearTimeout(timeout)
                        log(`备用TLS连接测试错误: ${nextError.message}`)
                        resolve({ supported: false, reason: nextError.message, version: null })
                        nextSocket.destroy()
                    })
                }

                socket.destroy()
            })
        } catch (error) {
            clearTimeout(timeout)
            log(`TLS测试异常: ${error.message}`)
            resolve({ supported: false, reason: error.message, version: null })
        }
    })
}

// 监听显示主窗口的消息
ipcMain.on('show-main-window', () => {
    if (mainWindow) {
        mainWindow.show();
    }
});