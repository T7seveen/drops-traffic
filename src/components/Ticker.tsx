const items = [
  { text: 'CAC ниже на 23% за квартал', color: '#A3E635' },
  { text: 'Мониторинг цен на Wildberries и Ozon', color: '#F1F5F9' },
  { text: 'ROAS до 4.2x у топ-партнёров', color: '#60A5FA' },
  { text: '2 800+ активных пользователей', color: '#F1F5F9' },
  { text: 'Новые товары в TrendFinder каждый день', color: '#A3E635' },
  { text: 'Автопостинг в Telegram и ВКонтакте', color: '#F1F5F9' },
]

export function Ticker() {
  const doubled = [...items, ...items]

  return (
    <div style={{
      height: 34, background: '#0F172A', overflow: 'hidden',
      display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
    }}>
      <div className="ticker-track" style={{
        display: 'flex', alignItems: 'center', gap: 40, paddingLeft: 40,
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontSize: 13, fontWeight: 600, color: item.color,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            flexShrink: 0,
          }}>
            {item.text}
            <span style={{ color: '#334155' }}>•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
