# React Router 模块化配置

这个项目使用了 React Router v6 实现模块化的路由管理。

## 项目结构

```
src/
├── components/
│   ├── Layout.tsx          # 主布局组件
│   └── ProtectedRoute.tsx  # 路由守卫组件
├── pages/
│   ├── Home.tsx           # 首页
│   ├── About.tsx          # 关于页面
│   ├── Contact.tsx        # 联系页面
│   ├── Login.tsx          # 登录页面
│   ├── NotFound.tsx       # 404页面
│   ├── User/              # 用户模块
│   │   ├── Profile.tsx    # 用户资料
│   │   ├── Settings.tsx   # 用户设置
│   │   ├── UserLayout.tsx # 用户模块布局
│   │   └── index.ts       # 用户模块导出
│   └── index.ts           # 页面统一导出
├── router/
│   ├── routes.tsx         # 路由配置
│   └── index.ts           # 路由模块导出
├── App.tsx
└── main.tsx
```

## 路由配置特性

### 1. 嵌套路由
- 主路由使用 `Layout` 组件作为外层布局
- 用户模块使用 `UserLayout` 组件实现二级布局
- 支持无限层级嵌套

### 2. 路由守卫
- 使用 `ProtectedRoute` 组件保护需要认证的路由
- 自动重定向到登录页面
- 登录成功后返回原页面

### 3. 错误处理
- 全局错误边界处理
- 404页面处理
- 友好的错误提示

## 如何添加新路由

### 1. 创建页面组件
```tsx
// src/pages/NewPage.tsx
import React from 'react';

const NewPage: React.FC = () => {
  return (
    <div>
      <h1>新页面</h1>
    </div>
  );
};

export default NewPage;
```

### 2. 导出页面组件
```tsx
// src/pages/index.ts
export { default as NewPage } from './NewPage';
```

### 3. 添加路由配置
```tsx
// src/router/routes.tsx
import { NewPage } from '../pages';

// 在路由配置中添加
{
  path: 'new-page',
  element: <NewPage />,
}
```

### 4. 添加导航链接
```tsx
// src/components/Layout.tsx
{
  key: 'new-page',
  label: <Link to="/new-page">新页面</Link>,
}
```

## 路由守卫使用

### 保护单个路由
```tsx
{
  path: 'protected',
  element: (
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  ),
}
```

### 保护嵌套路由
```tsx
{
  path: 'admin',
  element: (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    // 子路由也会被保护
  ],
}
```

## 导航方法

### 使用 Link 组件
```tsx
import { Link } from 'react-router-dom';

<Link to="/about">关于我们</Link>
```

### 使用 useNavigate Hook
```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/about');
navigate(-1); // 后退
navigate(1);  // 前进
```

### 编程式导航
```tsx
import { useNavigate } from 'react-router-dom';

const handleClick = () => {
  navigate('/user/profile', { 
    replace: true,  // 替换当前历史记录
    state: { from: 'home' }  // 传递状态
  });
};
```

## 获取路由参数

### URL 参数
```tsx
// 路由配置: /user/:id
import { useParams } from 'react-router-dom';

const { id } = useParams();
```

### 查询参数
```tsx
import { useSearchParams } from 'react-router-dom';

const [searchParams] = useSearchParams();
const page = searchParams.get('page');
```

### 路由状态
```tsx
import { useLocation } from 'react-router-dom';

const location = useLocation();
const state = location.state;
```

## 最佳实践

1. **模块化组织**: 按功能模块组织路由和组件
2. **懒加载**: 使用 React.lazy 实现代码分割
3. **路径常量**: 定义路径常量避免硬编码
4. **类型安全**: 使用 TypeScript 确保路由参数类型安全
5. **SEO 优化**: 为每个页面设置合适的 title 和 meta 标签 