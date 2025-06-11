import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { config as appConfig } from '../config/env';

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl, // 后端地址
  timeout: appConfig.timeout, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    // 可以在这里添加token
    const token = localStorage.getItem(appConfig.tokenKey);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 显示loading
    // showLoading();

    return config;
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 隐藏loading
    // hideLoading();

    // 2xx 范围内的状态码都会触发该函数
    // 对响应数据做点什么
    const { data, status } = response;

    // 根据后端返回的状态码进行判断
    if (status === 200) {
      // 这里可以根据你的后端API设计调整
      if (data.code === 200) {
        return data.data; // 直接返回数据部分
      } else {
        message.error(data.message || '请求失败');
        return Promise.reject(new Error(data.message || '请求失败'));
      }
    }

    return response;
  },
  (error: AxiosError) => {
    // 隐藏loading
    // hideLoading();

    // 超出 2xx 范围的状态码都会触发该函数
    // 对响应错误做点什么
    console.error('响应错误:', error);

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          message.error('未授权，请重新登录');
          // 清除token并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求地址出错');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error((data as { message?: string })?.message || '请求失败');
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接');
    } else {
      message.error('请求配置错误');
    }

    return Promise.reject(error);
  }
);

export default request; 