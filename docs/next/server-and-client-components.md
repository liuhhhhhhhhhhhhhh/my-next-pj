# Next.js Server and Client Components 总结

- 官方文档：<https://nextjs.org/docs/app/getting-started/server-and-client-components>
- 文档页面版本：Next.js 16.4.2

## 一句话理解

Next.js 默认把页面放在服务器上渲染；只有需要状态、事件处理或浏览器 API 的部分，才切到 Client Component。

## 为什么要分 Server 和 Client

服务器和浏览器擅长的事情不同：

- 服务器适合访问数据库、调用 API、使用密钥，并减少发送给浏览器的 JavaScript。
- 浏览器适合按钮交互、状态更新、`useEffect` 和 `localStorage`。

因此，合理的做法是：大部分 UI 留在服务器，只有真正需要交互的局部组件放到客户端。

## 什么时候使用 Server Components

默认的 `page` 和 `layout` 都是 Server Components，适合：

- 从数据库或 API 获取数据
- 使用 API key、token 等秘密信息
- 减少客户端 JavaScript 体积
- 提前渲染内容并流式发送给浏览器

## 什么时候使用 Client Components

当组件需要以下能力时使用 Client Component：

- `useState`
- `onClick`、`onChange` 等事件处理
- `useEffect` 等生命周期逻辑
- `window`、`localStorage`、`navigator` 等浏览器 API
- 自定义 Hooks

在文件顶部添加：

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}
```

## `use client` 的真实含义

`'use client'` 不只是“这个组件在浏览器运行”的标记，它会建立 Server 和 Client Module Graph 的边界。

标记后：

- 该文件会进入客户端模块图
- 它直接导入的模块也会进入客户端 bundle
- 它直接渲染的客户端组件也属于客户端模块图

所以不要在很大的布局或页面顶部随意添加 `'use client'`，否则会把大量代码发送到浏览器。

更好的做法是把边界放在最小的交互组件上：

```text
Layout（Server Component）
├── Logo（Server Component）
└── Search（Client Component）
```

## Server 和 Client 如何组合

服务器组件可以获取数据，再通过 props 传给客户端组件：

```tsx
// Server Component
import LikeButton from './like-button'

export default async function Page() {
  const post = await getPost()

  return <LikeButton likes={post.likes} />
}
```

```tsx
// Client Component
'use client'

export default function LikeButton({ likes }: { likes: number }) {
  return <button>{likes} likes</button>
}
```

传给 Client Component 的 props 必须能被 React 序列化。函数、某些复杂对象和服务器专用对象不能直接传递。

## 在 Client Component 中嵌入 Server Component

可以通过 `children` 或其他 props 把 Server Component 传入 Client Component：

```tsx
// Client Component
'use client'

export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

```tsx
// Server Component
export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

这里的 `Cart` 仍然可以在服务器上渲染。Client Component 只是提供交互容器。

## Context Provider 的放置方式

React Context 不支持直接在 Server Component 中创建。可以创建一个 Client Provider：

```tsx
'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  )
}
```

然后在服务器布局中使用它：

```tsx
<ThemeProvider>{children}</ThemeProvider>
```

Provider 应尽量放深，只包住实际需要 Context 的部分，这样 Next.js 可以继续优化外层静态内容。

## 第三方组件

如果第三方组件内部使用了 `useState` 等客户端能力，但它自己没有声明 `'use client'`，可以用一个 Client Component 包装它：

```tsx
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

这样服务器组件就可以安全地导入这个包装组件。

## 防止服务器代码泄露到客户端

服务器专用代码可能包含 API key：

```tsx
export async function getData() {
  return fetch('https://example.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
}
```

可以使用 `server-only` 明确标记：

```tsx
import 'server-only'

export async function getData() {
  // server-only logic
}
```

如果这个模块被 Client Component 导入，构建时会报错。

对应地，包含 `window` 等浏览器专用逻辑的模块可以使用 `client-only`。

只有以 `NEXT_PUBLIC_` 开头的环境变量会被放入客户端 bundle；普通环境变量不会公开。

## 渲染过程的简单理解

首次访问时：

1. 服务器渲染 Server Components。
2. 生成 HTML，浏览器先显示静态页面。
3. 发送 RSC Payload，描述服务器组件结果和客户端组件位置。
4. JavaScript 对 Client Components 进行 hydration，使按钮等功能可交互。

后续导航时，RSC Payload 可以被预取和缓存，Client Components 在客户端完成渲染。

## 实际使用建议

- 默认先写 Server Component，出现交互需求时再加 `'use client'`。
- 把客户端边界放在最小的交互组件上。
- 数据获取和秘密信息处理放在服务器端。
- 只把必要的数据通过 props 传给客户端组件。
- Provider 尽量包裹较深的节点，不要一上来包住整个文档。
- 第三方交互组件不能直接在 Server Component 中使用时，用 Client wrapper 包装。
- 用 `server-only` 和 `client-only` 防止环境误用。

## 记忆要点

1. `page` 和 `layout` 默认是 Server Components。
2. 需要状态、事件或浏览器 API 时才使用 Client Components。
3. `'use client'` 会扩大客户端模块图，要放在尽可能小的组件上。
4. Server Component 可以通过 props 或 `children` 组合 Client Component。
5. 传给 Client Component 的 props 必须可序列化。
6. Context Provider 必须是 Client Component，并且应尽量放深。
7. API key 和数据库逻辑应该留在服务器端。
