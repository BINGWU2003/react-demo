/*
 * @Author: BINGWU
 * @Date: 2024-08-14 09:38:26
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-14 09:38:41
 * @FilePath: \print_client_service\src-electron\print.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
const { BrowserWindow } = require('electron')


function createPrintWindow(htmlContent, options = {}) {
  return new Promise((resolve, reject) => {
    const printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        enableRemoteModule: false,
        nodeIntegration: false
      }
    })

    printWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent))

    printWindow.webContents.on('did-finish-load', () => {
      const printOptions = {
        silent: true,
        printBackground: true,
        deviceName: options.deviceName || '', // 替换为你的打印机名称
        landscape: options.landscape || false, // 横向打印
        pageSize: options.pageSize || { width: 210000, height: 297000 } // A4 纸张大小，单位为微米
      }

      printWindow.webContents.print(printOptions, (success, errorType) => {
        if (!success) {
          reject(errorType)
        } else {
          resolve()
        }
        printWindow.close()
      })
    })
  })
}

module.exports = {
  createPrintWindow
}