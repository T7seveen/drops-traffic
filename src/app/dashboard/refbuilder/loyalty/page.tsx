'use client'
import Link from 'next/link'
import { useLoyalty, useCustomers } from '@/lib/refbuilder/store'

function TierBadge({ name, color }: { name: string; color: string }) {
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: color + '22', color }}>{name}</span>
}

export default function LoyaltyPage() {
  const { programs } = useLoyalty()
  const { customers } = useCustomers()

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>Программы лояльности</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Бонусные карты, кешбэк и уровни для клиентов</p>
        </div>
        <Link href="/dashboard/refbuilder/loyalty/new" style={{ padding: '10px 20px', borderRadius: 10, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          + Создать программу
        </Link>
      </div>

      {/* Global stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Программ', value: String(programs.length) },
          { label: 'Всего клиентов', value: String(customers.length) },
          { label: 'Выдано бонусов', value: `${customers.reduce((s, c) => s + c.total_points_earned, 0).toLocaleString('ru')}` },
          { label: 'Потрачено клиентами', value: `${(customers.reduce((s, c) => s + c.total_spend, 0) / 1000).toFixed(0)}K ₽` },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Program cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {programs.map(lp => {
          const programCustomers = customers.filter(c => c.loyalty_program_id === lp.id)
          const tierCounts = lp.tiers.reduce((acc, t) => ({ ...acc, [t.name]: programCustomers.filter(c => c.tier === t.name).length }), {} as Record<string, number>)

          return (
            <div key={lp.id} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 18, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '22px 28px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <div style={{ fontSize: 24 }}>{lp.type === 'points' ? '🎯' : '💳'}</div>
                      <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: 0 }}>{lp.name}</h2>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#F0FDF4', color: '#15803D' }}>Активна</span>
                    </div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {lp.type === 'points' ? (
                        <>
                          <div><span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Начисление: </span><span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{lp.points_per_100_rub} бонусов/100₽</span></div>
                          <div><span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Курс: </span><span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>100 бонусов = {lp.rub_per_point}₽</span></div>
                        </>
                      ) : (
                        <div><span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Кешбэк: </span><span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{lp.cashback_percent}%</span></div>
                      )}
                      <div><span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Тип: </span><span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{lp.type === 'points' ? 'Бонусные баллы' : 'Кешбэк'}</span></div>
                    </div>
                  </div>
                  <Link href={`/dashboard/refbuilder/loyalty/${lp.id}`} style={{ padding: '9px 20px', borderRadius: 10, border: '1.5px solid #E2E8F0', color: '#0F172A', fontWeight: 600, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    Управление →
                  </Link>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ padding: '18px 28px', borderBottom: '1px solid #F1F5F9', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                {[
                  { label: 'Клиентов', value: String(lp.stats.customers) },
                  { label: 'Выдано бонусов', value: lp.stats.points_issued.toLocaleString('ru') },
                  { label: 'Потрачено бонусов', value: lp.stats.points_redeemed.toLocaleString('ru') },
                  { label: 'Общий оборот', value: `${((lp.stats.total_spend || 0) / 1000).toFixed(0)}K ₽` },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Tiers */}
              <div style={{ padding: '18px 28px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Уровни участников</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {lp.tiers.map(tier => (
                    <div key={tier.name} style={{ background: '#F8FAFC', borderRadius: 12, padding: '12px 18px', border: '1px solid #E2E8F0', minWidth: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ fontSize: 18 }}>{tier.name === 'bronze' ? '🥉' : tier.name === 'silver' ? '🥈' : tier.name === 'gold' ? '🥇' : '💎'}</div>
                        <TierBadge name={{ bronze: 'Бронза', silver: 'Серебро', gold: 'Золото', platinum: 'Платина' }[tier.name] || tier.name} color={tier.color} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{tierCounts[tier.name] || 0} клиентов</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>от {tier.min_spend.toLocaleString('ru')} ₽</div>
                      {lp.type === 'points' && <div style={{ fontSize: 11, color: '#3B82F6', fontWeight: 600, marginTop: 4 }}>×{tier.multiplier} к бонусам</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}

        {programs.length === 0 && (
          <div style={{ background: '#fff', border: '1.5px dashed #E2E8F0', borderRadius: 18, padding: 56, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎁</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>Создайте программу лояльности</h3>
            <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 24px', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
              Бонусные баллы и кешбэк удерживают клиентов и увеличивают повторные покупки
            </p>
            <Link href="/dashboard/refbuilder/loyalty/new" style={{ padding: '11px 24px', borderRadius: 10, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              Создать программу
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
