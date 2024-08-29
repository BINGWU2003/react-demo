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
const log = require("./log");

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
        margins:{
          marginType: "none",
        },
        deviceName: options.deviceName || '', // 替换为你的打印机名称
      }
      if(options.pageSize){
        printOptions.pageSize =options.pageSize;
      }
      printWindow.webContents.print(printOptions, (success, errorType) => {
        if (!success) {
          log('打印失败', errorType)
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