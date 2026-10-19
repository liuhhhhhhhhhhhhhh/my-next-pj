# Next.js 安装文档总结

- 官方文档：<https://nextjs.org/docs/app/getting-started/installation>
- 文档页面版本：Next.js 16.4.2

## 它解决什么问题

Next.js 把路由、构建、开发服务器和资源管理这些基础工作统一起来。代价是项目需要遵守它的目录和文件名约定。

## 一句话理解

Next.js 的安装，本质上是在建立一套约定好的项目骨架：按照规定的文件结构放代码，Next.js 就能自动理解页面、路由、布局、静态资源和构建方式。

## 快速开始

确保 Node.js 至少为 20.9，然后执行：

```bash
pnpm create next-app@latest my-app --yes
cd my-app
pnpm dev
```

打开 `http://localhost:3000` 即可访问。

也可以把 `pnpm` 换成 `npm`、`yarn` 或 `bun`。`--yes` 会跳过询问并采用默认配置，通常包括 TypeScript、Tailwind CSS、ESLint、App Router、Turbopack、`@/*` 路径别名、Cache Components 和 `AGENTS.md`。

## `app` 目录和文件路由

App Router 使用文件系统路由：

```text
app/
├── layout.tsx
├── page.tsx
└── blog/
    └── page.tsx
```

对应关系是：

```text
app/page.tsx       → /
app/blog/page.tsx  → /blog
```

`app/page.tsx` 是页面内容，`app/layout.tsx` 是共享布局。根布局必须包含 `<html>` 和 `<body>`。

## 静态资源

图片、字体等静态文件可以放在 `public/`：

```text
public/profile.png → /profile.png
```

## 常用命令

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

- `next dev`：开发模式
- `next build`：构建生产版本
- `next start`：启动生产版本
- `eslint`：检查代码

Turbopack 是默认打包器；需要 Webpack 时使用 `next dev --webpack` 或 `next build --webpack`。

## TypeScript

Next.js 内置 TypeScript 支持。使用 `.ts` 或 `.tsx` 文件并运行 `next dev`，Next.js 会自动补充必要配置。文档要求的最低 TypeScript 版本为 `5.1.0`。

## Lint

Next.js 支持 ESLint 或 Biome。从 Next.js 16 开始，`next build` 不再自动执行 lint，需要单独运行：

```bash
npm run lint
```

## 路径别名

可以在 `tsconfig.json` 或 `jsconfig.json` 中配置 `baseUrl` 和 `paths`，把：

```tsx
import { Button } from '../../../components/button'
```

简化为：

```tsx
import { Button } from '@/components/button'
```

## 实际使用建议

- 新项目优先使用 `create-next-app`，它会自动安装依赖并生成默认配置。
- 如果需要逐项选择 TypeScript、ESLint、Biome、Tailwind CSS、`src/`、App Router 或 Cache Components，可以不使用 `--yes`。
- 生产发布前分别执行 `next build` 和 `lint`；Next.js 16 的 `next build` 不会自动运行 lint。
- 如果项目没有安装 Next.js，Next.js MCP 无法提供当前项目版本的本地文档；这时应以官方在线文档为准。
- 页面文件很多时，可以在 VS Code 或 Cursor 中配置自定义编辑器标签，避免多个 `page.tsx` 难以区分。

## 记忆要点

1. 新项目优先使用 `create-next-app`。
2. 目录结构决定 URL。
3. `page.tsx` 表示页面，`layout.tsx` 表示共享布局。
4. `public` 用来存放静态资源。
5. `next dev` 用于开发，`next build` 和 `next start` 用于生产。
6. Next.js 16 中 lint 需要单独运行。
7. 路径别名能减少大型项目中的相对路径混乱。
