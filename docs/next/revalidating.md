# Next.js Revalidating

- 官方文档：<https://nextjs.org/docs/app/getting-started/revalidating>
- 文档页面版本：Next.js 16.4.2

## 核心理解

Revalidation 是更新缓存数据的过程：继续享受缓存速度，同时让内容保持新鲜。本文同样针对 Cache Components。

## 两种方式

### 按时间更新

在 `use cache` 中使用 `cacheLife`：

```tsx
export async function getProducts() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM products')
}
```

常见 profile 有 `seconds`、`minutes`、`hours`、`days`、`weeks`、`max`，也可以传入 `stale`、`revalidate`、`expire` 配置对象。

### 按需更新

- `revalidateTag`：按标签失效，采用 stale-while-revalidate，旧数据先返回，后台生成新数据。
- `updateTag`：立即让缓存失效，适合用户刚写入后必须马上看到自己的修改；只能在 Server Actions 使用。
- `revalidatePath`：让指定路径的缓存失效；不清楚标签时可用，但通常标签更精确。

```tsx
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string) {
  // 修改数据
  revalidateTag('user', 'max')
}
```

## 记忆要点

1. `cacheLife` 解决“多久更新一次”。
2. `revalidateTag` 适合后台刷新，允许短暂旧数据。
3. `updateTag` 适合 read-your-own-writes。
4. 优先使用标签失效，减少路径级过度失效。
