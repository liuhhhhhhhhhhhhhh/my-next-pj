export type Template = {
  name: string
  chinese: string
  description: string
  focus: string
  href: string
  level: string
}

export const templates: Template[] = [
  { name: 'Next.js App Router Playground', chinese: 'App Router 功能练习场', description: '集中观察布局、Server Components、Streaming、Suspense 和数据获取。', focus: '理解框架机制', level: '入门必看', href: 'https://vercel.com/templates/next.js/app-directory' },
  { name: 'Nextra: Docs Starter Kit', chinese: '文档站模板', description: 'Markdown 驱动的文档网站，适合对比本知识库的内容组织方式。', focus: '文档与知识库', level: '最匹配', href: 'https://vercel.com/templates/next.js/documentation-starter-kit' },
  { name: 'Portfolio Starter Kit', chinese: '作品集与博客', description: '包含 MDX、SEO、RSS、动态 OG 图片和语法高亮的内容型站点。', focus: '内容与 SEO', level: '实战推荐', href: 'https://vercel.com/templates/next.js/portfolio-starter-kit' },
  { name: 'Blog Starter Kit', chinese: 'Markdown 博客', description: '静态生成博客的基础模板，适合练习路由、Metadata 和内容渲染。', focus: '博客基础', level: '入门推荐', href: 'https://vercel.com/templates/next.js/blog-starter-kit' },
  { name: 'Platforms Starter Kit', chinese: '多租户平台', description: '使用 App Router 和 Redis 构建多租户平台，适合学习动态路由和租户隔离。', focus: '平台架构', level: '进阶', href: 'https://vercel.com/templates/next.js/platforms-starter-kit' },
  { name: 'Next.js Commerce', chinese: '电商应用', description: '面向 Shopify 的高性能电商模板，覆盖商品、图片、缓存和部署。', focus: '完整业务', level: '进阶', href: 'https://vercel.com/templates/next.js/nextjs-commerce' },
  { name: 'Next.js Enterprise Boilerplate', chinese: '企业级基础设施', description: '整合 TypeScript、ESLint、Prettier、Jest、Playwright 和 Storybook。', focus: '工程化', level: '高级', href: 'https://vercel.com/templates/next.js/nextjs-enterprise-boilerplate' },
  { name: 'Next.js SaaS Starter', chinese: 'SaaS 应用', description: '包含认证、Postgres、Stripe、RBAC、Dashboard 和 Server Actions。', focus: '认证与付费', level: '高级', href: 'https://vercel.com/templates/next.js/next-js-saas-starter' },
]
