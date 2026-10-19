# Next.js Caching

- 官方文档：<https://nextjs.org/docs/app/getting-started/caching>
- 文档页面版本：Next.js 16.4.2

## 核心理解

缓存就是保存数据或计算结果，让后续请求直接复用。本文针对 Cache Components，需要在 `next.config.ts` 中启用：

```ts
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
}
```

新建项目的推荐默认配置通常已经启用它。

## `use cache`

可以缓存数据函数，也可以缓存整个组件或页面：

```tsx
import { cacheLife } from 'next/cache'

export async function getUsers() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM users')
}
```

建议每个 `use cache` 都明确配合 `cacheLife`。函数参数和外层捕获的值会参与 cache key。

需要每次请求获取最新数据时，不要使用 `use cache`，改用 `Suspense` 流式返回。

## 记忆要点

1. 先决定数据是否允许短时间返回旧值。
2. 数据级缓存适合复用数据，UI 级缓存适合缓存整个组件或页面。
3. `use cache` 缓存结果，`cacheLife` 控制生命周期。
4. 未缓存的动态数据应通过 `Suspense` 流式处理。
