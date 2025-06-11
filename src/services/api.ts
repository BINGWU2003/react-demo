import request from '../utils/request';
import type {
  LoginRequest,
  RegisterRequest,
  UserInfo,
  UpdateUserRequest,
  ListParams,
  ListResponse,
  DataItem,
  CreateDataRequest,
  UpdateDataRequest,
  UploadResponse,
  DeleteFileRequest,
} from '../types/api';

// 用户相关接口
export const userApi = {
  // 登录
  login: (data: LoginRequest) => {
    return request.post<string>('/auth/login', data);
  },

  // 获取用户信息
  getUserInfo: () => {
    return request.get<UserInfo>('/user/info');
  },

  // 更新用户信息
  updateUserInfo: (data: UpdateUserRequest) => {
    return request.put<UserInfo>('/user/info', data);
  },

  // 注册
  register: (data: RegisterRequest) => {
    return request.post<UserInfo>('/auth/register', data);
  },

  // 注销
  logout: () => {
    return request.post<void>('/auth/logout');
  },
};

// 数据相关接口
export const dataApi = {
  // 获取列表数据
  getList: (params?: ListParams) => {
    return request.get<ListResponse<DataItem>>('/data/list', { params });
  },

  // 获取详情
  getDetail: (id: string | number) => {
    return request.get<DataItem>(`/data/${id}`);
  },

  // 创建数据
  create: (data: CreateDataRequest) => {
    return request.post<DataItem>('/data', data);
  },

  // 更新数据
  update: (id: string | number, data: UpdateDataRequest) => {
    return request.put<DataItem>(`/data/${id}`, data);
  },

  // 删除数据
  delete: (id: string | number) => {
    return request.delete<void>(`/data/${id}`);
  },
};

// 文件上传相关接口
export const uploadApi = {
  // 上传文件
  uploadFile: (file: FormData) => {
    return request.post<UploadResponse>('/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 删除文件
  deleteFile: (data: DeleteFileRequest) => {
    return request.delete<void>('/upload', { data });
  },
};

// 统一导出
export default {
  user: userApi,
  data: dataApi,
  upload: uploadApi,
}; 