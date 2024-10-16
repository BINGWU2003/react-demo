/*
 * @Author: BINGWU
 * @Date: 2024-07-23 10:28:06
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-23 18:02:42
 * @FilePath: \print_client_service\src-electron\main.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
const { app, BrowserWindow, Tray, Menu, ipcMain,shell } = require('electron')
const { createPrintWindow } = require('./print')
const { exec } = require('child_process')
const { join } = require('path')
const os = require('os')
const AutoLaunch = require('auto-launch')
const log = require("./log");

let mainWindow
let tray

function createWindow() {
    if (mainWindow) {
        mainWindow.show()
        return
    }
    const mainWidowOpt = {
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

    mainWindow = new BrowserWindow(mainWidowOpt)
    // 未打包时打开开发者工具
    if (process.env.VITE_DEV_SERVER_URL) {
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
            label: '查看日志', click: () => {
                shell.openPath(app.getPath("logs"));
            }
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
    }
    return new Promise((resolve, reject) => {
        let cmd = `wmic printer where name="${printerName}" get Attributes,PrinterStatus,JobCountSinceLastReset, PrinterState`;
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
            log('获取打印机状态信息:测试');
            console.log(stdoutObj);
            result.attributes = stdoutObj.Attributes;
            // 4为打印中
            result.isError = !['1','3','4'].includes(stdoutObj.PrinterStatus);
            result.isPrinting = stdoutObj.PrinterStatus === '4';
            result.isBusy = stdoutObj.JobCountSinceLastReset > 0;
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