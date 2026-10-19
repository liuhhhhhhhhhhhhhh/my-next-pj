# Next.js Layouts and Pages 总结

- 官方文档：<https://nextjs.org/docs/app/getting-started/layouts-and-pages>
- 文档页面版本：Next.js 16.4.2

## 一句话理解

Next.js 用文件夹和特殊文件定义页面：文件夹形成 URL，`page` 负责页面，`layout` 负责共享外壳，嵌套目录自然形成嵌套路由。

## 创建页面

在 `app` 目录中创建 `page.tsx`，并默认导出 React 组件：

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

它对应首页 `/`。

## 创建布局

布局是多个页面共享的 UI，例如导航栏、页脚或侧边栏。布局接收 `children`，页面会渲染在 `children` 所在的位置：

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

根布局是必需的，而且必须包含 `<html>` 和 `<body>`。导航时，布局会保留状态、保持交互，不会因为页面切换而重新渲染。

## 嵌套路由

文件夹对应 URL 片段，`page.tsx` 让这个地址真正公开：

```text
app/page.tsx              → /
app/blog/page.tsx         → /blog
app/blog/authors/page.tsx → /blog/authors
```

可以继续嵌套文件夹。文件夹负责路径，`page` 和 `layout` 负责这个路径上的 UI。

## 嵌套布局

在子目录中添加 `layout.tsx`，它会包裹该目录下的页面：

```tsx
// app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

渲染关系可以理解为：

```text
app/layout.tsx
  └── app/blog/layout.tsx
       └── app/blog/page.tsx
       └── app/blog/[slug]/page.tsx
```

根布局包住所有路由，`blog` 布局只包住 `/blog` 及其子路由。

## 动态路由

使用方括号创建动态路由：

```text
app/blog/[slug]/page.tsx → /blog/my-first-post
```

页面可以从 `params` 中读取动态值：

```tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return <h1>{post.title}</h1>
}
```

动态路由适合博客文章、商品详情等“页面结构相同、数据不同”的场景。

## Search Params

如果服务端页面需要根据查询参数加载数据，可以使用 `searchParams`：

```tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const filters = (await searchParams).filters
  return <div>{String(filters)}</div>
}
```

使用 `searchParams` 会让页面采用动态渲染，因为服务器需要读取当前请求中的查询参数。

选择原则：

- 查询参数影响服务端数据加载：使用 `searchParams`。
- 只在客户端筛选已经加载的数据：使用 `useSearchParams`。
- 只在点击回调中读取参数：可以直接读取 `window.location.search`。

## 页面之间的链接

使用 Next.js 的 `Link` 组件：

```tsx
import Link from 'next/link'

export default function PostLink() {
  return <Link href="/blog/hello">查看文章</Link>
}
```

`Link` 基于 HTML 的 `<a>`，并额外提供预取（prefetching）和客户端导航（client-side navigation）。它是 Next.js 页面跳转的首选方式。

需要更复杂的编程式导航时，再考虑 `useRouter`。

## 类型辅助工具

Next.js 提供全局类型辅助工具：

- `PageProps`：页面的 `params` 和 `searchParams`
- `LayoutProps`：布局的 `children` 和命名插槽

例如：

```tsx
export default async function Page(
  props: PageProps<'/blog/[slug]'>,
) {
  const { slug } = await props.params
  return <h1>Blog post: {slug}</h1>
}
```

这些类型会在 `next dev`、`next build` 或 `next typegen` 时生成，不需要手动导入。

## 实际使用建议

- 先掌握 `page.tsx`、`layout.tsx` 和目录路由，再学习更复杂的路由功能。
- 全局导航和主题放在根布局，博客或后台专用 UI 放在对应的嵌套布局。
- 需要根据 URL 参数查询数据库时，优先使用服务端的 `searchParams`。
- 只在客户端改变已加载列表时，使用 `useSearchParams`。
- 页面跳转优先使用 `Link`，不要到处手写 `window.location`。
- 使用 `[slug]` 复用页面模板，避免为每篇文章手动创建页面文件。

## 记忆要点

1. `page.tsx` 是页面，`layout.tsx` 是共享布局。
2. 文件夹决定 URL 层级。
3. 嵌套布局会通过 `children` 层层包住子页面。
4. `[slug]` 可以从数据生成多个页面。
5. `searchParams` 适合服务端数据查询，`useSearchParams` 适合客户端读取。
6. 页面跳转优先使用 `Link`。
7. `PageProps` 和 `LayoutProps` 可以让路由参数获得类型检查。
