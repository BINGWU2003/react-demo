// 环境配置
export const config = {
  // API基础地址
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',

  // 应用配置
  appTitle: import.meta.env.VITE_APP_TITLE || 'React Demo',

  // 环境判断
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,

  // 请求超时时间
  timeout: 10000,

  // Token key
  tokenKey: 'token',
}; 