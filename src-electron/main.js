/*
 * @Author: BINGWU
 * @Date: 2024-07-23 10:28:06
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-06 15:44:59
 * @FilePath: \print_client_service\src-electron\main.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
const { app, BrowserWindow, ipcMain } = require('electron')
const { join } = require('path')
const os = require('os')
// 屏蔽安全警告
// ectron Security Warning (Insecure Content-Security-Policy)
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建浏览器窗口时，调用这个函数。
const createWindow = () => {
    const win = new BrowserWindow({
        width: 464,
        height: 557,
        icon: join(__dirname, '../src/assets/logo.png'),
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    })

    // win.loadURL('http://localhost:3000')
    // development模式
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
        // 开启调试台
        win.webContents.openDevTools()
    } else {
        win.loadFile(join(__dirname, '../dist/index.html'))
    }
}

// Electron 会在初始化后并准备
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
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