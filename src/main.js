import './styles/style.css'
import './assets/iconfont/iconmes.css'
import App from './App.vue'
import { createApp } from 'vue'
import router from './router/index'

const app = createApp(App)



//路由
app.use(router)

//全局组件
const components = []
components.forEach(component => {
    app.component(component.__name, component)
})

app.mount('#app')
