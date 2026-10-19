# Vercel Shop 源码学习路线

## 项目位置

源码已经下载到：

`C:\Users\76388\Documents\ChatGPT\Next\vercel-shop-source`

这是 Vercel Shop 当前主分支源码。仓库根目录本身就是 Next.js 应用，和旧版本中 `apps/template` 的目录结构不同。

项目 README：<https://github.com/vercel/shop>

## 已完成的本地准备

在 `vercel-shop-source` 目录中执行过：

```powershell
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
```

`typecheck` 和 `lint` 均通过。

项目使用 Node.js 24、Next.js 16、React 19 和 pnpm 12。当前电脑的 Node.js 版本满足要求；系统中的 pnpm 版本较旧，但安装过程使用了项目锁文件指定的 pnpm 运行时并成功完成。

## 运行条件

复制 `.env.example` 为 `.env.local`，然后填入 Shopify 的三个必需变量：

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
NEXT_PUBLIC_SHOPIFY_SHOP_ID=123456789
```

没有 Shopify 凭据时可以完整阅读和检查源码，但不能启动一个可读取真实商品和购物车数据的本地店铺。不要把真实 token 写入 Git 或学习笔记。

## 使用 mock.shop 学习

如果暂时不创建 Shopify 店铺，可以使用 Shopify 官方的 `mock.shop` 公共测试数据。当前项目已经验证可以使用下面的本地配置：

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN="mock.shop"
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN="public"
NEXT_PUBLIC_SHOPIFY_SHOP_ID="0"
```

`mock.shop` 提供虚拟商品、集合和购物车数据，不代表真实店铺，也不能用于真实交易。项目当前默认关闭 Shopify analytics 和 customer auth，因此 `shop_id=0` 只用于满足配置校验；启用这些能力或切换真实店铺时，必须改成真实的 Shopify shop ID。

官方说明：<https://shopify.dev/docs/storefronts/headless/mock-shop>

## 第一条阅读链

先只追踪这条业务流程：

```text
首页
  -> 商品列表
  -> 商品详情
  -> 加入购物车
  -> 查看购物车
```

每一步都记录五个问题：

1. URL 对应哪个 `app/**/page.tsx`？
2. 页面默认运行在服务器还是浏览器？
3. 数据从哪个 `lib/**` 函数取得？
4. Shopify API 和 Next.js 分别负责什么？
5. 哪个组件需要交互，为什么需要 `use client`？

## 推荐阅读顺序

### 1. 路由和布局

先读：

- `app/layout.tsx`
- `app/page.tsx`
- `app/products/[handle]`
- `app/collections`

对应文档：

- <https://nextjs.org/docs/app/getting-started/layouts-and-pages>
- <https://nextjs.org/docs/app/getting-started/linking-and-navigating>

### 2. 服务端取数

再读：

- `lib/shopify`
- `lib/product`
- `lib/collections`
- `lib/search`

对应文档：

- <https://nextjs.org/docs/app/getting-started/server-and-client-components>
- <https://nextjs.org/docs/app/getting-started/fetching-data>

### 3. 购物车和交互

再读：

- `app/cart`
- `lib/cart`
- 带有 `use client` 的购物车组件

对应文档：

- <https://nextjs.org/docs/app/getting-started/mutating-data>
- <https://nextjs.org/docs/app/getting-started/server-and-client-components>

### 4. 缓存、加载和 SEO

最后读：

- `next.config.ts`
- `loading.tsx`
- `app/sitemap`
- `app/sitemap.xml`
- `app/robots.ts`
- `generateMetadata` 和结构化数据相关代码

对应文档：

- <https://nextjs.org/docs/app/getting-started/partial-prerendering>
- <https://nextjs.org/docs/app/getting-started/revalidating>
- <https://nextjs.org/docs/app/getting-started/metadata-and-og-images>

## 第一个练习

不接 Shopify 业务逻辑，先完成一次静态追踪：

1. 打开 `app/products/[handle]`，找出页面组件的默认导出。
2. 找到它调用的第一个商品数据函数。
3. 继续追到 Shopify GraphQL 请求的位置。
4. 标出服务端组件和客户端组件的边界。
5. 用一句话解释：为什么商品数据读取适合放在服务器，加入购物车按钮需要客户端交互。

完成这条链以后，再开始改代码。第一处改动建议是给商品详情页增加一个只读的“数据来源”说明，用来验证你已经能定位路由、组件和数据函数之间的关系。
