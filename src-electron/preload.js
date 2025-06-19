/*
 * @Author: BINGWU
 * @Date: 2024-07-23 17:42:37
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-14 09:48:51
 * @FilePath: \print_client_service\src-electron\preload.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  getMacAddress: () => ipcRenderer.invoke('get-mac-address'),
  getComputerName: () => ipcRenderer.invoke('get-computer-name'),
  print: (htmlContent, options) => ipcRenderer.invoke('print', htmlContent, options),
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  getPrinterStatus: (printerName) => ipcRenderer.invoke('get-printer-status', printerName),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  generateLog: (message) => ipcRenderer.invoke('generate-log', message),
  showMainWindow: () => ipcRenderer.send('show-main-window'),
  checkHttpsSupport: () => ipcRenderer.invoke('check-https-support')
})
