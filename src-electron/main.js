/*
 * @Author: BINGWU
 * @Date: 2024-07-23 10:28:06
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-13 14:10:16
 * @FilePath: \print_client_service\src-electron\main.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const { join } = require('path')
const os = require('os')
const AutoLaunch = require('auto-launch')

let mainWindow
let tray

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 464,
        height: 557,
        icon: join(__dirname, '../src/assets/logo.png'),
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
    tray = new Tray(join(__dirname, 'logo.png')) // 替换为你的托盘图标路径
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
            autoLauncher.enable();
        }
    }).catch((err) => {
        console.error('Error checking auto-launch status:', err);
    });
    createTray()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})



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