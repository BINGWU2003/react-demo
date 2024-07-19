import axios from 'axios'

const token = window.localStorage.getItem('token')
//创建axios实例
const request = axios.create({
    baseURL: 'http://192.168.0.30:81',
    timeout: 5000,
})
//请求拦截
request.interceptors.request.use((config) => {
    if (token) {
        config.headers.Authorization = token
    }
    return config
})

//响应拦截
request.interceptors.response.use((response) => {
    const res = response.data;
    if (res.state === 'ok') {
        if (response.headers.authorization) {
            window.localStorage.setItem('token', response.headers.authorization)
        }
        return res;
    } else {
        return Promise.reject(res);
    }
}, (error) => {
    return Promise.reject(error)
},)
//对外暴露
export default request