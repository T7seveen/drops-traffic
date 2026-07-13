const features = [
  'Уникальные реферальные ссылки для каждого партнёра',
  'Авто-уведомления в Telegram при конверсии',
  'Управление холдами и выплатами из одного кабинета',
  'Виджет встраивается на любой сайт без разработчика',
]

const channels = [
  { name: 'Telegram', pct: 42 },
  { name: 'ВКонтакте', pct: 28 },
  { name: 'Блогеры', pct: 18 },
  { name: 'Органика', pct: 12 },
]

export function Spotlight() {
  return (
    <section style={{
      maxWidth: 1200, margin: '0 auto', padding: '0 32px 96px',
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 56, alignItems: 'center',
    }} className="spotlight-grid">
      {/* Left */}
      <div>
        <div style={{
          display: 'inline-block', fontSize: 12, fontWeight: 700,
          color: '#3F6212', background: '#ECFCCB',
          padding: '5px 12px', borderRadius: 999, marginBottom: 18,
        }}>Реферальная программа</div>

        <h2 style={{
          fontSize: 'clamp(26px,3vw,40px)', fontWeight: 700,
          letterSpacing: '-0.8px', margin: '0 0 16px',
        }}>
          Пусть партнёры приводят вам продажи
        </h2>

        <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.65, margin: '0 0 24px' }}>
          RefBuilder встраивает виджет на ваш сайт за 5 минут. Каждый партнёр получает
          личную ссылку, а вы видите клики, конверсии и выплаты в одном кабинете.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6, background: '#A3E635',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#0F172A', flexShrink: 0,
              }}>✓</div>
              <span style={{ fontSize: 15, color: '#334155' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{
        background: '#F8FAFC', border: '1px solid #E2E8F0',
        borderRadius: 24, padding: 32,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 20 }}>
          Трафик по каналам
        </div>

        {channels.map((c, i) => (
          <div key={i} style={{ marginBottom: i < channels.length - 1 ? 18 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: '#334155', fontWeight: 600 }}>{c.name}</span>
              <span style={{ color: '#64748B' }}>{c.pct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: '#E2E8F0', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 999,
                background: 'linear-gradient(90deg,#3B82F6,#A3E635)',
                width: `${c.pct}%`,
              }} />
            </div>
          </div>
        ))}

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          marginTop: 24, paddingTop: 24, borderTop: '1px solid #E2E8F0',
        }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>312</div>
            <div style={{ fontSize: 13, color: '#64748B' }}>активных партнёров</div>
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>1.8М ₽</div>
            <div style={{ fontSize: 13, color: '#64748B' }}>выплачено в этом месяце</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .spotlight-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
