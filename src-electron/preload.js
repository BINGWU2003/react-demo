/*
 * @Author: BINGWU
 * @Date: 2024-07-23 17:42:37
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-06 15:44:36
 * @FilePath: \print_client_service\src-electron\preload.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getMacAddress: () => ipcRenderer.invoke('get-mac-address')
});