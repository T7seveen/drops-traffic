import Link from 'next/link'

const cols = [
  {
    title: 'Продукт',
    links: [
      { label: 'Инструменты', href: '#tools' },
      { label: 'Тарифы', href: '#pricing' },
      { label: 'Реферальная программа', href: '#tools' },
      { label: 'Обновления', href: '/changelog' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'О нас', href: '/about' },
      { label: 'Блог', href: '/blog' },
      { label: 'Контакты', href: '/contacts' },
      { label: 'Партнёрам', href: '/partners' },
    ],
  },
  {
    title: 'Поддержка',
    links: [
      { label: 'База знаний', href: '/docs' },
      { label: 'Telegram-чат', href: 'https://t.me/dropstraffic' },
      { label: 'Статус сервиса', href: '/status' },
      { label: 'API-документация', href: '/docs/api' },
    ],
  },
]

export function Footer() {
  return (
    <footer style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 40px' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
        gap: 32, paddingBottom: 40, borderBottom: '1px solid #E2E8F0',
      }} className="footer-grid">
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: '#A3E635',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: '#0F172A',
            }}>D</div>
            <span style={{ fontWeight: 800, fontSize: 15 }}>
              Drops <span style={{ color: '#3B82F6' }}>Traffic</span>
            </span>
          </div>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, maxWidth: 260, margin: 0 }}>
            Платформа SaaS-инструментов для e-commerce трафика и дропшиппинга.
          </p>
        </div>

        {cols.map(col => (
          <div key={col.title}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>
              {col.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {col.links.map(l => (
                <Link key={l.label} href={l.href} style={{
                  fontSize: 14, color: '#64748B', textDecoration: 'none',
                  transition: 'color 150ms',
                }} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 24, fontSize: 13, color: '#94A3B8', flexWrap: 'wrap', gap: 8,
      }}>
        <span>© 2026 Drops Traffic. Все права защищены.</span>
        <span>Сделано в России</span>
      </div>

      <style>{`
        .footer-link:hover { color: #0F172A !important; }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
