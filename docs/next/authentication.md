# Next.js Authentication 与 Authorization

- 官方文档：<https://nextjs.org/docs/app/guides/authentication>

## 核心理解

认证回答“你是谁”；会话管理保存登录状态；授权回答“你能做什么”。三者必须一起设计。

## 推荐结构

```text
表单 → Server Action 校验输入 → Auth Library 或数据库验证
    → 创建 HttpOnly Session Cookie → 页面、Action、Route Handler 分别授权检查
```

生产项目优先使用成熟认证库，不要把密码哈希、OAuth、MFA 和会话轮换全部手写。

## 必须记住

- 每个 Server Action 都要自行鉴权和授权，因为它可以被直接请求。
- 敏感会话数据放在服务端或加密 Cookie 中，Cookie 通常设置 `HttpOnly`、`Secure`、`SameSite` 和过期时间。
- Proxy 只能做快速的乐观检查，真正访问数据前仍要在 Data Access Layer 或业务函数中做安全检查。
- 通过 DTO 只把必要字段返回给客户端，避免把密码、Token 或内部字段传出去。

## 和知识图谱的关系

Authentication 连接 `mutating-data`、`route-handlers`、`proxy`、`cookies`、`environment-variables` 和 `deploying`，属于生产级数据安全主线。

