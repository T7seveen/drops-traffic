'use client'
import Link from 'next/link'
import { usePrograms } from '@/lib/refbuilder/store'

export default function ProgramsPage() {
  const { programs, updateProgram } = usePrograms()

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>Реферальные программы</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Управляйте программами и отслеживайте результаты</p>
        </div>
        <Link href="/dashboard/refbuilder/programs/new" style={{ padding: '10px 20px', borderRadius: 10, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          + Создать программу
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {programs.map(prog => (
          <div key={prog.id} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>{prog.name}</h2>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                    background: prog.status === 'active' ? '#F0FDF4' : prog.status === 'paused' ? '#FFF7ED' : '#F8FAFC',
                    color: prog.status === 'active' ? '#15803D' : prog.status === 'paused' ? '#92400E' : '#64748B',
                  }}>{prog.status === 'active' ? 'Активна' : prog.status === 'paused' ? 'Пауза' : 'Черновик'}</span>
                </div>
                <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 12px' }}>{prog.description}</p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Комиссия', value: prog.commission_type === 'percent' ? `${prog.commission_value}%` : `${prog.commission_value} ₽` },
                    { label: 'Холд', value: `${prog.hold_days} дней` },
                    { label: 'Cookie', value: `${prog.cookie_days} дней` },
                    { label: 'Партнёры', value: prog.max_partners ? `до ${prog.max_partners}` : 'без лимита' },
                  ].map(m => (
                    <div key={m.label}>
                      <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{m.label}: </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 24, flexShrink: 0, flexWrap: 'wrap' }}>
                {[
                  { label: 'Клики', value: prog.stats.total_clicks.toLocaleString('ru') },
                  { label: 'Конверсии', value: `${prog.stats.total_conversions} (${prog.stats.conversion_rate}%)` },
                  { label: 'Выручка', value: `${(prog.stats.total_revenue / 1000).toFixed(0)}K ₽` },
                  { label: 'Партнёров', value: String(prog.stats.active_partners) },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions bar */}
            <div style={{ padding: '12px 24px', borderTop: '1px solid #F8FAFC', background: '#FAFAFA', display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link href={`/dashboard/refbuilder/programs/${prog.id}`} style={{ fontSize: 13, fontWeight: 600, color: '#3B82F6', textDecoration: 'none' }}>Подробнее</Link>
              <Link href={`/dashboard/refbuilder/programs/${prog.id}#partners`} style={{ fontSize: 13, fontWeight: 600, color: '#64748B', textDecoration: 'none' }}>Партнёры ({prog.stats.active_partners})</Link>
              <span style={{ flex: 1 }} />
              {prog.status === 'active' ? (
                <button onClick={() => updateProgram(prog.id, { status: 'paused' })} style={{ fontSize: 12, color: '#92400E', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Приостановить</button>
              ) : (
                <button onClick={() => updateProgram(prog.id, { status: 'active' })} style={{ fontSize: 12, color: '#15803D', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Активировать</button>
              )}
              <div style={{ width: 1, height: 14, background: '#E2E8F0' }} />
              <a href={`/r/invite/${prog.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none', fontWeight: 600 }}>Ссылка для партнёров ↗</a>
            </div>
          </div>
        ))}

        {programs.length === 0 && (
          <div style={{ background: '#fff', border: '1.5px dashed #E2E8F0', borderRadius: 16, padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔗</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>Создайте первую программу</h3>
            <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 20px' }}>Запустите реферальную программу за 5 минут</p>
            <Link href="/dashboard/refbuilder/programs/new" style={{ padding: '10px 20px', borderRadius: 10, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Создать программу</Link>
          </div>
        )}
      </div>
    </div>
  )
}
