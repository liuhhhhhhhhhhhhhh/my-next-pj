import fs from 'node:fs'
import path from 'node:path'

export type Doc = {
  slug: string
  title: string
  description: string
  category: string
  officialUrl?: string
  content: string
}

const docsDir = path.join(process.cwd(), 'docs', 'next')

const groups: Record<string, string[]> = {
  基础骨架: ['installation', 'project-structure', 'layouts-and-pages'],
  渲染与数据: ['server-and-client-components', 'linking-and-navigating', 'fetching-data', 'mutating-data'],
  性能与状态: ['caching', 'revalidating', 'error-handling'],
  交付与服务端: ['css', 'images', 'fonts', 'metadata-and-og-images', 'route-handlers', 'proxy'],
  生产工程: ['authentication', 'environment-variables', 'testing', 'instrumentation', 'production-checklist', 'deploying', 'upgrading'],
}

function parse(file: string): Doc {
  const content = fs.readFileSync(path.join(docsDir, file + '.md'), 'utf8')
  const heading = content.match(/^#\s+(.+)$/m)?.[1] ?? file
  const officialUrl = content.match(/官方文档：<?([^>\n]+)>?/m)?.[1]
  const firstText = content.split('\n').find((line) => line.trim() && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('```'))?.trim() ?? '从官方文档中提炼的 Next.js 实战知识。'
  const category = Object.entries(groups).find(([, slugs]) => slugs.includes(file))?.[0] ?? '其他'
  return { slug: file, title: heading.replace(/\s+总结$/, ''), description: firstText, category, officialUrl, content }
}

export function getDocs() {
  return Object.values(groups).flat().filter((slug) => fs.existsSync(path.join(docsDir, slug + '.md'))).map(parse)
}

export function getDoc(slug: string) {
  return getDocs().find((doc) => doc.slug === slug)
}

export function getGroups() {
  return Object.entries(groups).map(([name, slugs]) => ({ name, docs: slugs.map(getDoc).filter(Boolean) as Doc[] }))
}
