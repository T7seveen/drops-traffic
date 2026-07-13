import Link from 'next/link'

const cols = [
  {
    title: 'Продукт',
    links: [
      { label: 'Инструменты', href: '/tools' },
      { label: 'Тарифы', href: '/pricing' },
      { label: 'Партнёрская программа', href: '/partners' },
      { label: 'Обновления', href: '/changelog' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'О нас', href: '/about' },
      { label: 'Блог', href: '/blog' },
      { label: 'Контакты', href: '/contacts' },
      { label: 'Статус сервиса', href: '/status' },
    ],
  },
  {
    title: 'Поддержка',
    links: [
      { label: 'База знаний', href: '/docs' },
      { label: 'Telegram-чат', href: 'https://t.me/dropstraffic' },
      { label: 'API-документация', href: '/docs/api' },
      { label: 'Личный кабинет', href: '/dashboard' },
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
        <div>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, textDecoration: 'none' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: '#A3E635',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: '#0F172A',
            }}>D</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
              Drops <span style={{ color: '#3B82F6' }}>Traffic</span>
            </span>
          </Link>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, maxWidth: 260, margin: '0 0 16px' }}>
            Платформа SaaS-инструментов для e-commerce трафика и дропшиппинга.
          </p>
          <a href="https://t.me/dropstraffic" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
            color: '#2563EB', textDecoration: 'none',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.417 15.181l-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931L23.93 4.327c.321-1.496-.541-2.081-1.527-1.714L1.088 10.392c-1.459.564-1.436 1.371-.247 1.735l5.443 1.698 12.645-7.951c.595-.394 1.136-.176.691.218z"/>
            </svg>
            Telegram
          </a>
        </div>

        {cols.map(col => (
          <div key={col.title}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>
              {col.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {col.links.map(l => (
                l.href.startsWith('http')
                  ? <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 14, color: '#64748B', textDecoration: 'none', transition: 'color 150ms',
                    }} className="footer-link">{l.label}</a>
                  : <Link key={l.label} href={l.href} style={{
                      fontSize: 14, color: '#64748B', textDecoration: 'none', transition: 'color 150ms',
                    }} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 24, fontSize: 13, color: '#94A3B8', flexWrap: 'wrap', gap: 12,
      }}>
        <span>© 2026 Drops Traffic. Все права защищены.</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>Конфиденциальность</Link>
          <Link href="/terms" style={{ color: '#94A3B8', textDecoration: 'none' }}>Условия использования</Link>
        </div>
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
