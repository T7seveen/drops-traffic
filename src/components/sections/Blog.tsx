import { ToolIcon } from '@/components/ToolIcon'
import Link from 'next/link'

const posts = [
  {
    iconType: 'bars' as const, iconColor: '#65A30D', bg: '#ECFCCB',
    category: 'Юнит-экономика',
    title: 'Как считать ROAS, если у вас 40 SKU и три поставщика',
    meta: '12 июля · 6 мин', slug: 'roas-40-sku',
  },
  {
    iconType: 'target' as const, iconColor: '#2563EB', bg: '#DBEAFE',
    category: 'Мониторинг цен',
    title: 'Конкурент снизил цену на 15% — что делать в первые 24 часа',
    meta: '8 июля · 4 мин', slug: 'competitor-price-drop',
  },
  {
    iconType: 'radar' as const, iconColor: '#B45309', bg: '#FEF3C7',
    category: 'SMM',
    title: 'Почему алгоритмы ошибаются в лучшем времени для постинга (и как это исправить)',
    meta: '3 июля · 7 мин', slug: 'smm-algorithm-posting-time',
  },
]

export function Blog() {
  return (
    <section id="blog" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 96px' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline',
        justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16,
      }}>
        <h2 style={{ fontSize: 'clamp(26px,3vw,40px)', fontWeight: 700, letterSpacing: '-0.8px', margin: 0 }}>
          Из блога
        </h2>
        <Link href="/blog" style={{ fontSize: 14, fontWeight: 600, color: '#3B82F6', textDecoration: 'none' }}>
          Все статьи →
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="blog-grid">
        {posts.map((post, i) => (
          <Link key={i} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="blog-card" style={{
              border: '1px solid #E2E8F0', borderRadius: 20, overflow: 'hidden',
              transition: 'all 200ms ease', cursor: 'pointer',
            }}>
              <div style={{
                height: 160, background: post.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ToolIcon type={post.iconType} color={post.iconColor} size="large" />
              </div>
              <div style={{ padding: 22 }}>
                <div style={{
                  display: 'inline-block', fontSize: 11, fontWeight: 700,
                  color: '#3B82F6', background: '#DBEAFE',
                  padding: '4px 10px', borderRadius: 999, marginBottom: 12,
                }}>{post.category}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4, margin: '0 0 10px' }}>
                  {post.title}
                </h3>
                <div style={{ fontSize: 13, color: '#64748B' }}>{post.meta}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .blog-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 580px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
