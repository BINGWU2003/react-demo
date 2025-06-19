/*
 * @Author: BINGWU
 * @Date: 2024-07-23 10:28:06
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-13 11:51:57
 * @FilePath: \print_client_service\src\common\devConfig.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */

// 初始默认配置
const config = {
    baseUrl: import.meta.env.MODE === 'development' ? 'http://192.168.100.55:81' : 'https://mgy.iipcloud.com'
}

// 检查是否支持HTTPS并更新配置
async function initConfig() {
    // 只在生产环境下检查HTTPS支持
    if (import.meta.env.MODE !== 'development') {
        try {
            window.electron?.generateLog?.('开始检测当前系统HTTPS支持情况（中国国内环境）...')
            // 检查是否支持HTTPS
            const supportsHttps = await window.electron.checkHttpsSupport()

            if (!supportsHttps) {
                // 如果不支持HTTPS，将URL退化为HTTP
                const originalUrl = config.baseUrl
                config.baseUrl = config.baseUrl.replace('https://', 'http://')
                console.warn('当前系统不支持HTTPS，已退化为HTTP请求')
                // 记录日志
                window.electron?.generateLog?.(`由于中国国内网络环境特殊性，检测到系统环境不支持安全HTTPS连接，API地址已从 ${originalUrl} 退化为 ${config.baseUrl}`)
            } else {
                window.electron?.generateLog?.('HTTPS支持检测通过，使用HTTPS连接访问服务')
            }
        } catch (error) {
            console.error('检查HTTPS支持时出错:', error)
            window.electron?.generateLog?.(`检查HTTPS支持时出错: ${error.message}`)
        }
    }
    return config
}

// 导出异步初始化的配置
export default config

// 导出初始化函数以供应用启动时调用
export const initializeConfig = initConfig