# Next.js Proxy

- 官方文档：<https://nextjs.org/docs/app/getting-started/proxy>
- 文档页面版本：Next.js 16.4.2

## 核心理解

从 Next.js 16 开始，Middleware 更名为 Proxy。它在请求完成前运行，可以根据请求修改响应、重写路径、重定向，或直接返回响应。

```ts
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

Proxy 适合请求头、A/B 实验路由和基于请求信息的重定向。简单固定重定向优先使用 `next.config.ts` 的 `redirects`。

不要把 Proxy 当成慢数据获取、完整会话管理或最终授权系统。它只适合做快速的前置检查。

项目只支持一个 `proxy.ts`，可以把具体逻辑拆到其他模块中再统一导入。

## 记忆要点

1. Next.js 16 中 Middleware 改名为 Proxy。
2. Proxy 在请求完成前运行。
3. 用 `matcher` 限制作用路径。
4. 简单重定向用配置，复杂请求逻辑才用 Proxy。
