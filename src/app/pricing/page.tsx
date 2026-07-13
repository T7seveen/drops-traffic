import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = { title: 'Тарифы — Drops Traffic' }

const plans = [
  {
    name: 'Старт', price: 0, period: 'бесплатно',
    desc: 'Для знакомства с платформой',
    dark: false, popular: false,
    features: ['Unit Calc: без ограничений', 'PriceSpy: 30 товаров', 'SMM-радар: 1 канал', 'PostMaker: 15 постов/мес', 'TrendFinder: 5 запросов/день', 'UTM Hub: 5 000 кликов/мес', 'RefBuilder: 1 программа, 5 партнёров'],
  },
  {
    name: 'Про', price: 1490, period: 'в месяц',
    desc: 'Для активных предпринимателей',
    dark: false, popular: true,
    features: ['Unit Calc: без ограничений', 'PriceSpy: 250 товаров', 'SMM-радар: 5 каналов', 'PostMaker: 80 постов/мес', 'TrendFinder: без ограничений', 'UTM Hub: 50 000 кликов/мес', 'RefBuilder: 3 программы, 50 партнёров', 'Экспорт в Excel и PDF', 'Telegram-алерты'],
  },
  {
    name: 'Бизнес', price: 3490, period: 'в месяц',
    desc: 'Для команд и агентств',
    dark: true, popular: false,
    features: ['Всё из тарифа Про', 'PriceSpy: 1 000 товаров, обновление каждый час', 'SMM-радар: неограниченно каналов', 'PostMaker: 300 постов/мес', 'UTM Hub: 300 000 кликов/мес', 'RefBuilder: неограниченно программ и партнёров', '3 рабочих места', 'Приоритетная поддержка', 'API доступ'],
  },
  {
    name: 'Агентство', price: 8990, period: 'в месяц',
    desc: 'Для крупных агентств и сетей',
    dark: false, popular: false,
    features: ['Всё из тарифа Бизнес', 'Без каких-либо ограничений', 'Неограниченные рабочие места', 'White-label (ваш домен и брендинг)', 'Выделенный менеджер', 'SLA 99.9%', 'Кастомная интеграция'],
  },
]

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="8" fill="#A3E635" opacity="0.15"/>
      <path d="M5 8l2 2 4-4" stroke="#65A30D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function PricingPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: '#F0FDF4', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600, color: '#65A30D', marginBottom: 16 }}>Тарифы</div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-1px' }}>Простые и прозрачные цены</h1>
          <p style={{ fontSize: 18, color: '#64748B', maxWidth: 520, margin: '0 auto' }}>
            Начните бесплатно. Переходите на платный план, когда понадобятся дополнительные возможности.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="pricing-grid">
          {plans.map(plan => (
            <div key={plan.name} style={{
              border: plan.dark ? 'none' : (plan.popular ? '2px solid #A3E635' : '1.5px solid #E2E8F0'),
              borderRadius: 20, padding: 28,
              background: plan.dark ? '#0F172A' : '#fff',
              position: 'relative',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 11, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  ПОПУЛЯРНЫЙ
                </div>
              )}
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: plan.dark ? 'rgba(255,255,255,0.6)' : '#64748B', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{plan.name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: plan.dark ? (plan.popular ? '#A3E635' : '#fff') : '#0F172A', letterSpacing: '-1px' }}>
                    {plan.price === 0 ? '0 ₽' : `${plan.price.toLocaleString('ru')} ₽`}
                  </span>
                  <span style={{ fontSize: 14, color: plan.dark ? 'rgba(255,255,255,0.5)' : '#94A3B8' }}>/{plan.period}</span>
                </div>
                <p style={{ fontSize: 13, color: plan.dark ? 'rgba(255,255,255,0.5)' : '#94A3B8', margin: '4px 0 0' }}>{plan.desc}</p>
              </div>

              <Link href="/auth/register" style={{
                display: 'block', textAlign: 'center', padding: '11px 20px', borderRadius: 10,
                fontWeight: 700, fontSize: 14, textDecoration: 'none',
                background: plan.dark ? '#A3E635' : (plan.popular ? '#A3E635' : 'transparent'),
                color: plan.dark ? '#0F172A' : (plan.popular ? '#0F172A' : '#0F172A'),
                border: (!plan.dark && !plan.popular) ? '1.5px solid #E2E8F0' : 'none',
                transition: 'opacity 150ms',
              }}>
                {plan.price === 0 ? 'Начать бесплатно' : 'Выбрать план'}
              </Link>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <Check />
                    <span style={{ fontSize: 13, color: plan.dark ? 'rgba(255,255,255,0.8)' : '#475569', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 8px' }}>Нужен индивидуальный план для крупного бизнеса?</p>
          <Link href="/contacts" style={{ fontSize: 15, fontWeight: 700, color: '#3B82F6', textDecoration: 'none' }}>Свяжитесь с нами →</Link>
        </div>
      </main>
      <Footer />
      <style>{`
        @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .pricing-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
