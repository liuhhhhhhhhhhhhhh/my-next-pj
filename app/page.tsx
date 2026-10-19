import Link from 'next/link'
import { getGroups } from '@/lib/docs'
import { templates } from '@/lib/templates'

export default function Home() {
  const groups = getGroups()
  const total = groups.reduce((sum, group) => sum + group.docs.length, 0)
  return (
    <main>
      <header className="topbar"><Link href="/" className="brand"><span className="brand-mark">N</span><span>Next.js 知识库</span></Link><span className="version">App Router · 知识系统</span></header>
      <section className="hero wrap">
        <div className="eyebrow">FROM REQUEST TO DEPLOYMENT</div>
        <h1>把 Next.js 学成一张<br /><em>可以走通的地图</em></h1>
        <p className="lead">从文件约定开始，经过渲染、数据、缓存和错误边界，最后抵达认证、监控与部署。每篇文章都是一条主线上的一个节点。</p>
        <div className="hero-actions"><a className="button primary" href="#map">开始浏览</a></div>
        <div className="stats"><div><strong>{total}</strong><span>篇系统笔记</span></div><div><strong>{groups.length}</strong><span>个能力层</span></div><div><strong>1</strong><span>条请求主线</span></div></div>
      </section>
      <section id="map" className="wrap map-section"><div className="section-heading"><div><div className="eyebrow">THE KNOWLEDGE MAP</div><h2>沿着应用的生命线阅读</h2></div><p>不要从 API 清单开始。先问：一次请求从哪里来，数据如何流动，结果如何交付。</p></div>
        <div className="groups">{groups.map((group, index) => <section className="group" key={group.name}><div className="group-index">0{index + 1}</div><div className="group-body"><h3>{group.name}</h3><div className="cards">{group.docs.map((doc) => <Link href={`/docs/${doc.slug}`} className="card" key={doc.slug}><span className="card-title">{doc.title}</span><span className="card-desc">{doc.description}</span><span className="arrow">↗</span></Link>)}</div></div></section>)}</div>
      </section>
      <section className="templates-section wrap"><div className="section-heading"><div><div className="eyebrow">OFFICIAL STARTER TEMPLATES</div><h2>把知识点放进真实项目</h2></div><p>Next.js 官方 Examples 入口现在通向 Vercel 模板库。下面按学习目标挑出最值得动手的案例。</p></div><div className="template-grid">{templates.map((template) => <a className="template-card" href={template.href} target="_blank" rel="noreferrer" key={template.name}><div className="template-top"><span className="template-level">{template.level}</span><span className="template-arrow">↗</span></div><h3>{template.chinese}</h3><p>{template.description}</p><div className="template-foot"><span>{template.name}</span><b>{template.focus}</b></div></a>)}</div></section>
      <footer className="footer wrap"><span>Next.js 知识库</span><span>官方文档 · MCP · 实战理解</span></footer>
    </main>
  )
}
