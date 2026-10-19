# Next.js Mutating Data

- 官方文档：<https://nextjs.org/docs/app/getting-started/mutating-data>
- 文档页面版本：Next.js 16.4.2

## 核心理解

写入、更新或删除数据时，使用 React Server Functions（在 mutation 场景通常称 Server Actions）。它们在服务器执行，客户端通过网络请求调用。

```tsx
// app/actions.ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  // 写入数据库
}
```

可以通过表单调用：

```tsx
<form action={createPost}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
```

Server Functions 只能由异步函数实现，底层使用 `POST`。它们可能被直接 POST 调用，因此每个函数内部都必须验证身份、权限和资源归属。

## 客户端调用

Client Component 不能定义 Server Function，但可以导入带有 `'use server'` 的函数，在 `formAction`、事件处理器或 `useEffect` 中调用。

使用 `useActionState` 可以显示 pending 状态和操作结果。Server Functions 的客户端调用按顺序派发；并行工作应放在一个 Server Function 内，或改用数据获取和 Route Handler。

## 更新后的 UI

- `refresh()`：刷新当前 Router UI，但不重新验证带标签的数据。
- `revalidatePath('/posts')`：按路径重新验证缓存。
- `revalidateTag('posts')`：按标签重新验证缓存。
- `redirect('/posts')`：写入后跳转；调用后面的代码不会继续执行。
- Server Action 中修改 cookie 后，Next.js 会重新渲染当前页面和布局。

## 记忆要点

1. 写入操作优先放在 Server Function。
2. 每个 Server Function 都要自己做认证和授权。
3. 表单可以渐进增强，即使 JavaScript 尚未加载也能提交。
4. 写入后根据需求使用 `refresh`、`revalidatePath`、`revalidateTag` 或 `redirect`。
