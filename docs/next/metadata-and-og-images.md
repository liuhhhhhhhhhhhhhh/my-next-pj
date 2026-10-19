# Next.js Metadata and OG Images

- 官方文档：<https://nextjs.org/docs/app/getting-started/metadata-and-og-images>
- 文档页面版本：Next.js 16.4.2

## 核心理解

Metadata API 用来生成 SEO、浏览器图标和社交分享信息。Next.js 会自动生成对应的 `<head>` 标签。

Metadata 只能从 Server Components 导出。

## 静态 metadata

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'A useful blog',
}
```

可以在 `layout.tsx` 或 `page.tsx` 中导出。

## 动态 metadata

需要根据文章、商品等数据生成标题时使用 `generateMetadata`：

```tsx
export async function generateMetadata({ params }) {
  const post = await getPost((await params).slug)

  return {
    title: post.title,
    description: post.description,
  }
}
```

动态页面的 metadata 可以单独流式返回，不必阻塞页面 UI。机器人会收到完整的 head metadata；如需控制机器人，可配置 `htmlLimitedBots`。

## 文件约定

常用特殊文件：

- `favicon.ico`
- `icon.png`、`apple-icon.png`
- `opengraph-image.jpg`
- `twitter-image.jpg`
- `robots.txt`
- `sitemap.xml`

OG 图片可以按路由放置，越靠近具体路由的文件优先级越高。需要动态生成时使用 `opengraph-image.tsx` 和 `ImageResponse`，但它只支持部分 CSS，主要是 flexbox。

## 记忆要点

1. 静态信息用 `metadata`。
2. 依赖数据的信息用 `generateMetadata`。
3. metadata API 只支持 Server Components。
4. OG 图片和 sitemap 等文件也有约定文件名。
