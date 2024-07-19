import './styles/style.css';
import './assets/iconfont/iconmes.css';
import App from './App.vue'
import {createApp} from 'vue'
import uuid from '@/utils/guid'
import router from './router/index'

const app = createApp(App)

//唯一标识
console.log(uuid())
window.localStorage.setItem('uuid', uuid())

//路由
app.use(router)

//全局组件
const components = [];
components.forEach(component => {
    app.component(component.__name, component);
});

app.mount('#app')
