# Axios 配置和使用指南

## 项目结构

```
src/
├── config/
│   └── env.ts              # 环境配置
├── utils/
│   └── request.ts          # axios 封装
├── services/
│   ├── api.ts              # API 接口定义
│   └── README.md           # 本文档
├── types/
│   └── api.ts              # API 类型定义
└── hooks/
    └── useApi.ts           # API Hook
```

## 安装依赖

```bash
npm install axios
```

## 配置说明

### 1. 环境配置 (`src/config/env.ts`)

```typescript
export const config = {
  apiBaseUrl: 'http://localhost:3000', // 后端API地址
  timeout: 10000,                      // 请求超时时间
  tokenKey: 'token',                   // Token存储key
};
```

### 2. Axios 封装 (`src/utils/request.ts`)

- **请求拦截器**: 自动添加Token、处理loading状态
- **响应拦截器**: 统一错误处理、消息提示
- **错误处理**: 401跳转登录、网络错误提示等

### 3. API 接口定义 (`src/services/api.ts`)

按模块组织API接口，提供类型安全的调用方式：

```typescript
// 用户相关API
export const userApi = {
  login: (data: LoginRequest) => request.post<string>('/auth/login', data),
  getUserInfo: () => request.get<UserInfo>('/user/info'),
  // ...
};

// 数据相关API
export const dataApi = {
  getList: (params?: ListParams) => request.get<ListResponse<DataItem>>('/data/list', { params }),
  create: (data: CreateDataRequest) => request.post<DataItem>('/data', data),
  // ...
};
```

## 使用方式

### 1. 基本使用

```typescript
import { userApi } from '../services/api';

// 登录
const handleLogin = async () => {
  try {
    const token = await userApi.login({ username: 'admin', password: '123456' });
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('登录失败:', error);
  }
};
```

### 2. 使用 useApi Hook

```typescript
import { useApi } from '../hooks/useApi';
import { userApi } from '../services/api';

const MyComponent = () => {
  const loginApi = useApi(userApi.login, {
    showSuccessMessage: true,
    successMessage: '登录成功！',
  });

  const handleLogin = async (values) => {
    try {
      await loginApi.execute(values);
      // 登录成功后的处理
    } catch (error) {
      // 错误已被自动处理
    }
  };

  return (
    <Button 
      onClick={() => handleLogin({ username: 'admin', password: '123456' })}
      loading={loginApi.loading}
    >
      登录
    </Button>
  );
};
```

### 3. 使用 useApiData Hook

```typescript
import { useApiData } from '../hooks/useApi';
import { dataApi } from '../services/api';

const DataList = () => {
  const { data, loading, fetch } = useApiData(dataApi.getList, true); // immediate=true

  return (
    <div>
      <Button onClick={fetch} loading={loading}>刷新</Button>
      <Table dataSource={data?.list} loading={loading} />
    </div>
  );
};
```

## API 类型定义

在 `src/types/api.ts` 中定义所有API相关的TypeScript类型：

```typescript
export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
```

## 错误处理

### 自动处理的错误

- **401**: 自动清除token并跳转登录页
- **403**: 显示"拒绝访问"提示
- **404**: 显示"请求地址出错"提示
- **500**: 显示"服务器内部错误"提示
- **网络错误**: 显示"网络错误，请检查网络连接"

### 自定义错误处理

```typescript
try {
  const data = await userApi.getUserInfo();
} catch (error) {
  // 自定义错误处理
  if (error.response?.status === 403) {
    message.error('权限不足');
  }
}
```

## 最佳实践

1. **模块化组织**: 按功能模块组织API接口
2. **类型安全**: 为所有API定义TypeScript类型
3. **统一错误处理**: 使用拦截器统一处理错误
4. **Loading状态**: 使用useApi Hook自动管理loading状态
5. **环境配置**: 使用环境变量管理不同环境的API地址

## 示例页面

查看 `src/pages/ApiExample.tsx` 获取完整的使用示例。 