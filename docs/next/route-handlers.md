# Next.js Route Handlers

- 官方文档：<https://nextjs.org/docs/app/getting-started/route-handlers>
- 文档页面版本：Next.js 16.4.2

## 核心理解

Route Handler 是 `app` 目录中的自定义 HTTP 请求处理器，相当于 App Router 里的后端 API。

```ts
// app/api/route.ts
export async function GET(request: Request) {
  return Response.json({ ok: true })
}
```

支持 `GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD` 和 `OPTIONS`。不支持的方法返回 `405`。

可以使用原生 `Request` / `Response`，也可以使用 Next.js 的 `NextRequest` / `NextResponse`。

## 重要规则

- 只能放在 `app` 目录中。
- 同一路由段不能同时有 `page.tsx` 和 `route.ts`。
- Route Handler 不参与页面布局和客户端导航。
- 默认不缓存；可以为 `GET` 显式开启缓存。

使用 Cache Components 时，`GET` Handler 遵循和页面相近的预渲染规则。请求、数据库、`headers()`、`cookies()` 或非确定性操作会让它转为请求时执行。

## 记忆要点

1. `route.ts` 是后端 HTTP 入口。
2. 页面使用 `page.tsx`，接口使用 `route.ts`。
3. API 逻辑要自行处理认证、输入校验和错误。
4. 不要让同一路径同时承担页面和 Route Handler。
