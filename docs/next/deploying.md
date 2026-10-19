# Next.js Deploying

- 官方文档：<https://nextjs.org/docs/app/getting-started/deploying>
- 文档页面版本：Next.js 16.4.2

## 部署选项

| 方式 | 能力 |
|---|---|
| Node.js server | 全部 Next.js 功能 |
| Docker | 全部 Next.js 功能 |
| Static export | 功能有限，只适合静态站点 |
| Adapters | 取决于平台适配器 |

## Node.js 部署

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

执行：

```bash
npm run build
npm run start
```

任何支持 Node.js 的平台都可以部署，且支持完整 Next.js 能力。

## Docker

Docker 同样支持完整功能，生产环境适合使用 `output: 'standalone'` 生成包含必要运行时文件的精简镜像。Mac 和 Windows 本地开发通常直接运行 `npm run dev` 更快。

## Static export

静态导出可以放到 S3、Nginx、Apache 等静态服务器，但不支持依赖服务器的功能。它适合纯静态站点或先静态、后逐步增加服务器能力的项目。

## 记忆要点

1. 想要完整功能，选 Node.js 或 Docker。
2. 纯静态站点才使用 Static export。
3. 部署前至少验证 `next build` 和生产启动命令。
4. 平台适配器的能力取决于具体平台。
