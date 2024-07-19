import './styles/style.css';
import App from './App.vue'
import { createApp } from 'vue'
const app = createApp(App)

//路由
import router from './router/index'
app.use(router)

//全局组件
import iipToast from '@/components/iipToast.vue'
const components = [
    iipToast
];
components.forEach(component => {
    app.component(component.__name, component);
});

app.mount('#app')
