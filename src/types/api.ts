// 用户相关类型
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  avatar?: string;
}

// 数据相关类型
export interface ListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface ListResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DataItem {
  id: number;
  title: string;
  content: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateDataRequest {
  title: string;
  content: string;
  status?: 'active' | 'inactive';
}

export interface UpdateDataRequest {
  title?: string;
  content?: string;
  status?: 'active' | 'inactive';
}

// API响应通用类型
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// 文件上传相关类型
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

export interface DeleteFileRequest {
  url: string;
} 