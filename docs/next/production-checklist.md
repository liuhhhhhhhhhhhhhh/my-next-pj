# Next.js 生产检查清单

- 官方文档：<https://nextjs.org/docs/app/guides/production-checklist>

## 发布前检查

- 使用 `next/image`、`next/font` 和 `next/script` 优化媒体、字体和第三方脚本。
- 检查 `.env*` 是否被 Git 忽略，只有明确公开的变量才使用 `NEXT_PUBLIC_`。
- 为 Server Actions、Route Handlers 和数据库访问做授权检查。
- 验证缓存、重新验证和用户写入后的可见结果。
- 检查错误边界、404 页面、加载状态和无障碍标签。
- 执行生产构建并观察包大小、Core Web Vitals、日志和错误率。
- 为 Docker、CDN、数据库和第三方服务准备健康检查、回滚和密钥轮换方案。

## 一句话理解

生产优化不是单独压缩资源，而是同时检查安全、性能、可观测性、错误恢复和部署回滚。

