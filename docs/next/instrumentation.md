# Next.js Instrumentation 与 Observability

- 官方文档：<https://nextjs.org/docs/app/guides/instrumentation>
- 客户端文档：<https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client>

## 两个入口

- `instrumentation.ts`：服务端启动时注册监控、日志和 OpenTelemetry。
- `instrumentation-client.ts`：客户端变得可交互前初始化分析、错误跟踪和性能监控。

```ts
// instrumentation.ts
export function register() {
  // 初始化 OpenTelemetry 或监控 SDK
}
```

## 注意事项

- 文件放在项目根目录，或使用 `src` 时放在 `src` 中。
- `register` 会在不同运行环境调用；Node-only 和 Edge-only 代码应按 `NEXT_RUNTIME` 条件导入。
- 客户端初始化代码必须轻量，避免阻塞 hydration。
- 日志、指标和错误追踪应与 `error.tsx`、`global-error.tsx` 和部署环境一起设计。

