# Next.js CSS

- 官方文档：<https://nextjs.org/docs/app/getting-started/css>
- 文档页面版本：Next.js 16.4.2

## 可选方案

Next.js 支持 Tailwind CSS、CSS Modules、Global CSS、外部样式表、Sass 和 CSS-in-JS。

## 推荐组合

- Tailwind CSS：大部分组件样式。
- CSS Modules：组件专属、需要自定义的样式。
- Global CSS：真正全局的基础样式。

CSS Module 文件使用 `.module.css`：

```tsx
import styles from './blog.module.css'

export default function Page() {
  return <main className={styles.blog} />
}
```

全局 CSS 在根布局导入：

```tsx
import './globals.css'
```

生产构建会合并、压缩并拆分 CSS；CSS 导入顺序会影响最终顺序。应尽量把导入集中到少量入口，并在 `next build` 后检查实际结果。

## 记忆要点

1. 全局 CSS 只放全局规则。
2. 组件样式优先用 CSS Modules 或 Tailwind。
3. 保持 CSS 导入顺序可预测。
4. 开发和生产中的 CSS 顺序可能不同，生产构建必须检查。
