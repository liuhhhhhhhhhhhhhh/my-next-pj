# Next.js Upgrading

- 官方文档：<https://nextjs.org/docs/app/getting-started/upgrading>
- 文档页面版本：Next.js 16.4.2

## 升级到最新版

Next.js 16.1.0 及之后可以使用：

```bash
pnpm next upgrade
```

旧版本可以使用：

```bash
npx @next/codemod@canary upgrade latest
```

也可以让 coding agent 执行并验证：

```bash
npx next@canary upgrade --agent=latest
```

手动升级需要同时更新：

```bash
pnpm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

## Canary

确认稳定版工作正常后，才考虑：

```bash
pnpm add next@canary
```

Canary 包含尚未进入稳定版的功能，不适合作为默认生产版本。

## 记忆要点

1. 先看对应版本升级指南。
2. 升级后运行构建、lint 和关键页面检查。
3. 稳定版正常后再尝试 Canary。
4. 大版本升级要关注 breaking changes 和 codemod。
