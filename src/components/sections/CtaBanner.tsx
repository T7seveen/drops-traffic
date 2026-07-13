import Link from 'next/link'

export function CtaBanner() {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto 96px', padding: '0 32px' }}>
      <div style={{
        borderRadius: 28, padding: '64px 56px',
        background: 'linear-gradient(135deg,#A3E635,#6EE7B7,#3B82F6)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 32, flexWrap: 'wrap',
      }}>
        <h2 style={{
          fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800,
          letterSpacing: '-0.8px', color: '#0F172A', margin: 0, maxWidth: 520,
        }}>
          Начните считать трафик как профессионал — уже сегодня
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/auth/register" style={{
            fontSize: 15, fontWeight: 700, color: '#F1F5F9',
            textDecoration: 'none', padding: '14px 26px',
            background: '#0F172A', borderRadius: 12, transition: 'background 150ms',
          }} className="btn-dark">Начать бесплатно</Link>
          <Link href="#tools" style={{
            fontSize: 15, fontWeight: 700, color: '#0F172A',
            textDecoration: 'none', padding: '14px 26px',
            background: 'rgba(255,255,255,0.5)', borderRadius: 12,
            transition: 'background 150ms', backdropFilter: 'blur(8px)',
          }}>Смотреть инструменты</Link>
        </div>
      </div>
    </section>
  )
}
