# Next.js Font Optimization

- 官方文档：<https://nextjs.org/docs/app/getting-started/fonts>
- 文档页面版本：Next.js 16.4.2

## 核心理解

`next/font` 会自动优化字体、内置 self-hosting、减少外部网络请求，并降低字体加载造成的布局偏移。

Google 字体：

```tsx
import { Geist } from 'next/font/google'

const geist = Geist({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return <html className={geist.className}><body>{children}</body></html>
}
```

Google 字体会作为静态资源从自己的站点提供，浏览器访问时不会再请求 Google。优先使用 variable fonts；非 variable font 需要指定 `weight`。

本地字体：

```tsx
import localFont from 'next/font/local'

const myFont = localFont({ src: './my-font.woff2' })
```

字体可以放在 `app` 中共置，也可以放在 `public`。要全站使用，就在根布局应用 `className`。

## 记忆要点

1. 用 `next/font/google` 或 `next/font/local`。
2. 全站字体放根布局。
3. variable fonts 通常更灵活。
4. `next/font` 同时改善性能、隐私和布局稳定性。
