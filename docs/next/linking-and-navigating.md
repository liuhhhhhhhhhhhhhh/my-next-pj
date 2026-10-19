# Next.js Linking and Navigating 总结

- 官方文档：<https://nextjs.org/docs/app/getting-started/linking-and-navigating>
- 文档页面版本：Next.js 16.4.2

## 一句话理解

Next.js 通过预取（prefetching）、流式渲染（streaming）和客户端过渡（client-side transitions），让服务端渲染的页面也能保持快速、连续的导航体验。

## 为什么需要这些优化

Next.js 的页面和布局默认是 React Server Components。服务器需要先生成 Server Component Payload，再把结果发给浏览器。

服务端渲染的优点是数据和页面可以在服务器处理，但缺点是：如果用户点击链接后才开始请求，页面可能要等服务器响应。

Next.js 用三个机制减少等待感：

1. 预取：提前加载用户可能访问的页面。
2. 流式渲染：页面准备到哪一部分，就先发送哪一部分。
3. 客户端过渡：切换页面时不刷新整个浏览器页面。

## `Link` 是首选导航方式

```tsx
import Link from 'next/link'

export default function Navigation() {
  return <Link href="/blog">Blog</Link>
}
```

`Link` 扩展了 HTML 的 `<a>`，提供预取和客户端导航。默认情况下，当链接进入视口时，Next.js 会在后台预取它。

普通 `<a href="/contact">` 不会获得同样的 Next.js 预取行为。

## 预取规则

- 静态路由：通常会预取完整路由。
- 动态路由：可能跳过预取，或只预取部分内容。
- 动态路由如果有 `loading.tsx`，可以预取共享布局和加载 UI。

可以关闭某个链接的预取：

```tsx
<Link prefetch={false} href="/blog">
  Blog
</Link>
```

适合大量链接的页面，例如无限滚动表格，否则浏览器可能为用户不会点击的链接消耗资源。

代价是：关闭预取后，用户点击时才开始请求，导航可能变慢。

## 流式渲染和 `loading.tsx`

流式渲染允许服务器先发送已经准备好的部分，而不必等整个页面完成。

在动态路由中添加：

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <LoadingSkeleton />
}
```

Next.js 会自动把页面放进 Suspense 边界。用户会先看到 `LoadingSkeleton`，真实页面准备好后再替换它。

它的价值是：用户马上看到反馈，布局仍然可以交互，页面不会看起来像“没有响应”。

## 客户端过渡

传统的页面跳转会刷新整个页面，导致：

- 页面状态被清空
- 滚动位置重置
- 交互暂时中断

使用 `Link` 时，Next.js 会保留共享布局，只替换当前页面内容。这让服务端渲染应用拥有接近客户端应用的切换体验。

Next.js 还会处理导航后的滚动到顶部。如果固定头部遮挡了内容，可以使用 CSS：

```css
scroll-padding-top: 4rem;
```

## 动态路由为什么可能变慢

### 没有 `loading.tsx`

动态路由可能要等服务器完成响应后才能显示页面。建议添加：

```text
app/blog/[slug]/loading.tsx
```

这样可以启用部分预取和即时加载反馈。

### 没有 `generateStaticParams`

如果动态页面其实可以在构建时生成，但没有提供 `generateStaticParams`，它可能退回到请求时动态渲染。

```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://example.com/posts').then((res) => res.json())

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}
```

如果内容适合提前生成，这可以减少用户访问时的等待。

## 慢网络下的反馈

预取不一定能在用户点击前完成。可以使用 `useLinkStatus` 显示正在导航的提示：

```tsx
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()

  return (
    <span
      aria-hidden
      className={pending ? 'link-hint is-pending' : 'link-hint'}
    />
  )
}
```

实际使用时可以加约 100ms 的延迟，避免快速导航时提示一闪而过。

## 原生 History API

Next.js 支持使用浏览器原生的：

- `window.history.pushState`：增加一条历史记录，用户可以返回
- `window.history.replaceState`：替换当前记录，用户不能返回到被替换的状态

它们会和 Next.js Router、`usePathname`、`useSearchParams` 保持同步。

适合：

- 用 `pushState` 更新排序条件，让用户可以返回之前的排序
- 用 `replaceState` 切换语言，避免用户返回到旧语言状态

## 实际使用建议

- 页面之间的内部链接优先使用 `Link`。
- 动态页面通常应配套 `loading.tsx`。
- 可以静态生成的动态路由使用 `generateStaticParams`。
- 大量链接时，可以考虑关闭预取或只在 hover 时预取。
- 慢网络下使用 `useLinkStatus` 或进度条提供反馈。
- 只有确实需要修改浏览器历史记录时才直接使用 `pushState` 或 `replaceState`。
- 客户端 JavaScript 过大时，`Link` 的预取也可能因 hydration 延迟而启动较晚；应减少客户端代码和大依赖。

## 记忆要点

1. `Link` 是 Next.js 内部导航的首选方式。
2. 预取让用户点击前就准备好目标页面。
3. `loading.tsx` 让动态路由可以更早显示反馈。
4. 流式渲染不必等待整个页面完成。
5. `generateStaticParams` 可以把适合的动态页面提前生成。
6. `prefetch={false}` 能节省资源，但会增加点击后的等待。
7. `pushState` 增加历史记录，`replaceState` 替换当前记录。
