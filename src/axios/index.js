import axios from 'axios'
import router from "@/router";
import {showToast} from '@/utils/common';
import devConfig from "@/common/devConfig";
import {client} from "@/utils/store";

//创建axios实例
const request = axios.create({
    baseURL: client.baseUrl || devConfig.baseUrl,
    timeout: 5000,
})
//请求拦截
request.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = token
    }
    return config
})

//响应拦截
request.interceptors.response.use((response) => {
    const res = response.data;
    if (res.code == 511) {
        showToast('登录失效，请重新登录')
        router.replace('/login')
    } else {
        if (res.state === 'ok') {
            if (response.headers.authorization) {
                res.headerToken = response.headers.authorization
            }
            return res;
        } else {
            if (res.msg || res.message) {
                showToast(res.msg || res.message)
            }
            return Promise.reject(res);
        }
    }
}, (error) => {
    return Promise.reject(error)
},)
//对外暴露
export default request