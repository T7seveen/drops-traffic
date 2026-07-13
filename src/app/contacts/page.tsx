import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = { title: 'Контакты — Drops Traffic' }

export default function ContactsPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: '#EFF6FF', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600, color: '#2563EB', marginBottom: 16 }}>Контакты</div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-1px' }}>Свяжитесь с нами</h1>
          <p style={{ fontSize: 18, color: '#64748B', maxWidth: 480, margin: '0 auto' }}>
            Ответим в рабочее время в течение 2 часов. По техническим вопросам — в Telegram быстрее.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }} className="contacts-grid">
          {[
            {
              icon: '💬',
              title: 'Telegram-поддержка',
              desc: 'Быстрые ответы на технические вопросы и помощь с настройкой инструментов.',
              link: 'https://t.me/dropstraffic',
              linkText: 'Написать в Telegram',
              accent: '#2563EB',
            },
            {
              icon: '✉️',
              title: 'Email',
              desc: 'Для бизнес-запросов, партнёрства и вопросов, требующих детального разбора.',
              link: 'mailto:hello@drops-traffic.ru',
              linkText: 'hello@drops-traffic.ru',
              accent: '#65A30D',
            },
            {
              icon: '🤝',
              title: 'Партнёрство',
              desc: 'Интеграции, white-label, совместные проекты и агентские программы.',
              link: '/partners',
              linkText: 'Условия партнёрства',
              accent: '#A3E635',
            },
            {
              icon: '📰',
              title: 'Пресса и СМИ',
              desc: 'Запросы от журналистов, медиакиты, комментарии экспертов.',
              link: 'mailto:pr@drops-traffic.ru',
              linkText: 'pr@drops-traffic.ru',
              accent: '#3B82F6',
            },
          ].map(card => (
            <div key={card.title} style={{ padding: 28, border: '1.5px solid #E2E8F0', borderRadius: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>{card.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 16px', lineHeight: 1.6 }}>{card.desc}</p>
              <a href={card.link.startsWith('/') ? undefined : card.link} style={{ fontSize: 14, fontWeight: 700, color: card.accent, textDecoration: 'none' }}
                {...(!card.link.startsWith('/') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {card.link.startsWith('/') ? <Link href={card.link} style={{ fontSize: 14, fontWeight: 700, color: card.accent, textDecoration: 'none' }}>{card.linkText}</Link> : card.linkText}
              </a>
            </div>
          ))}
        </div>

        <div style={{ background: '#F8FAFC', borderRadius: 20, padding: 40, border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Часы работы поддержки</h2>
          <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 24px' }}>По московскому времени (UTC+3)</p>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Пн–Пт</p>
              <p style={{ fontSize: 16, color: '#475569', margin: 0, fontWeight: 600 }}>10:00 — 20:00</p>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Сб–Вс</p>
              <p style={{ fontSize: 16, color: '#475569', margin: 0, fontWeight: 600 }}>12:00 — 18:00</p>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Критические баги</p>
              <p style={{ fontSize: 16, color: '#475569', margin: 0, fontWeight: 600 }}>24/7</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`@media (max-width: 640px) { .contacts-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
