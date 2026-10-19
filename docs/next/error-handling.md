# Next.js Error Handling

- 官方文档：<https://nextjs.org/docs/app/getting-started/error-handling>
- 文档页面版本：Next.js 16.4.2

## 先区分两类错误

- 预期错误：表单校验失败、请求失败等正常业务情况，应作为返回值处理。
- 未捕获异常：真正的 bug 或异常情况，应抛出并交给 error boundary。

## 预期错误

Server Function 不要把可预期错误全部 `throw`，而是返回状态对象，再用 `useActionState` 展示：

```tsx
if (!res.ok) return { message: 'Failed to create post' }
```

Server Component 获取数据失败时，可以条件渲染错误信息或调用 `redirect`。

找不到资源时使用 `notFound()`，并在对应目录添加 `not-found.tsx`。

## 未捕获异常

在路由段添加 `error.tsx` 创建错误边界：

```tsx
'use client'

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  return <button onClick={retry}>Try again</button>
}
```

`error.tsx` 必须是 Client Component。错误会冒泡到最近的父级边界，因此可以按路由层级细粒度恢复。

错误边界不捕获普通事件处理器中的异常；事件处理器需要自己 `try/catch` 并存入状态。根布局出错时可使用 `global-error.tsx`，它必须自己包含 `<html>` 和 `<body>`。

## 记忆要点

1. 业务失败返回状态，程序异常交给边界。
2. `notFound()` 配合 `not-found.tsx`。
3. `error.tsx` 必须是 Client Component。
4. 事件处理器中的错误要手动处理。
