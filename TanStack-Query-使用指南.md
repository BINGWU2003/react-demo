# TanStack Query 使用指南

## 📖 简介

TanStack Query（原名React Query）是一个强大的数据同步库，专为React应用程序设计。它简化了在React应用中获取、缓存、同步和更新服务器状态的过程。

### 主要特性

- 🔄 **自动缓存** - 智能的数据缓存机制
- 🔁 **后台重新获取** - 自动保持数据最新
- ⚡ **乐观更新** - 提升用户体验
- 📱 **离线支持** - 网络恢复时自动同步
- 🎯 **精确的重新渲染** - 只在需要时重新渲染组件
- 🚀 **并行和依赖查询** - 高效的数据获取策略

## 🚀 安装和设置

### 1. 安装依赖

```bash
# npm
npm install @tanstack/react-query

# yarn
yarn add @tanstack/react-query

# pnpm
pnpm add @tanstack/react-query
```

### 2. 基本配置

```tsx
// main.tsx 或 App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据被认为是陈旧的时间
      staleTime: 5 * 60 * 1000, // 5分钟
      // 缓存时间
      cacheTime: 10 * 60 * 1000, // 10分钟
      // 失败时重试次数
      retry: 3,
      // 重新获取条件
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourAppComponents />
      {/* 开发工具（仅在开发环境） */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## 📊 核心概念

### 1. useQuery - 数据查询

`useQuery` 是获取数据的主要 Hook。

#### 基本语法

```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['key'], // 查询键
  queryFn: fetchFunction, // 查询函数
  // 其他选项...
});
```

#### 实际示例

```tsx
import { useQuery } from '@tanstack/react-query';

// API 服务函数
const fetchUsers = async () => {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('获取用户列表失败');
  }
  return response.json();
};

// 组件中使用
function UserList() {
  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5分钟内认为数据是新鲜的
  });

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      <button onClick={() => refetch()}>刷新数据</button>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 2. useMutation - 数据变更

`useMutation` 用于创建、更新或删除数据。

#### 基本语法

```tsx
const mutation = useMutation({
  mutationFn: mutationFunction,
  onSuccess: (data) => {
    // 成功回调
  },
  onError: (error) => {
    // 错误回调
  },
});
```

#### 实际示例

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

// API 服务函数
const createUser = async (userData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('创建用户失败');
  }
  return response.json();
};

function CreateUserForm() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // 使相关查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['users'] });
      alert('用户创建成功！');
    },
    onError: (error) => {
      alert(`创建失败: ${error.message}`);
    },
  });

  const handleSubmit = (formData) => {
    createMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单字段 */}
      <button
        type="submit"
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? '创建中...' : '创建用户'}
      </button>
    </form>
  );
}
```

### 3. 查询键（Query Keys）

查询键用于唯一标识和缓存查询。

```tsx
// 简单字符串键
useQuery({ queryKey: ['users'], queryFn: fetchUsers });

// 数组键（支持参数）
useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId)
});

// 复杂对象键
useQuery({
  queryKey: ['users', { page: 1, limit: 10, status: 'active' }],
  queryFn: ({ queryKey }) => {
    const [, params] = queryKey;
    return fetchUsers(params);
  }
});
```

## 🛠️ 高级用法

### 1. 分页查询

```tsx
function UsersPagination() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['users', { page, limit }],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey;
      return fetchUsers(params);
    },
    placeholderData: keepPreviousData, // 保持之前的数据，避免加载闪烁
  });

  return (
    <div>
      {data?.users.map(user => <div key={user.id}>{user.name}</div>)}
      
      <div>
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          上一页
        </button>
        <span>第 {page} 页</span>
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={isPlaceholderData || !data?.hasMore}
        >
          下一页
        </button>
      </div>
    </div>
  );
}
```

### 2. 无限查询

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

function InfiniteUserList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['users-infinite'],
    queryFn: ({ pageParam = 1 }) => fetchUsers({ page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  const users = data?.pages.flatMap(page => page.users) ?? [];

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? '加载中...' : '加载更多'}
        </button>
      )}
    </div>
  );
}
```

### 3. 乐观更新

```tsx
function TodoItem({ todo }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    // 乐观更新
    onMutate: async (newTodoData) => {
      // 取消正在进行的查询
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // 获取之前的数据
      const previousTodos = queryClient.getQueryData(['todos']);

      // 乐观更新
      queryClient.setQueryData(['todos'], (old) => {
        return old?.map(item =>
          item.id === todo.id ? { ...item, ...newTodoData } : item
        );
      });

      // 返回上下文对象，包含之前的数据
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      // 错误时回滚
      queryClient.setQueryData(['todos'], context.previousTodos);
    },
    onSettled: () => {
      // 无论成功还是失败，都重新获取数据
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <div>
      <span>{todo.title}</span>
      <button onClick={() => updateMutation.mutate({ completed: !todo.completed })}>
        {todo.completed ? '未完成' : '已完成'}
      </button>
    </div>
  );
}
```

### 4. 依赖查询

```tsx
function UserProfile({ userId }) {
  // 首先获取用户信息
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId, // 只有当 userId 存在时才执行查询
  });

  // 基于用户信息获取用户的文章
  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchUserPosts(user.id),
    enabled: !!user?.id, // 只有当用户数据加载完成后才执行
  });

  return (
    <div>
      {user && <h1>{user.name}</h1>}
      {posts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## 🎯 实际项目示例

### 完整的用户管理组件

```tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API 服务
const userAPI = {
  getUsers: async (params) => {
    const response = await fetch(`/api/users?${new URLSearchParams(params)}`);
    return response.json();
  },
  createUser: async (userData) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
  updateUser: async (user) => {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },
  deleteUser: async (userId) => {
    await fetch(`/api/users/${userId}`, { method: 'DELETE' });
  },
};

function UserManagement() {
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const [editingUser, setEditingUser] = useState(null);
  const queryClient = useQueryClient();

  // 获取用户列表
  const { data: userData, isLoading } = useQuery({
    queryKey: ['users', query],
    queryFn: () => userAPI.getUsers(query),
  });

  // 创建用户
  const createMutation = useMutation({
    mutationFn: userAPI.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      alert('用户创建成功！');
    },
  });

  // 更新用户
  const updateMutation = useMutation({
    mutationFn: userAPI.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
      alert('用户更新成功！');
    },
  });

  // 删除用户
  const deleteMutation = useMutation({
    mutationFn: userAPI.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      alert('用户删除成功！');
    },
  });

  const handleSubmit = (formData) => {
    if (editingUser) {
      updateMutation.mutate({ ...editingUser, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <div>加载中...</div>;

  return (
    <div>
      {/* 用户表单 */}
      <UserForm
        user={editingUser}
        onSubmit={handleSubmit}
        onCancel={() => setEditingUser(null)}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* 用户列表 */}
      <div>
        {userData?.users?.map(user => (
          <div key={user.id}>
            <span>{user.name} - {user.email}</span>
            <button onClick={() => setEditingUser(user)}>编辑</button>
            <button
              onClick={() => deleteMutation.mutate(user.id)}
              disabled={deleteMutation.isPending}
            >
              删除
            </button>
          </div>
        ))}
      </div>

      {/* 分页 */}
      <Pagination
        current={query.page}
        total={userData?.total}
        pageSize={query.limit}
        onChange={(page, pageSize) => setQuery({ page, limit: pageSize })}
      />
    </div>
  );
}
```

## ⚙️ 配置选项

### QueryClient 配置

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据保持新鲜的时间
      staleTime: 5 * 60 * 1000, // 5分钟
      
      // 数据在内存中的缓存时间
      cacheTime: 10 * 60 * 1000, // 10分钟
      
      // 失败重试次数
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
      
      // 重试延迟
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // 窗口聚焦时重新获取
      refetchOnWindowFocus: false,
      
      // 网络重连时重新获取
      refetchOnReconnect: true,
      
      // 组件挂载时重新获取
      refetchOnMount: true,
    },
    mutations: {
      // Mutation 失败重试次数
      retry: 1,
    },
  },
});
```

### useQuery 选项

```tsx
useQuery({
  queryKey: ['key'],
  queryFn: fetchFunction,
  
  // 启用/禁用查询
  enabled: true,
  
  // 数据新鲜时间
  staleTime: 0,
  
  // 缓存时间
  cacheTime: 5 * 60 * 1000,
  
  // 重试配置
  retry: 3,
  retryDelay: 1000,
  
  // 重新获取配置
  refetchInterval: false, // 定时重新获取
  refetchIntervalInBackground: false,
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  
  // 数据转换
  select: (data) => data.someProperty,
  
  // 初始数据
  initialData: [],
  
  // 占位数据
  placeholderData: keepPreviousData,
  
  // 错误边界
  throwOnError: false,
  
  // 元数据
  meta: { custom: 'value' },
});
```

## 🔧 调试和开发工具

### React Query Devtools

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      
      {/* 开发工具 - 仅在开发环境显示 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
```

### 日志和调试

```tsx
// 启用查询日志
const queryClient = new QueryClient({
  logger: {
    log: console.log,
    warn: console.warn,
    error: console.error,
  },
});

// 手动检查缓存
const userData = queryClient.getQueryData(['users']);
console.log('当前用户数据:', userData);

// 手动设置缓存
queryClient.setQueryData(['users'], newUserData);

// 手动触发重新获取
queryClient.invalidateQueries({ queryKey: ['users'] });
```

## 🎯 最佳实践

### 1. 查询键规范

```tsx
// ✅ 推荐：结构化的查询键
const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userPosts: (userId: string) => ['users', userId, 'posts'] as const,
  posts: ['posts'] as const,
  post: (id: string) => ['posts', id] as const,
};

// 使用
useQuery({
  queryKey: queryKeys.user(userId),
  queryFn: () => fetchUser(userId),
});
```

### 2. 错误处理

```tsx
// 全局错误边界
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: (error) => error.response?.status >= 500,
    },
  },
});

// 组件级错误处理
function UserList() {
  const { data, error, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    throwOnError: false, // 不抛出错误，在组件中处理
  });

  if (isError) {
    return (
      <div className="error">
        <h3>加载失败</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>重试</button>
      </div>
    );
  }

  return <div>{/* 正常内容 */}</div>;
}
```

### 3. 性能优化

```tsx
// 使用 select 减少不必要的重新渲染
const { data: userNames } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  select: (data) => data.map(user => user.name), // 只关心名字
});

// 预取数据
const queryClient = useQueryClient();

const prefetchUser = (userId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000,
  });
};

// 在列表中预取详情
function UserListItem({ user }) {
  return (
    <div
      onMouseEnter={() => prefetchUser(user.id)} // 鼠标悬停时预取
    >
      {user.name}
    </div>
  );
}
```

### 4. 类型安全（TypeScript）

```tsx
// 定义 API 响应类型
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserListResponse {
  users: User[];
  total: number;
  page: number;
}

// 类型化的查询 Hook
const useUsers = (params: QueryParams) => {
  return useQuery<UserListResponse, Error>({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  });
};

// 类型化的变更 Hook
const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, CreateUserRequest>({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      // 类型安全的缓存更新
      queryClient.setQueryData<UserListResponse>(
        ['users'],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            users: [...oldData.users, newUser],
            total: oldData.total + 1,
          };
        }
      );
    },
  });
};
```

## 📚 总结

TanStack Query 是一个功能强大的数据同步库，它为React应用提供了：

- **简化的数据获取** - 通过声明式API简化异步操作
- **智能缓存** - 自动缓存和数据同步
- **优秀的用户体验** - 加载状态、错误处理、乐观更新
- **开发者体验** - 强大的开发工具和调试功能

通过合理使用TanStack Query，可以显著提升React应用的数据管理能力和用户体验。建议在实际项目中根据具体需求选择合适的功能和配置选项。

---

*本文档基于 TanStack Query v4/v5 编写，更多详细信息请参考 [官方文档](https://tanstack.com/query/latest)* 