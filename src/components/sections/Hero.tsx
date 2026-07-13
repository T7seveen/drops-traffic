import Link from 'next/link'

export function Hero() {
  return (
    <section style={{
      maxWidth: 1200, margin: '0 auto', padding: '72px 32px 56px',
      display: 'grid', gridTemplateColumns: '1.05fr 0.95fr',
      gap: 56, alignItems: 'center',
    }} className="hero-grid">

      {/* Left */}
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#ECFCCB', color: '#3F6212',
          fontSize: 13, fontWeight: 700,
          padding: '7px 14px', borderRadius: 999, marginBottom: 24,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#65A30D', flexShrink: 0 }} />
          Платформа для e-commerce трафика
        </div>

        <h1 style={{
          fontSize: 'clamp(36px,5vw,60px)', fontWeight: 800,
          letterSpacing: '-1.5px', lineHeight: 1.06, margin: '0 0 20px',
        }}>
          Считай, находи и<br />
          масштабируй <span style={{ color: '#3B82F6' }}>трафик</span><br />
          без <span style={{ color: '#65A30D' }}>хаоса в Excel</span>
        </h1>

        <p style={{
          fontSize: 17, color: '#64748B', lineHeight: 1.65,
          margin: '0 0 32px', maxWidth: 480,
        }}>
          7 инструментов для дропшиппинга, арбитража трафика и SMM в одной
          подписке: юнит-экономика, мониторинг цен, аналитика каналов и реферальные программы.
        </p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
          <Link href="#pricing" className="btn-lime" style={{
            fontSize: 15, fontWeight: 700, color: '#0F172A',
            textDecoration: 'none', padding: '14px 26px',
            background: '#A3E635', borderRadius: 12, transition: 'background 150ms',
          }}>Начать бесплатно</Link>
          <Link href="#tools" className="btn-outline" style={{
            fontSize: 15, fontWeight: 700, color: '#0F172A',
            textDecoration: 'none', padding: '14px 26px',
            border: '1.5px solid #E2E8F0', borderRadius: 12,
            transition: 'all 150ms', background: 'transparent',
          }}>Смотреть инструменты</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex' }}>
            {['#3B82F6', '#A3E635', '#0F172A', '#64748B'].map((bg, i) => (
              <div key={i} style={{
                width: 32, height: 32, borderRadius: '50%',
                background: bg, border: '2px solid #fff',
                marginRight: i < 3 ? -10 : 0,
              }} />
            ))}
          </div>
          <div style={{ fontSize: 14, color: '#64748B' }}>
            <b style={{ color: '#0F172A' }}>2 800+</b> продавцов уже считают трафик с нами
          </div>
        </div>
      </div>

      {/* Right — dashboard mockup */}
      <div style={{ position: 'relative' }} className="hero-dash">
        <div style={{
          background: '#0F172A', borderRadius: 24, padding: 16,
          boxShadow: '0 24px 64px rgba(15,23,42,0.25)',
        }}>
          {/* Browser dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 4px 14px' }}>
            {['#EF4444', '#F59E0B', '#22C55E'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            {[
              { label: 'CAC', value: '312 ₽', color: '#F1F5F9' },
              { label: 'ROAS', value: '3.8x', color: '#A3E635' },
              { label: 'LTV', value: '4 120 ₽', color: '#F1F5F9' },
              { label: 'Маржа', value: '41%', color: '#60A5FA' },
            ].map(s => (
              <div key={s.label} style={{ background: '#1E293B', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{ background: '#1E293B', borderRadius: 14, padding: 16, marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 10 }}>Продажи по неделям</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 64 }}>
              {[
                { h: '40%', g: 'linear-gradient(180deg,#3B82F6,#1E40AF)' },
                { h: '55%', g: 'linear-gradient(180deg,#3B82F6,#1E40AF)' },
                { h: '45%', g: 'linear-gradient(180deg,#3B82F6,#1E40AF)' },
                { h: '80%', g: 'linear-gradient(180deg,#A3E635,#65A30D)' },
                { h: '95%', g: 'linear-gradient(180deg,#A3E635,#65A30D)' },
                { h: '70%', g: 'linear-gradient(180deg,#A3E635,#65A30D)' },
              ].map((b, i) => (
                <div key={i} style={{ flex: 1, height: b.h, background: b.g, borderRadius: '4px 4px 0 0' }} />
              ))}
            </div>
          </div>

          {/* Mini icons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: '#1E293B', borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 44 }}>
              {[6, 12, 9].map((h, i) => (
                <div key={i} style={{ width: 4, height: h, background: '#3B82F6', borderRadius: 2 }} />
              ))}
            </div>
            <div style={{ flex: 1, background: '#1E293B', borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 44 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #A3E635' }} />
            </div>
            <div style={{ flex: 1, background: '#1E293B', borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 44 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: 2, background: '#60A5FA' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Floating badge */}
        <div style={{
          position: 'absolute', top: -16, right: -16,
          background: '#A3E635', color: '#0F172A',
          fontWeight: 700, fontSize: 13,
          padding: '10px 16px', borderRadius: 14,
          boxShadow: '0 8px 24px rgba(163,230,53,0.4)',
          display: 'flex', alignItems: 'center', gap: 8,
          whiteSpace: 'nowrap',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: 12 }}>
            {[5, 9, 12].map((h, i) => (
              <span key={i} style={{ width: 3, height: h, background: '#0F172A', borderRadius: 1, display: 'block' }} />
            ))}
          </span>
          +47% продаж за месяц
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-dash { display: none !important; }
        }
      `}</style>
    </section>
  )
}
