# Next.js 项目结构与组织方式

- 官方文档：<https://nextjs.org/docs/app/getting-started/project-structure>
- 文档页面版本：Next.js 16.4.2

## 一句话理解

Next.js 的项目结构是一套“文件名有含义”的约定：文件夹决定 URL 层级，特殊文件决定页面、布局、加载状态、错误处理和 API 行为。

## 它解决什么问题

一个 Web 项目如果没有约定，很容易变成“所有文件都能放，但没人知道该放哪”。Next.js 用目录和文件名表达应用结构，让路由和页面组织更直观。

代价是：文件名不是随便取的。`page.tsx`、`layout.tsx`、`loading.tsx` 等名称会触发框架行为。

## 顶层目录

| 目录 | 作用 |
|---|---|
| `app` | App Router |
| `pages` | Pages Router |
| `public` | 静态资源 |
| `src` | 可选的应用源码目录 |

`src` 不是必须的。它主要用于把应用代码和 `package.json`、`next.config.js` 等项目配置分开。

## 顶层文件

常见文件包括：

- `next.config.js`：Next.js 配置
- `package.json`：依赖和 scripts
- `tsconfig.json` / `jsconfig.json`：TypeScript 或 JavaScript 配置
- `eslint.config.mjs`：ESLint 配置
- `proxy.ts`：请求代理
- `instrumentation.ts`：监控和 OpenTelemetry 配置
- `.env`、`.env.local`、`.env.production`、`.env.development`：环境变量
- `.gitignore`：Git 忽略规则

环境变量文件通常不应提交到版本控制。`next-env.d.ts` 由 Next.js 使用，也不应手动提交。

## 特殊路由文件

| 文件 | 作用 |
|---|---|
| `layout` | 共享布局，例如导航栏、页脚 |
| `page` | 页面内容，公开路由的入口 |
| `loading` | 加载中的 UI 或 skeleton |
| `not-found` | 404 页面 |
| `error` | 路由级错误边界 |
| `global-error` | 全局错误 UI |
| `route` | API endpoint |
| `template` | 每次导航重新创建的布局 |
| `default` | Parallel Routes 的备用页面 |

这些文件可以使用 `.js`、`.jsx`、`.ts` 或 `.tsx`；`route` 通常使用 `.js` 或 `.ts`。

## 路由是怎样形成的

文件夹对应 URL 片段，嵌套文件夹对应嵌套路由：

```text
app/layout.tsx                 # 根布局
app/page.tsx                   # /
app/blog/page.tsx              # /blog
app/blog/authors/page.tsx      # /blog/authors
```

只有当一个路由段中存在 `page` 或 `route` 文件时，它才会成为公开可访问的路由。普通组件、工具函数和数据文件可以安全地放在路由目录旁边。

## 动态路由

使用方括号表示动态参数：

```text
app/blog/[slug]/page.tsx       # /blog/my-first-post
app/shop/[...slug]/page.tsx    # /shop/clothing/shirts
app/docs/[[...slug]]/page.tsx  # /docs 或 /docs/api-reference/use-router
```

- `[slug]`：单个参数
- `[...slug]`：必需的 catch-all 参数
- `[[...slug]]`：可选的 catch-all 参数

参数通过 `params` prop 获取。

## Route Groups 和 Private Folders

### Route Groups：只组织代码，不改变 URL

用括号包裹文件夹名称：

```text
app/(marketing)/page.tsx
app/(shop)/cart/page.tsx
```

对应 URL 仍然是：

```text
/
/cart
```

括号中的 `(marketing)` 和 `(shop)` 不会出现在 URL 中。它们适合：

- 按业务区域组织页面
- 给不同区域配置不同布局
- 把某些页面放进同一个布局

### Private Folders：明确标记内部文件

以下划线开头的文件夹不会参与路由：

```text
app/blog/_components/Post.tsx
app/blog/_lib/data.ts
```

不过，`app` 目录本身默认支持安全共置（colocation），普通组件文件也不会自动变成路由。因此 `_components` 不是必须的，主要用于表达“这是内部实现”。

## Parallel Routes 和 Intercepted Routes

这两个功能用于更复杂的界面：

- `@slot`：给父布局提供命名插槽，例如侧边栏和主内容区
- `(.)folder`：在同一层拦截路由，常用于弹窗预览
- `(..)folder`：拦截父级路由
- `(...)folder`：从根路径拦截路由

它们适合复杂导航和 Modal 场景，普通页面不需要一开始就使用。

## 元数据文件约定

Next.js 可以通过文件名识别图标、社交分享图片和 SEO 文件：

- `favicon.ico`
- `icon.png`、`icon.svg` 或动态生成的 `icon.tsx`
- `apple-icon.png`
- `opengraph-image.png`
- `twitter-image.png`
- `sitemap.xml` 或 `sitemap.ts`
- `robots.txt` 或 `robots.ts`

## 组件渲染层级

一个路由段中的特殊文件大致按以下层级组合：

```text
layout
  └── template
       └── error
            └── loading
                 └── not-found
                      └── page 或子 layout
```

嵌套路由会递归地套用父级路由的组件。因此，根布局会影响所有页面，`app/blog/layout.tsx` 只影响 `/blog` 及其子路由。

## 如何组织业务代码

官方没有强制唯一方案，常见有三种：

1. 把业务代码放在 `app` 外部，让 `app` 只负责路由。
2. 在 `app` 顶层放 `components`、`lib` 等共享目录。
3. 按功能或路由拆分，把只服务于某个页面的组件放在该路由附近。

`components` 和 `lib` 只是常见命名，不是 Next.js 的特殊目录。也可以使用 `ui`、`utils`、`hooks` 或其他名称。

## 实际使用建议

- 小项目可以让 `app` 同时承担路由和局部组件共置。
- 大项目建议用 Route Groups 按业务区域划分，并为区域配置独立布局。
- 共享组件放在统一目录，页面专用组件放在对应路由附近。
- 只有真正需要公开访问的目录才添加 `page` 或 `route` 文件。
- 动态路由先从 `[id]` 开始，只有确实需要多级路径时才使用 catch-all。
- Parallel Routes 和 Intercepted Routes 解决特定 UI 问题，不要为了目录“看起来高级”而使用。

## 记忆要点

1. 文件夹决定 URL 片段，嵌套文件夹决定嵌套路由。
2. `page` 才会公开页面，`route` 才会公开 API。
3. `layout` 负责共享 UI，`loading`、`error` 和 `not-found` 负责状态界面。
4. `[id]`、`[...slug]` 和 `[[...slug]]` 分别表示不同类型的动态路由。
5. `(group)` 不进入 URL，`_folder` 不参与路由。
6. `app` 中可以安全共置组件和工具文件。
7. Next.js 不强制唯一的业务目录结构，关键是团队保持一致。
