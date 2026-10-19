# Next.js App Router 知识地图

> 这张图把官方文档从“页面目录”改造成“问题与能力之间的关系”。阅读顺序沿着一次请求的生命周期展开：项目如何启动 → 请求如何找到页面 → 页面如何取数 → 数据如何缓存和更新 → 用户如何交互 → 应用如何处理异常并上线。

## 1. 总览：六层知识结构

```text
基础骨架
  ├─ 安装、项目结构、布局与页面
  └─ 文件约定决定路由和运行边界
       ↓
渲染模型
  ├─ Server Components（默认）
  ├─ Client Components（交互、状态、浏览器 API）
  └─ Linking、Prefetch、Streaming、Suspense
       ↓
数据流
  ├─ Server Components 获取数据
  ├─ Route Handlers 提供 HTTP API
  ├─ Server Functions / Actions 修改数据
  └─ loading、error、not-found 反馈状态
       ↓
性能与一致性
  ├─ use cache / cacheLife
  ├─ revalidateTag / updateTag / revalidatePath
  └─ Image、Font、CSS、Metadata 优化交付结果
       ↓
边界与运行环境
  ├─ Proxy 处理请求前置逻辑
  ├─ Node.js、Docker、静态导出
  └─ 环境变量、运行时和部署平台
       ↓
维护能力
  ├─ 升级与 codemod
  ├─ 测试、监控、日志
  └─ 安全、可访问性和工程规范
```

## 2. 现有文档在知识图谱中的位置

| 层级 | 要回答的问题 | 已整理文档 |
|---|---|---|
| 项目与路由 | 文件放在哪里？URL 如何产生？ | `installation`、`project-structure`、`layouts-and-pages` |
| 渲染与导航 | 代码运行在服务器还是浏览器？页面如何切换？ | `server-and-client-components`、`linking-and-navigating` |
| 数据读取与写入 | 数据在哪里获取？表单如何修改数据？ | `fetching-data`、`mutating-data` |
| 缓存与更新 | 哪些结果可以复用？什么时候刷新？ | `caching`、`revalidating` |
| 用户反馈 | 加载、失败、不存在分别如何表达？ | `error-handling` |
| 交付优化 | 样式、图片、字体、SEO 如何处理？ | `css`、`images`、`fonts`、`metadata-and-og-images` |
| 服务端接口 | 如何提供 API？如何拦截或改写请求？ | `route-handlers`、`proxy` |
| 上线与维护 | 如何部署和升级？ | `deploying`、`upgrading` |

## 3. 最重要的关系

### 3.1 页面不是孤立的，它是一条请求链

```text
URL
 → 文件系统路由
 → layout / page
 → Server Component 获取数据
 → cache 或动态请求
 → loading / error / not-found
 → HTML、RSC Payload、客户端交互
```

### 3.2 “读、写、刷新”必须一起理解

- **读**：Server Component、`fetch`、数据库查询。
- **写**：Server Function / Server Action。
- **刷新**：写入后根据业务选择 `updateTag`、`revalidateTag` 或 `revalidatePath`。

只学缓存而不学写入，会不知道数据为什么仍是旧的；只学 Server Action 而不学鉴权，会留下安全问题。

### 3.3 Route Handler、Server Action、Proxy 的边界

| 能力 | 适合做什么 | 不应承担什么 |
|---|---|---|
| Server Component | 页面渲染和服务端读数据 | 浏览器事件处理 |
| Server Action | 表单、创建、更新、删除 | 对外设计通用 REST API |
| Route Handler | Webhook、移动端 API、第三方调用 | 页面布局和客户端导航 |
| Proxy | 重写、重定向、请求头、简单前置判断 | 慢查询、完整会话系统、业务数据获取 |

## 4. 推荐学习路径

1. **先建立骨架**：安装 → 项目结构 → 布局与页面。
2. **理解运行位置**：Server / Client Components → 导航与流式渲染。
3. **完成数据闭环**：获取数据 → 修改数据 → 加载与错误状态。
4. **加入性能策略**：缓存 → 重新验证 → 图片、字体、CSS、Metadata。
5. **补齐后端边界**：Route Handlers → Proxy → 鉴权和请求安全。
6. **掌握上线能力**：环境变量 → 部署 → 监控 → 升级。

每学完一层，都用一个小项目验证：博客列表、文章详情、评论表单、后台管理页，比单独背 API 更容易形成长期记忆。

## 5. 官方目录中还需要补齐的知识

### 高优先级：完成生产级闭环

- [Authentication](./authentication.md)：登录、会话、权限和 Server Action 鉴权。
- [Environment Variables](./environment-variables.md)：服务端变量与 `NEXT_PUBLIC_` 的边界。
- [Testing](./testing.md)：单元测试、组件测试、端到端测试。
- [Instrumentation](./instrumentation.md)：日志、指标、链路追踪。
- **Content Security Policy**：脚本、图片、字体和第三方资源安全。

### 中优先级：深入 App Router

- Dynamic Routes、Route Groups、Parallel Routes、Intercepting Routes。
- Loading UI、Streaming、Suspense 的组合策略。
- Internationalization、SEO 深度实践。
- TypeScript、ESLint、代码组织与 monorepo。
- 第三方库、数据库、ORM 和缓存服务集成。

### 按项目需要补齐

- 国际化、多租户、文件上传、Webhook。
- ISR 与 CDN、边缘运行时、长任务和队列。
- 无障碍、性能预算、Core Web Vitals。
- Docker 镜像优化、CI/CD、预览环境和回滚。

生产发布前可使用 [Production Checklist](./production-checklist.md) 做一次横向检查。

## 6. 知识卡片的统一格式

以后每篇文档都按以下格式整理，才能接入知识图谱：

1. **它解决什么问题**
2. **它属于哪一层**
3. **它依赖哪些概念**
4. **最小可运行例子**
5. **和哪些 API 或文件约定相连**
6. **什么时候使用，什么时候不要使用**
7. **常见错误和排查方式**
8. **一个可以验证理解的小练习**
9. **官方链接和版本**

这样新增文档时，不是再增加一篇孤立笔记，而是把它挂到已有的“请求链”和“能力边界”上。

## 7. 一句话记忆

Next.js 的知识主线不是 API 清单，而是：

> 用文件约定组织路由，用 Server Components 读取数据，用 Server Actions 修改数据，用缓存和重新验证控制新鲜度，用边界文件处理状态，最后根据运行环境部署。

