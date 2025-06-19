import './styles/style.css'
import './assets/iconfont/iconmes.css'
import App from './App.vue'
import { createApp } from 'vue'
import router from './router/index'
import { initializeConfig } from './common/devConfig'
import { updateBaseURL } from './axios/index'

const app = createApp(App)

// 应用启动时检查系统HTTPS支持并初始化配置
initializeConfig().then((config) => {
    console.log('配置初始化完成')
    // 更新axios的baseURL
    updateBaseURL(config.baseUrl)
}).catch(error => {
    console.error('配置初始化失败:', error)
});

// 打印机信息

//路由
app.use(router)

//全局组件
const components = []
components.forEach(component => {
    app.component(component.__name, component)
})

app.mount('#app')
