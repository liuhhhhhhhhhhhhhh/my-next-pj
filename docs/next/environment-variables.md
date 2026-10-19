# Next.js Environment Variables

- 官方文档：<https://nextjs.org/docs/app/guides/self-hosting>

## 核心理解

环境变量是部署环境提供给应用的配置。默认只在服务端可用；以 `NEXT_PUBLIC_` 开头的变量会被打包进浏览器代码，因此不能放秘密。

```env
DATABASE_URL=server-only-secret
NEXT_PUBLIC_API_URL=https://example.com
```

## 判断规则

- 数据库密码、签名密钥、第三方私钥：只能服务端读取。
- 公开 API 地址、分析 ID：可以使用 `NEXT_PUBLIC_`，但要确认它本来就允许公开。
- 构建时读取和运行时读取不是一回事；自托管或 Docker 多环境部署时，要确认变量是在 build 阶段还是 request 阶段注入。
- `.env*` 中的秘密不应提交到 Git。

## 和知识图谱的关系

它连接 `authentication`、`deploying`、`proxy`、`route-handlers` 和 `instrumentation`，是运行环境层的基础概念。

