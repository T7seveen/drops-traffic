import Link from 'next/link'

const plans = [
  {
    name: 'Старт', price: '990',
    note: 'или бесплатно 14 дней без карты',
    dark: false,
    features: [
      'Unit Calc: базовые расчёты, 1 сценарий',
      'PriceSpy: 30 товаров, раз в сутки',
      'PostMaker: 15 постов/мес',
      'SMM-радар: 1 канал, 7 дней',
      'UTM Hub: 5 000 кликов/мес',
      'TrendFinder: 5 поисков/мес',
    ],
  },
  {
    name: 'Про', price: '2 490',
    note: '1 850 ₽/мес при оплате за год · −26%',
    dark: true, featured: true,
    features: [
      'PriceSpy: 250 товаров, каждые 6 часов',
      'PostMaker: 80 постов, все шаблоны',
      'SMM-радар: 5 каналов, 90 дней',
      'RefBuilder: до 100 партнёров',
      'UTM Hub: 50 000 кликов/мес',
      'Telegram-уведомления везде',
    ],
  },
  {
    name: 'Бизнес', price: '5 990',
    note: '4 490 ₽/мес при оплате за год · −25%',
    dark: false,
    features: [
      'Unit Calc: безлимит + командный доступ',
      'PriceSpy: 1000 товаров, каждый час',
      'RefBuilder: безлимит партнёров',
      'API-доступ, 3 места в команде',
      'UTM Hub: 300 000 кликов/мес',
      'Кастомный домен для рефссылок',
    ],
  },
  {
    name: 'Агентство', price: '13 990',
    note: 'договорная цена от 5 клиентов',
    dark: false,
    features: [
      'Все инструменты — безлимит',
      'До 20 клиентских кабинетов',
      'White-label под клиента',
      'PDF-отчёты под брендом клиента',
      'Выделенный менеджер',
      'SLA 99.9%, онбординг',
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 96px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.8px', margin: '0 0 14px' }}>
          Тарифы для любого масштаба
        </h2>
        <p style={{ fontSize: 17, color: '#64748B', margin: 0 }}>
          От первого теста ниши до агентства с десятками клиентов
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: 20, alignItems: 'stretch',
      }} className="pricing-grid">
        {plans.map((plan, i) => (
          <div key={i} style={{ position: 'relative' }}>
            {plan.featured && (
              <div style={{
                position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                background: '#A3E635', color: '#0F172A',
                fontSize: 12, fontWeight: 700, padding: '6px 14px',
                borderRadius: 999, whiteSpace: 'nowrap', zIndex: 1,
              }}>Популярный</div>
            )}
            <div style={{
              borderRadius: 24, padding: '28px 24px',
              display: 'flex', flexDirection: 'column', height: '100%',
              background: plan.dark ? '#0F172A' : '#F8FAFC',
              border: plan.dark ? 'none' : '1px solid #E2E8F0',
            }}>
              <div style={{
                fontSize: 15, fontWeight: 700, marginBottom: 12,
                color: plan.dark ? '#F1F5F9' : '#0F172A',
              }}>{plan.name}</div>

              <div style={{ marginBottom: 6 }}>
                <sup style={{ fontSize: 18, fontWeight: 700, color: plan.dark ? '#A3E635' : '#0F172A' }}>₽</sup>
                <span style={{
                  fontSize: 42, fontWeight: 800, letterSpacing: '-1px',
                  color: plan.dark ? '#A3E635' : '#0F172A',
                  fontVariantNumeric: 'tabular-nums',
                }}>{plan.price}</span>
                <sub style={{ fontSize: 14, color: plan.dark ? '#94A3B8' : '#64748B' }}>/мес</sub>
              </div>

              <div style={{
                fontSize: 12, color: plan.dark ? '#94A3B8' : '#64748B',
                marginBottom: 20, minHeight: 34,
              }}>{plan.note}</div>

              <div style={{
                height: 1, background: plan.dark ? '#334155' : '#E2E8F0',
                marginBottom: 20,
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, flex: 1, marginBottom: 24 }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: '#A3E635', fontWeight: 700, fontSize: 13, marginTop: 1, flexShrink: 0 }}>✓</span>
                    <span style={{
                      fontSize: 13, lineHeight: 1.5,
                      color: plan.dark ? '#E2E8F0' : '#334155',
                    }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link href="/auth/register" style={{
                textAlign: 'center', fontSize: 14, fontWeight: 700,
                textDecoration: 'none', padding: 12, borderRadius: 12,
                background: plan.dark ? '#A3E635' : '#0F172A',
                color: plan.dark ? '#0F172A' : '#F1F5F9',
                transition: 'background 150ms',
                display: 'block',
              }} className={plan.dark ? 'btn-lime' : 'btn-dark'}>
                Выбрать план
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', fontSize: 13, color: '#64748B', marginTop: 32 }}>
        Оплата через Tinkoff Kassa · СБП · Рассрочка
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .pricing-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 580px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
