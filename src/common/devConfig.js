/*
 * @Author: BINGWU
 * @Date: 2024-07-23 10:28:06
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-13 11:51:57
 * @FilePath: \print_client_service\src\common\devConfig.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
export default {
    baseUrl: import.meta.env.MODE === 'development' ? 'http://192.168.100.55:81' : 'https://mgy.iipcloud.com'
}