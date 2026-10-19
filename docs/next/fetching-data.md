# Next.js Fetching Data 总结

- 官方文档：<https://nextjs.org/docs/app/getting-started/fetching-data>
- 文档页面版本：Next.js 16.4.2

## 一句话理解

Next.js 推荐优先在 Server Components 中获取数据，再根据需要使用 `loading.tsx`、`Suspense` 或 Client Components，把数据逐步交给用户。

## 1. 在 Server Component 中获取数据

Server Component 可以使用异步 I/O：

- `fetch`
- ORM
- 数据库客户端

使用 `fetch`：

```tsx
// app/blog/page.tsx
export default async function Page() {
  const response = await fetch('https://api.vercel.app/blog')
  const posts = await response.json()

  return (
    <ul>
      {posts.map((post: { id: string; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

由于代码在服务器上运行，可以安全地访问数据库和使用凭据；查询逻辑和密钥不会被打包进客户端。

仍然需要自己做好身份认证和权限控制，服务器执行不等于自动安全。

## 2. `fetch` 的两个重点

- React 默认会对组件树中相同的 `fetch` 请求做请求级 memoization，组件可以直接获取自己需要的数据，不必层层传 props。
- `fetch` 请求默认不会自动缓存，且会阻塞页面直到请求完成。

如果要缓存结果，可以使用 `use cache`；如果希望边获取边显示，可以使用 `Suspense` 流式传输。

## 3. Streaming：不要让慢请求阻塞整页

如果一个慢请求阻塞整个页面，用户会长时间看不到内容。Streaming 可以把页面分成多个部分，准备好哪部分就先发送哪部分。

有两种常见方式：

1. 在路由目录添加 `loading.tsx`。
2. 用 `<Suspense>` 包住具体组件。

### 使用 `loading.tsx`

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <div>Loading...</div>
}
```

导航到 `/blog` 时，用户会先看到布局和加载 UI，数据完成后再替换成真实内容。

### 使用 `<Suspense>`

```tsx
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'

export default function BlogPage() {
  return (
    <main>
      <h1>Welcome to the Blog</h1>
      <Suspense fallback={<div>Loading posts...</div>}>
        <BlogList />
      </Suspense>
    </main>
  )
}
```

`loading.tsx` 适合整个路由的加载状态，`Suspense` 适合更细粒度地控制某个区域。

加载 UI 应该有意义，例如 skeleton、标题或封面，而不是只有空白页面。

## 4. 在 Client Component 中获取数据

常见方式有两种：

- 使用 React 的 `use` API 读取服务器传来的 Promise
- 使用 SWR、React Query 等客户端数据请求库

### 服务器发起请求，客户端用 `use` 读取

```tsx
// Server Component
import { Suspense } from 'react'
import Posts from './posts'

export default function Page() {
  const posts = getPosts()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

```tsx
// Client Component
'use client'

import { use } from 'react'

export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>
}) {
  const allPosts = use(posts)

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

这样可以让请求在服务器尽早开始，同时让客户端组件负责读取和交互。

### 使用 SWR 或 React Query

客户端组件也可以使用 SWR 或 React Query 管理：

- 客户端缓存
- 加载状态
- 错误状态
- 重新请求
- 实时更新

## 5. 顺序请求和并行请求

### 顺序请求

当第二个请求依赖第一个请求的结果时，只能顺序执行：

```tsx
const artist = await getArtist(username)
const playlists = await getArtistPlaylists(artist.id)
```

这种情况无法完全并行，但可以用 `Suspense` 让后续内容先显示加载状态。

### 并行请求

如果请求互不依赖，不要连续 `await`，应先启动请求，再用 `Promise.all` 等待：

```tsx
const artistPromise = getArtist(username)
const albumsPromise = getAlbums(username)

const [artist, albums] = await Promise.all([
  artistPromise,
  albumsPromise,
])
```

这样两个请求会同时开始，整体等待时间通常取决于较慢的那个请求。

如果希望一个失败不影响其他结果，可以使用 `Promise.allSettled`。

## 6. 复用 ORM 或数据库查询

不使用 `fetch` 时，可以用 `React.cache` 对同一请求内的相同查询进行复用：

```tsx
import { cache } from 'react'

export const getUser = cache(async (id: string) => {
  return db.query.users.findFirst({ where: { id } })
})
```

`React.cache` 的范围是当前请求，不会在不同请求之间共享结果。

## 7. 预加载数据

当组件之前还有其他阻塞工作时，数据请求可能启动得太晚。可以先调用函数但不等待它：

```tsx
export const preload = (id: string) => {
  void getItem(id)
}
```

之后在页面中提前调用：

```tsx
preload(id)
const isAvailable = await checkIsAvailable(id)
```

这样 `getItem` 和 `checkIsAvailable` 可以并行进行，减少请求瀑布。

预加载要求后续相同请求能够复用已启动的请求：`fetch` 默认支持，ORM 查询可使用 `React.cache`。

## 实际使用建议

- 默认优先在 Server Component 中获取数据。
- 涉及数据库和密钥时，把查询放在服务器端。
- 慢请求使用 `loading.tsx` 或更细粒度的 `<Suspense>`。
- 没有依赖关系的请求使用 `Promise.all`。
- 有依赖关系的请求保持顺序，但把后续区域放入 `Suspense`。
- 客户端需要缓存、实时更新或交互式重新请求时，考虑 SWR 或 React Query。
- 对 ORM 查询使用 `React.cache`，避免同一请求重复查询。
- 在已知参数可用但前面还有阻塞工作时使用预加载。

## 记忆要点

1. Server Component 是默认的数据获取位置。
2. `fetch` 和 ORM 都可以在服务器端使用。
3. `loading.tsx` 适合整条路由，`Suspense` 适合局部区域。
4. 无依赖请求用 `Promise.all` 并行执行。
5. 有依赖请求才按顺序执行。
6. Client Component 可用 React `use`、SWR 或 React Query 获取数据。
7. `React.cache` 只在当前请求内复用结果。
8. 预加载可以减少请求瀑布。
