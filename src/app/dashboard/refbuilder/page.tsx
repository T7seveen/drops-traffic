'use client'
import Link from 'next/link'
import { usePrograms, usePartners, useLoyalty, usePayouts } from '@/lib/refbuilder/store'

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: string }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '20px 24px' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 800, color: accent || '#0F172A', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{value}</p>
      <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{sub}</p>
    </div>
  )
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ height: 4, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${Math.min(100, (value / max) * 100)}%`, background: color, borderRadius: 4 }} />
    </div>
  )
}

export default function RefBuilderHome() {
  const { programs } = usePrograms()
  const { partners } = usePartners()
  const { programs: loyaltyPrograms } = useLoyalty()
  const { payouts } = usePayouts()

  const totalClicks = programs.reduce((s, p) => s + p.stats.total_clicks, 0)
  const totalConversions = programs.reduce((s, p) => s + p.stats.total_conversions, 0)
  const totalRevenue = programs.reduce((s, p) => s + p.stats.total_revenue, 0)
  const totalCommission = programs.reduce((s, p) => s + p.stats.total_commission, 0)
  const pendingPayouts = payouts.filter(p => p.status === 'pending' || p.status === 'processing')
  const activePartners = partners.filter(p => p.status === 'active')

  const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}М ₽` : n >= 1000 ? `${(n / 1000).toFixed(0)}K ₽` : `${n} ₽`
  const fmtN = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Реферальный центр</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Сводка по всем программам и лояльности</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/dashboard/refbuilder/programs/new" style={{ padding: '10px 18px', borderRadius: 10, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            + Новая программа
          </Link>
          <Link href="/dashboard/refbuilder/loyalty/new" style={{ padding: '10px 18px', borderRadius: 10, border: '1.5px solid #E2E8F0', color: '#0F172A', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
            + Программа лояльности
          </Link>
        </div>
      </div>

      {/* Global Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="Кликов за всё время" value={fmtN(totalClicks)} sub={`${activePartners.length} активных партнёров`} />
        <StatCard label="Конверсий" value={fmtN(totalConversions)} sub={`CR ${((totalConversions / totalClicks) * 100 || 0).toFixed(1)}%`} accent="#3B82F6" />
        <StatCard label="Выручка от рефералов" value={fmt(totalRevenue)} sub="Общая по всем программам" accent="#0F172A" />
        <StatCard label="Выплачено партнёрам" value={fmt(totalCommission)} sub={`${fmt(programs.reduce((s, p) => s + p.stats.pending_commission, 0))} ожидает`} accent="#65A30D" />
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Programs */}
        <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Реферальные программы</h2>
            <Link href="/dashboard/refbuilder/programs" style={{ fontSize: 12, color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>Все →</Link>
          </div>
          <div>
            {programs.map((prog, i) => (
              <Link key={prog.id} href={`/dashboard/refbuilder/programs/${prog.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '16px 24px', borderBottom: i < programs.length - 1 ? '1px solid #F8FAFC' : 'none',
                  display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'background 150ms',
                }} className="ref-row">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{prog.name}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                        background: prog.status === 'active' ? '#F0FDF4' : prog.status === 'paused' ? '#FFF7ED' : '#F8FAFC',
                        color: prog.status === 'active' ? '#15803D' : prog.status === 'paused' ? '#92400E' : '#64748B',
                      }}>{prog.status === 'active' ? 'Активна' : prog.status === 'paused' ? 'Пауза' : 'Черновик'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <MiniBar value={prog.stats.total_conversions} max={800} color="#A3E635" />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{prog.commission_type === 'percent' ? `${prog.commission_value}%` : `${prog.commission_value} ₽`}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{prog.stats.active_partners} партнёров</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick access & pending */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Pending payouts */}
          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Ожидают выплаты</h2>
              <Link href="/dashboard/refbuilder/payouts" style={{ fontSize: 12, color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>Все →</Link>
            </div>
            {pendingPayouts.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Нет ожидающих выплат</div>
            ) : (
              <div>
                {pendingPayouts.slice(0, 3).map((p, i) => (
                  <div key={p.id} style={{ padding: '12px 24px', borderBottom: i < Math.min(pendingPayouts.length, 3) - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{p.partner_name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{p.status === 'pending' ? 'Ожидает' : 'В обработке'}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{p.amount.toLocaleString('ru')} ₽</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Loyalty summary */}
          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Программы лояльности</h2>
              <Link href="/dashboard/refbuilder/loyalty" style={{ fontSize: 12, color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>Все →</Link>
            </div>
            <div>
              {loyaltyPrograms.map((lp, i) => (
                <Link key={lp.id} href={`/dashboard/refbuilder/loyalty/${lp.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '14px 24px', borderBottom: i < loyaltyPrograms.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} className="ref-row">
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{lp.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{lp.stats.customers} клиентов</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#65A30D' }}>{lp.cashback_percent > 0 ? `${lp.cashback_percent}% кешбэк` : `${lp.points_per_100_rub} бонусов/100₽`}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top partners */}
      <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Топ партнёры</h2>
          <Link href="/dashboard/refbuilder/partners" style={{ fontSize: 12, color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>Все →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Партнёр', 'Программа', 'Клики', 'Конверсии', 'Выручка', 'Комиссия', 'Статус'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activePartners.slice(0, 5).map((partner, i) => {
                const prog = programs.find(p => p.id === partner.program_id)
                return (
                  <tr key={partner.id} style={{ borderBottom: i < 4 ? '1px solid #F8FAFC' : 'none' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: partner.tier === 'vip' ? '#A3E635' : partner.tier === 'top' ? '#DBEAFE' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#0F172A', flexShrink: 0 }}>{partner.name[0]}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{partner.name}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>/{partner.vanity || partner.code}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{prog?.name.split(' ')[0]}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{partner.stats.clicks.toLocaleString('ru')}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{partner.stats.conversions}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{(partner.stats.revenue / 1000).toFixed(0)}K ₽</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#65A30D' }}>{(partner.stats.commission / 1000).toFixed(1)}K ₽</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: partner.tier === 'vip' ? '#F0FDF4' : partner.tier === 'top' ? '#EFF6FF' : '#F8FAFC', color: partner.tier === 'vip' ? '#15803D' : partner.tier === 'top' ? '#2563EB' : '#64748B' }}>
                        {partner.tier === 'vip' ? 'VIP' : partner.tier === 'top' ? 'Топ' : 'Стандарт'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .ref-row:hover { background: #F8FAFC; }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1.5fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
