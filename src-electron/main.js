/*
 * @Author: BINGWU
 * @Date: 2024-07-23 10:28:06
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-23 18:02:42
 * @FilePath: \print_client_service\src-electron\main.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const { createPrintWindow } = require('./print')
const { exec } = require('child_process')
const { join } = require('path')
const os = require('os')
const AutoLaunch = require('auto-launch')

let mainWindow
let tray

function createWindow() {
    if (mainWindow) {
        mainWindow.show()
        return
    }
    mainWindow = new BrowserWindow({
        width: 464,
        height: 610,
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
    })
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
            label: '显示', click: () => {
                mainWindow.show()
            }
        },
        {
            label: '退出', click: () => {
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

// 处理获取打印机脱机状态的请求
ipcMain.handle('get-printer-status', async (event, printerName) => {
    return new Promise((resolve, reject) => {
        exec(`wmic printer where name="${printerName}" get name,printerstatus`, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error: ${error}`)
                return
            }
            if (stderr) {
                reject(`stderr: ${stderr}`)
                return
            }
            const str = stdout.replace(/\s+/g, '')
            const printerStatuses = ["其他", "打印机为脱机状态", "打印机为空闲状态", "打印机为打印状态", "打印机为暂停状态", "打印机为错误状态", "正在初始化", "正在暖机", "正在节能"]
            const status = printerStatuses[parseInt(str[str.length - 1]) - 1]
            resolve(status)
        })
    })
})