import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDoc, getDocs } from '@/lib/docs'

const navLabels: Record<string, string> = {
  installation: '安装 Installation',
  'project-structure': '项目结构 Project Structure',
  'layouts-and-pages': '布局与页面 Layouts and Pages',
  'server-and-client-components': '服务端与客户端组件 Server and Client Components',
  'linking-and-navigating': '链接与导航 Linking and Navigating',
  'fetching-data': '获取数据 Fetching Data',
  'mutating-data': '修改数据 Mutating Data',
  caching: '缓存 Caching',
  revalidating: '重新验证 Revalidating',
  'error-handling': '错误处理 Error Handling',
  css: '样式 CSS',
  images: '图片 Images',
  fonts: '字体 Fonts',
  'metadata-and-og-images': 'Metadata 与 OG 图片 Metadata and OG Images',
  'route-handlers': '路由处理器 Route Handlers',
  proxy: '请求代理 Proxy',
  authentication: '认证与授权 Authentication',
  'environment-variables': '环境变量 Environment Variables',
  testing: '测试 Testing',
  instrumentation: '可观测性 Instrumentation',
  'production-checklist': '生产检查清单 Production Checklist',
  deploying: '部署 Deploying',
  upgrading: '升级 Upgrading',
}

export function generateStaticParams() { return getDocs().map((doc) => ({ slug: doc.slug })) }

function renderInline(text: string) {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^\)]+\))/g)
  return tokens.map((token, index) => {
    if (token.startsWith('`') && token.endsWith('`')) return <code className="inline-code" key={index}>{token.slice(1, -1)}</code>
    if (token.startsWith('**') && token.endsWith('**')) return <strong key={index}>{token.slice(2, -2)}</strong>
    const link = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/)
    if (link) return <a href={link[2]} key={index}>{link[1]}</a>
    return <span key={index}>{token}</span>
  })
}

function renderMarkdown(content: string) {
  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []
  let codeLines: string[] = []
  let codeLanguage = ''
  let inCode = false

  const flushCode = (key: string) => {
    blocks.push(<div className="code-wrap" key={key}><div className="code-head"><span>{codeLanguage || 'code'}</span><span className="code-dot" /></div><pre className="code-block"><code>{codeLines.join('\n')}</code></pre></div>)
    codeLines = []
    codeLanguage = ''
  }

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (inCode) flushCode(`code-${index}`)
      else codeLanguage = line.slice(3).trim() || 'code'
      inCode = !inCode
      return
    }
    if (inCode) {
      codeLines.push(line)
      return
    }
    if (!line.trim()) {
      blocks.push(<div className="md-space" key={`space-${index}`} />)
    } else if (line.startsWith('# ')) {
      blocks.push(<h1 key={index}>{renderInline(line.slice(2))}</h1>)
    } else if (line.startsWith('## ')) {
      blocks.push(<h2 key={index}>{renderInline(line.slice(3))}</h2>)
    } else if (line.startsWith('### ')) {
      blocks.push(<h3 key={index}>{renderInline(line.slice(4))}</h3>)
    } else if (line.startsWith('- ')) {
      blocks.push(<li key={index}>{renderInline(line.slice(2))}</li>)
    } else if (line.startsWith('|')) {
      blocks.push(<div className="table-line" key={index}>{renderInline(line)}</div>)
    } else {
      blocks.push(<p key={index}>{renderInline(line)}</p>)
    }
  })
  if (inCode) flushCode('code-final')
  return blocks
}

function getArticleBody(content: string) {
  const firstSection = content.split('\n').findIndex((line, index) => index > 0 && line.startsWith('## '))
  return firstSection > -1 ? content.split('\n').slice(firstSection).join('\n') : content
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = getDoc(slug)
  if (!doc) notFound()
  const docs = getDocs()
  const current = docs.findIndex((item) => item.slug === slug)
  const previous = docs[current - 1]
  const next = docs[current + 1]
  return <main><header className="topbar"><Link href="/" className="brand"><span className="brand-mark">N</span><span>Next.js 知识库</span></Link><Link href="/" className="back">← 返回首页</Link></header><div className="doc-layout wrap"><aside className="toc"><div className="toc-list">{docs.map((item) => <Link className={item.slug === slug ? 'active' : ''} href={`/docs/${item.slug}`} key={item.slug}>{navLabels[item.slug] ?? item.title}</Link>)}</div></aside><article className="article"><div className="eyebrow">{doc.category}</div><h1>{doc.title}</h1><p className="article-intro">{doc.description}</p><div className="article-meta">{doc.officialUrl && <a href={doc.officialUrl} target="_blank">阅读官方文档 ↗</a>}<span>Next.js App Router</span></div><div className="markdown">{renderMarkdown(getArticleBody(doc.content))}</div><nav className="pager">{previous ? <Link href={`/docs/${previous.slug}`}><small>上一篇</small><strong>← {previous.title}</strong></Link> : <span />}{next ? <Link href={`/docs/${next.slug}`}><small>下一篇</small><strong>{next.title} →</strong></Link> : <span />}</nav></article></div></main>
}
