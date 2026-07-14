'use client'
import { useState } from 'react'
import { usePartners, usePrograms } from '@/lib/refbuilder/store'

const TIERS = { vip: { label: 'VIP', color: '#15803D', bg: '#F0FDF4' }, top: { label: 'Топ', color: '#2563EB', bg: '#EFF6FF' }, standard: { label: 'Стандарт', color: '#64748B', bg: '#F8FAFC' } }
const STATUS = { active: { label: 'Активен', color: '#15803D', bg: '#F0FDF4' }, pending: { label: 'Ожидает', color: '#92400E', bg: '#FFF7ED' }, suspended: { label: 'Отключён', color: '#991B1B', bg: '#FEF2F2' } }

export default function AllPartnersPage() {
  const { partners, updatePartner } = usePartners()
  const { programs } = usePrograms()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterProg, setFilterProg] = useState('all')
  const [copied, setCopied] = useState('')

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://drops-traffic.vercel.app'

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(''), 2000) })
  }

  const filtered = partners.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.email.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    if (filterProg !== 'all' && p.program_id !== filterProg) return false
    return true
  })

  const pending = partners.filter(p => p.status === 'pending')
  const totalEarned = partners.reduce((s, p) => s + p.stats.commission, 0)
  const totalRevenue = partners.reduce((s, p) => s + p.stats.revenue, 0)

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>Все партнёры</h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Управление участниками всех программ</p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Всего партнёров', value: String(partners.length) },
          { label: 'Ожидают одобрения', value: String(pending.length), accent: pending.length > 0 ? '#F59E0B' : undefined },
          { label: 'Общая выручка', value: `${(totalRevenue / 1000).toFixed(0)}K ₽` },
          { label: 'Выплачено', value: `${(totalEarned / 1000).toFixed(0)}K ₽`, accent: '#65A30D' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: `1.5px solid ${s.accent ? '#FDE68A' : '#E2E8F0'}`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.accent || '#0F172A' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Pending approval */}
      {pending.length > 0 && (
        <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#92400E', marginBottom: 10 }}>⏳ {pending.length} партнёр{pending.length > 1 ? 'а' : ''} ожидают одобрения</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {pending.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 10, padding: '8px 14px', border: '1px solid #FED7AA' }}>
                <div style={{ fontSize: 13 }}><strong>{p.name}</strong> · {p.email}</div>
                <button onClick={() => updatePartner(p.id, { status: 'active' })} style={{ padding: '4px 12px', borderRadius: 6, background: '#A3E635', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#0F172A', fontFamily: 'inherit' }}>Одобрить</button>
                <button onClick={() => updatePartner(p.id, { status: 'suspended' })} style={{ padding: '4px 10px', borderRadius: 6, background: '#FEE2E2', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#991B1B', fontFamily: 'inherit' }}>Отклонить</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени или email..." style={{ flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '9px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#0F172A' }}>
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="pending">Ожидают</option>
          <option value="suspended">Отключённые</option>
        </select>
        <select value={filterProg} onChange={e => setFilterProg(e.target.value)} style={{ padding: '9px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#0F172A' }}>
          <option value="all">Все программы</option>
          {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Партнёр', 'Программа', 'Ссылка / промо', 'Клики', 'Конверсии', 'Комиссия', 'Статус', 'Уровень', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const prog = programs.find(pr => pr.id === p.program_id)
                const tier = TIERS[p.tier]
                const status = STATUS[p.status]
                return (
                  <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: p.tier === 'vip' ? '#A3E635' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#0F172A', flexShrink: 0 }}>{p.name[0]}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B' }}>{prog?.name.split(' ')[0] || '—'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <code style={{ fontSize: 11, background: '#F8FAFC', padding: '2px 7px', borderRadius: 5, color: '#64748B' }}>{p.vanity || p.code}</code>
                        <button onClick={() => copy(`${baseUrl}/r/${p.code}`, p.id)} style={{ fontSize: 11, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>{copied === p.id ? '✓' : '📋'}</button>
                      </div>
                      {p.promo_code && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{p.promo_code}</div>}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{p.stats.clicks.toLocaleString('ru')}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#64748B' }}>{p.stats.conversions} <span style={{ color: '#94A3B8', fontSize: 11 }}>({p.stats.conversion_rate.toFixed(1)}%)</span></td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#65A30D' }}>{p.stats.commission.toLocaleString('ru')} ₽</div>
                      {p.stats.pending_commission > 0 && <div style={{ fontSize: 11, color: '#F59E0B' }}>{p.stats.pending_commission.toLocaleString('ru')} ₽ ожидает</div>}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: status.bg, color: status.color }}>{status.label}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: tier.bg, color: tier.color }}>{tier.label}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {p.status === 'pending' && (
                        <button onClick={() => updatePartner(p.id, { status: 'active' })} style={{ fontSize: 11, fontWeight: 700, color: '#15803D', background: '#F0FDF4', border: 'none', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}>Одобрить</button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>Партнёры не найдены</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
