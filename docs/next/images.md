# Next.js Image Optimization

- 官方文档：<https://nextjs.org/docs/app/getting-started/images>
- 文档页面版本：Next.js 16.4.2

## 核心理解

`next/image` 扩展 HTML `<img>`，自动处理尺寸、现代格式、懒加载和布局稳定性。

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/profile.png"
      alt="Profile"
      width={500}
      height={500}
    />
  )
}
```

## 本地图片

放在 `public` 中时使用 `/profile.png`。静态 import 图片时，Next.js 可以自动知道 `width`、`height` 和可选的 `blurDataURL`，减少布局偏移。

## 远程图片

远程图片需要手动提供 `width` 和 `height`，或者使用 `fill`。还必须在 `next.config.ts` 的 `images.remotePatterns` 中精确允许来源：

```ts
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        pathname: '/my-bucket/**',
      },
    ],
  },
}
```

来源模式越精确越安全，避免任意远程地址被利用。

## 记忆要点

1. 优先使用 `Image`，它解决尺寸、懒加载和布局偏移。
2. 远程图片要配置 `remotePatterns`。
3. `alt`、尺寸和来源白名单都要认真填写。
