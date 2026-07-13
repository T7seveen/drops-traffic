import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ToolIcon } from '@/components/ToolIcon'
import { tools } from '@/lib/data/tools'

export const metadata = { title: 'Инструменты — Drops Traffic' }

export default function ToolsPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: '#F0FDF4', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600, color: '#65A30D', marginBottom: 16 }}>7 инструментов</div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-1px' }}>
            Инструменты платформы
          </h1>
          <p style={{ fontSize: 18, color: '#64748B', maxWidth: 560, margin: '0 auto' }}>
            Все инструменты работают вместе — единый кабинет, общие данные, одна подписка.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {tools.map(tool => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} style={{ textDecoration: 'none' }}>
              <div className="tool-card" style={{
                border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 28,
                transition: 'all 200ms', cursor: 'pointer', height: '100%',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <ToolIcon type={tool.iconType} color={tool.iconColor} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B', background: '#F1F5F9', borderRadius: 20, padding: '3px 10px' }}>
                    {tool.tag.split(' · ')[0]}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>{tool.name}</h3>
                  <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>{tool.tagline}</p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: tool.iconColor }}>
                  Подробнее
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
