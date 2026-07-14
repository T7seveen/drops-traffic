'use client'
import { use, useState } from 'react'
import { useLoyalty, useCustomers } from '@/lib/refbuilder/store'
import type { LoyaltyTier, LoyaltyCustomer } from '@/lib/refbuilder/types'

const TIER_ICONS: Record<string, string> = { 'Базовый': '🎫', 'Серебро': '🥈', 'Золото': '🥇', 'Платина': '💎' }

function TierBar({ tiers, customers }: { tiers: LoyaltyTier[]; customers: LoyaltyCustomer[] }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {tiers.map(t => {
        const count = customers.filter(c => c.tier === t.name).length
        const pct = customers.length ? (count / customers.length) * 100 : 0
        return (
          <div key={t.name} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: 8, background: t.color, borderRadius: 4, marginBottom: 6, opacity: 0.8 }} />
            <div style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{count}</div>
            <div style={{ fontSize: 10, color: '#94A3B8' }}>{t.name}</div>
            <div style={{ fontSize: 10, color: '#CBD5E1' }}>{pct.toFixed(0)}%</div>
          </div>
        )
      })}
    </div>
  )
}

export default function LoyaltyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { programs } = useLoyalty()
  const { customers, addPoints, redeemPoints, addCustomer } = useCustomers(id)
  const [tab, setTab] = useState<'customers' | 'lookup' | 'stats'>('customers')
  const [lookupCode, setLookupCode] = useState('')
  const [lookupResult, setLookupResult] = useState<LoyaltyCustomer | null | 'not_found'>(null)
  const [addPointsAmount, setAddPointsAmount] = useState(0)
  const [redeemAmount, setRedeemAmount] = useState(0)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [addMsg, setAddMsg] = useState('')

  const lp = programs.find(p => p.id === id)

  function doLookup() {
    const found = customers.find(c => c.card_number === lookupCode || c.phone === lookupCode || c.email === lookupCode)
    setLookupResult(found || 'not_found')
    if (found) { setAddPointsAmount(0); setRedeemAmount(0) }
  }

  function doAddPoints() {
    if (lookupResult && lookupResult !== 'not_found') {
      addPoints(lookupResult.id, addPointsAmount)
      setLookupResult({ ...lookupResult, points: lookupResult.points + addPointsAmount, total_points_earned: (lookupResult.total_points_earned || 0) + addPointsAmount })
      setAddPointsAmount(0)
    }
  }

  function doRedeem() {
    if (lookupResult && lookupResult !== 'not_found' && lookupResult.points >= redeemAmount) {
      redeemPoints(lookupResult.id, redeemAmount)
      setLookupResult({ ...lookupResult, points: lookupResult.points - redeemAmount, total_points_redeemed: (lookupResult.total_points_redeemed || 0) + redeemAmount })
      setRedeemAmount(0)
    }
  }

  function doAddCustomer() {
    if (!newName.trim()) return
    addCustomer({ program_id: id, name: newName.trim(), email: newEmail || undefined, phone: newPhone })
    setNewName(''); setNewEmail(''); setNewPhone('')
    setAddMsg('Клиент добавлен!')
    setTimeout(() => setAddMsg(''), 3000)
  }

  if (!lp) return <div style={{ padding: 40, color: '#94A3B8' }}>Программа не найдена</div>

  const isPoints = lp.type === 'points'

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 32 }}>{isPoints ? '🎯' : '💳'}</div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>{lp.name}</h1>
            <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
              {isPoints ? `${lp.points_per_100_rub} баллов за 100₽ · 100 баллов = ${lp.rub_per_point}₽` : `Кешбэк ${lp.cashback_percent}%`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Клиентов', value: String(lp.stats.customers) },
          { label: 'Выдано бонусов', value: lp.stats.points_issued.toLocaleString('ru') },
          { label: 'Потрачено бонусов', value: lp.stats.points_redeemed.toLocaleString('ru') },
          { label: 'Оборот', value: `${((lp.stats.total_spend || 0) / 1000).toFixed(0)}K ₽` },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#F8FAFC', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {[
          { key: 'customers', label: `Клиенты (${customers.length})` },
          { key: 'lookup', label: 'Поиск / Начисление' },
          { key: 'stats', label: 'Уровни' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as 'customers' | 'lookup' | 'stats')} style={{ padding: '8px 16px', borderRadius: 7, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: tab === t.key ? '#fff' : 'transparent', color: tab === t.key ? '#0F172A' : '#94A3B8', boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 150ms' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Customers tab */}
      {tab === 'customers' && (
        <div>
          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Добавить нового клиента</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 6 }}>Имя *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Иван Иванов" style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 6 }}>Email</label>
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="ivan@example.com" style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 6 }}>Телефон</label>
                <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+7 900 000-00-00" style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button onClick={doAddCustomer} disabled={!newName.trim()} style={{ padding: '9px 18px', borderRadius: 9, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 13, border: 'none', cursor: newName.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: newName.trim() ? 1 : 0.5 }}>Добавить</button>
            </div>
            {addMsg && <div style={{ marginTop: 10, fontSize: 13, color: '#15803D', fontWeight: 600 }}>✓ {addMsg}</div>}
          </div>

          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Клиент', 'Карта', 'Уровень', 'Баллы', 'Потрачено бонусов', 'Оборот', 'Дата вступления'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => {
                    const tierObj = lp.tiers.find(t => t.name === c.tier)
                    return (
                      <tr key={c.id} style={{ borderBottom: i < customers.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>{c.email || c.phone}</div>
                        </td>
                        <td style={{ padding: '12px 14px' }}><code style={{ fontSize: 11, background: '#F8FAFC', padding: '2px 7px', borderRadius: 5 }}>{c.card_number}</code></td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: 12 }}>{TIER_ICONS[c.tier] || '🎫'} </span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: tierObj?.color || '#64748B' }}>{c.tier}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#65A30D' }}>{c.points.toLocaleString('ru')}</td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: '#64748B' }}>{(c.total_points_redeemed || 0).toLocaleString('ru')}</td>
                        <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600 }}>{c.total_spend.toLocaleString('ru')} ₽</td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: '#94A3B8' }}>{new Date(c.joined_at).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    )
                  })}
                  {customers.length === 0 && <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>Нет клиентов</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Lookup/Accrual tab */}
      {tab === 'lookup' && (
        <div style={{ maxWidth: 560 }}>
          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '24px 28px', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Поиск клиента</div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>Введите номер карты, телефон или email</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={lookupCode} onChange={e => setLookupCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && doLookup()} placeholder="LYL-0001, +7 900..., email@..." style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
              <button onClick={doLookup} style={{ padding: '10px 20px', borderRadius: 10, background: '#0F172A', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Найти</button>
            </div>
          </div>

          {lookupResult === 'not_found' && (
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 14, padding: '18px 24px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#991B1B' }}>Клиент не найден</div>
              <div style={{ fontSize: 13, color: '#B91C1C', marginTop: 4 }}>Проверьте номер карты, телефон или email</div>
            </div>
          )}

          {lookupResult && lookupResult !== 'not_found' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#fff', border: '1.5px solid #A3E635', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#A3E635', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{lookupResult.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{lookupResult.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{lookupResult.email || lookupResult.phone} · {lookupResult.card_number}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#65A30D' }}>{lookupResult.points.toLocaleString('ru')}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>баллов доступно</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Уровень', value: `${TIER_ICONS[lookupResult.tier] || '🎫'} ${lookupResult.tier}` },
                    { label: 'Всего выдано', value: (lookupResult.total_points_earned || 0).toLocaleString('ru') },
                    { label: 'Оборот', value: `${lookupResult.total_spend.toLocaleString('ru')} ₽` },
                  ].map(s => (
                    <div key={s.label} style={{ background: '#F8FAFC', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Начислить баллы</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="number" value={addPointsAmount || ''} onChange={e => setAddPointsAmount(Number(e.target.value))} placeholder="Кол-во баллов" min={1} style={{ flex: 1, padding: '9px 12px', borderRadius: 9, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                  <button onClick={doAddPoints} disabled={!addPointsAmount} style={{ padding: '9px 18px', borderRadius: 9, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 13, border: 'none', cursor: addPointsAmount ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: addPointsAmount ? 1 : 0.5 }}>+ Начислить</button>
                </div>
              </div>

              <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Списать баллы</div>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 14 }}>Доступно: {lookupResult.points.toLocaleString('ru')} баллов = {(lookupResult.points / (lp.rub_per_point || 1)).toFixed(0)} ₽</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="number" value={redeemAmount || ''} onChange={e => setRedeemAmount(Number(e.target.value))} placeholder="Кол-во баллов" min={1} max={lookupResult.points} style={{ flex: 1, padding: '9px 12px', borderRadius: 9, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                  <button onClick={doRedeem} disabled={!redeemAmount || redeemAmount > lookupResult.points} style={{ padding: '9px 18px', borderRadius: 9, background: '#0F172A', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: (redeemAmount && redeemAmount <= lookupResult.points) ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: (redeemAmount && redeemAmount <= lookupResult.points) ? 1 : 0.5 }}>Списать</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats/Tiers tab */}
      {tab === 'stats' && (
        <div>
          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '24px 28px', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Распределение по уровням</div>
            <TierBar tiers={lp.tiers} customers={customers} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {lp.tiers.map(tier => {
              const tierCustomers = customers.filter(c => c.tier === tier.name)
              const avgPoints = tierCustomers.length ? Math.round(tierCustomers.reduce((s, c) => s + c.points, 0) / tierCustomers.length) : 0
              return (
                <div key={tier.name} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 28 }}>{TIER_ICONS[tier.name] || '🎫'}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: tier.color }}>{tier.name}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8' }}>от {tier.min_spend.toLocaleString('ru')} ₽</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { label: 'Клиентов', value: String(tierCustomers.length) },
                      { label: 'Ср. баллов', value: avgPoints.toLocaleString('ru') },
                      { label: 'Множитель', value: `×${tier.multiplier || 1}` },
                      { label: 'Скидка', value: `${tier.discount_percent || 0}%` },
                    ].map(s => (
                      <div key={s.label} style={{ background: '#F8FAFC', borderRadius: 9, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
