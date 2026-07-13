const stats = [
  { value: '2 800+', label: 'активных пользователей' },
  { value: '47%', label: 'средний рост продаж' },
  { value: '1.8М ₽', label: 'выплачено партнёрам в месяц' },
  { value: '7', label: 'инструментов в подписке' },
]

const checks = [
  'Все инструменты в одном кабинете, без переключения между сервисами',
  'Обновление данных по ценам конкурентов каждые 6 часов',
  'ИИ-рекомендации по контенту и времени публикаций',
  'Telegram-уведомления обо всех важных событиях',
  'Экспорт отчётов в PDF и Google Sheets',
  'Поддержка на русском языке с ответом до 8 часов',
]

export function Stats() {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 88px' }}>
      {/* Stats bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        border: '1px solid #E2E8F0', borderRadius: 24, overflow: 'hidden',
      }} className="stats-bar">
        {stats.map((s, i) => (
          <div key={i} style={{
            padding: '36px 28px',
            borderRight: i < stats.length - 1 ? '1px solid #E2E8F0' : 'none',
          }}>
            <div style={{
              fontSize: 'clamp(32px,4vw,56px)', fontWeight: 800,
              letterSpacing: '-1.5px',
              background: 'linear-gradient(90deg,#65A30D,#3B82F6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontVariantNumeric: 'tabular-nums',
            }}>{s.value}</div>
            <div style={{ fontSize: 14, color: '#64748B', marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Feature checks */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2,1fr)',
        gap: '16px 40px', marginTop: 48,
      }} className="checks-grid">
        {checks.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ color: '#65A30D', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 15, color: '#334155', lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-bar { grid-template-columns: repeat(2,1fr) !important; }
          .stats-bar > div:nth-child(2) { border-right: none !important; }
          .stats-bar > div:nth-child(1),
          .stats-bar > div:nth-child(2) { border-bottom: 1px solid #E2E8F0; }
          .checks-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-bar { grid-template-columns: 1fr !important; }
          .stats-bar > div { border-right: none !important; border-bottom: 1px solid #E2E8F0; }
          .stats-bar > div:last-child { border-bottom: none !important; }
        }
      `}</style>
    </section>
  )
}
