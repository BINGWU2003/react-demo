# React 作用域插槽使用指南

## 概述

React 作用域插槽（Scoped Slots）类似于 Vue 的作用域插槽，允许父组件向子组件传递数据，同时子组件可以将内部数据传递回父组件进行渲染。这种模式在 React 中主要通过 **Render Props** 和 **Children as Function** 来实现。

## 基础概念

### 什么是作用域插槽？

作用域插槽是一种组件通信模式，允许：

- 子组件将内部数据传递给父组件
- 父组件基于接收到的数据决定如何渲染内容
- 实现更灵活的组件复用

### 与普通插槽的区别

```typescript
// 普通插槽 - 只能传递静态内容
<ContentHeader title="标题" description="描述">
  <button>静态按钮</button>
</ContentHeader>

// 作用域插槽 - 可以接收子组件数据
<ContentHeader
  title="标题"
  description="描述"
  renderActions={(data) => <button>{data.message}</button>}
/>
```

## 实现方式

### 1. Render Props 模式

这是最常用的作用域插槽实现方式。

#### 组件定义

```typescript
// src/components/content-header/index.tsx
import style from "./index.module.scss";
import { useState } from "react";

interface ContentHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  // 作用域插槽：通过函数传递数据
  renderActions?: (data: {
    message: string;
    timestamp: string;
    isActive: boolean;
    toggle: () => void;
  }) => React.ReactNode;
}

const ContentHeader = ({
  title,
  description,
  children,
  renderActions,
}: ContentHeaderProps) => {
  const [isActive, setIsActive] = useState(true);
  const [message] = useState("hello world 你好啊");
  const timestamp = new Date().toLocaleString();

  const toggle = () => setIsActive(!isActive);

  // 要传递给父组件的数据
  const slotData = {
    message,
    timestamp,
    isActive,
    toggle,
  };

  return (
    <div className={style["content-header"]}>
      <div className={style["content-header-title"]}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {/* 普通插槽 */}
      {children && (
        <div className={style["content-header-actions"]}>{children}</div>
      )}

      {/* 作用域插槽 */}
      {renderActions && (
        <div className={style["content-header-actions"]}>
          {renderActions(slotData)}
        </div>
      )}
    </div>
  );
};

export default ContentHeader;
```

#### 使用示例

```typescript
// src/pages/UserList/UserList.tsx
import ContentHeader from "../../components/content-header";

const UserList = () => {
  return (
    <div>
      {/* 使用作用域插槽 */}
      <ContentHeader
        title="用户列表"
        description="用户列表描述"
        renderActions={(data) => (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>消息: {data.message}</span>
            <span>时间: {data.timestamp}</span>
            <button
              onClick={data.toggle}
              style={{
                backgroundColor: data.isActive ? "#52c41a" : "#ff4d4f",
                color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              {data.isActive ? "激活" : "未激活"}
            </button>
            <button>刷新数据</button>
            <button>添加用户</button>
          </div>
        )}
      />

      {/* 同时支持普通插槽 */}
      <ContentHeader title="标题" description="描述">
        <button>普通按钮</button>
      </ContentHeader>
    </div>
  );
};
```

### 2. Children as Function 模式

```typescript
interface ContentHeaderProps {
  title: string;
  description: string;
  // children 作为函数
  children?: (data: SlotData) => React.ReactNode;
}

// 使用
<ContentHeader title="标题" description="描述">
  {(data) => (
    <div>
      <span>{data.message}</span>
      <button onClick={data.toggle}>切换状态</button>
    </div>
  )}
</ContentHeader>;
```

### 3. 多个具名作用域插槽

```typescript
interface ContentHeaderProps {
  title: string;
  description: string;
  renderHeader?: (data: HeaderData) => React.ReactNode;
  renderActions?: (data: ActionsData) => React.ReactNode;
  renderFooter?: (data: FooterData) => React.ReactNode;
}

const ContentHeader = ({
  title,
  description,
  renderHeader,
  renderActions,
  renderFooter,
}) => {
  const headerData = { title, subtitle: "subtitle" };
  const actionsData = { isLoading: false, refresh: () => {} };
  const footerData = { timestamp: new Date().toISOString() };

  return (
    <div>
      {renderHeader && renderHeader(headerData)}
      <div>
        {title} - {description}
      </div>
      {renderActions && renderActions(actionsData)}
      {renderFooter && renderFooter(footerData)}
    </div>
  );
};
```

## 高级用法

### 1. 泛型作用域插槽

```typescript
interface DataListProps<T> {
  data: T[];
  loading?: boolean;
  children: (
    item: T,
    index: number,
    helpers: {
      isFirst: boolean;
      isLast: boolean;
      isEven: boolean;
      isOdd: boolean;
    }
  ) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
}

function DataList<T>({
  data,
  loading,
  children,
  renderEmpty,
  renderLoading,
}: DataListProps<T>) {
  if (loading) {
    return renderLoading ? renderLoading() : <div>加载中...</div>;
  }

  if (data.length === 0) {
    return renderEmpty ? renderEmpty() : <div>暂无数据</div>;
  }

  return (
    <div>
      {data.map((item, index) => {
        const helpers = {
          isFirst: index === 0,
          isLast: index === data.length - 1,
          isEven: index % 2 === 0,
          isOdd: index % 2 === 1,
        };

        return <div key={index}>{children(item, index, helpers)}</div>;
      })}
    </div>
  );
}

// 使用示例
const users = [
  { id: 1, name: "张三", age: 25 },
  { id: 2, name: "李四", age: 30 },
];

<DataList data={users}>
  {(user, index, { isFirst, isEven }) => (
    <div style={{ backgroundColor: isEven ? "#f0f0f0" : "#fff" }}>
      {isFirst && <span>👑</span>}
      {user.name} - {user.age}岁
    </div>
  )}
</DataList>;
```

### 2. 条件渲染作用域插槽

```typescript
interface ConditionalRenderProps {
  condition: boolean;
  renderTrue?: (data: TrueData) => React.ReactNode;
  renderFalse?: (data: FalseData) => React.ReactNode;
}

const ConditionalRender = ({ condition, renderTrue, renderFalse }) => {
  if (condition) {
    return renderTrue ? renderTrue({ message: "条件为真" }) : null;
  } else {
    return renderFalse ? renderFalse({ error: "条件为假" }) : null;
  }
};
```

## 最佳实践

### 1. 类型安全

```typescript
// 定义清晰的数据类型
interface SlotData {
  message: string;
  timestamp: string;
  isActive: boolean;
  toggle: () => void;
}

interface ComponentProps {
  renderSlot?: (data: SlotData) => React.ReactNode;
}
```

### 2. 默认渲染

```typescript
const MyComponent = ({ renderContent }) => {
  const defaultRender = (data) => <div>默认内容: {data.value}</div>;

  return <div>{renderContent ? renderContent(data) : defaultRender(data)}</div>;
};
```

### 3. 性能优化

```typescript
// 使用 useMemo 优化数据计算
const MyComponent = ({ renderSlot }) => {
  const slotData = useMemo(
    () => ({
      expensiveData: computeExpensiveData(),
      timestamp: Date.now(),
    }),
    [dependencies]
  );

  return renderSlot ? renderSlot(slotData) : null;
};

// 使用 useCallback 优化函数传递
const MyComponent = ({ renderSlot }) => {
  const handleAction = useCallback(() => {
    // 处理逻辑
  }, []);

  const slotData = { action: handleAction };
  return renderSlot ? renderSlot(slotData) : null;
};
```

## 与 Vue 作用域插槽对比

| 特性     | Vue 作用域插槽            | React Render Props          |
| -------- | ------------------------- | --------------------------- |
| 语法     | `<template #slot="data">` | `renderSlot={(data) => {}}` |
| 类型支持 | TypeScript 支持           | 原生 TypeScript 支持        |
| 性能     | 编译时优化                | 运行时函数调用              |
| 学习成本 | 模板语法                  | JavaScript 函数             |

## 常见问题

### Q1: 何时使用作用域插槽？

**A:** 当您需要：

- 子组件向父组件传递数据
- 根据子组件状态动态渲染内容
- 创建高度可复用的组件

### Q2: 性能考虑

**A:**

- 使用 `useMemo` 和 `useCallback` 优化
- 避免在 render props 中创建复杂对象
- 考虑使用 `React.memo` 包装子组件

### Q3: 与 Context 的区别

**A:**

- Context 用于跨层级数据传递
- 作用域插槽用于父子组件间的渲染控制
- 可以结合使用

## 总结

React 作用域插槽通过 Render Props 模式提供了强大的组件通信能力，让组件更加灵活和可复用。合理使用作用域插槽可以：

1. 提高组件复用性
2. 增强渲染灵活性
3. 保持良好的类型安全
4. 实现复杂的交互逻辑

在实际项目中，建议根据具体需求选择合适的实现方式，并注意性能优化和类型安全。
