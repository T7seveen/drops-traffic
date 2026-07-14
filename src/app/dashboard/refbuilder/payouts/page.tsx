'use client'
import { useState } from 'react'
import { usePayouts, usePrograms } from '@/lib/refbuilder/store'
import type { Payout } from '@/lib/refbuilder/types'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Ожидает', color: '#92400E', bg: '#FFF7ED' },
  processing: { label: 'В обработке', color: '#1D4ED8', bg: '#EFF6FF' },
  paid: { label: 'Выплачено', color: '#15803D', bg: '#F0FDF4' },
  failed: { label: 'Ошибка', color: '#991B1B', bg: '#FEF2F2' },
}

const METHOD_MAP: Record<string, string> = {
  card: 'Банковская карта',
  sbp: 'СБП',
  telegram: 'Telegram',
}

export default function PayoutsPage() {
  const { payouts } = usePayouts()
  const { programs } = usePrograms()
  const [filter, setFilter] = useState('all')
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set())

  const filtered = filter === 'all' ? payouts : payouts.filter(p => p.status === filter)

  const totalPending = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const totalProcessing = payouts.filter(p => p.status === 'processing').reduce((s, p) => s + p.amount, 0)
  const totalCompleted = payouts.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)

  function approve(payout: Payout) {
    setApprovingId(payout.id)
    setTimeout(() => {
      setApprovedIds(prev => new Set([...prev, payout.id]))
      setApprovingId(null)
    }, 1200)
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>Выплаты партнёрам</h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Управление комиссионными выплатами</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Ожидают выплаты', value: `${totalPending.toLocaleString('ru')} ₽`, count: payouts.filter(p => p.status === 'pending').length, accent: '#F59E0B' },
          { label: 'В обработке', value: `${totalProcessing.toLocaleString('ru')} ₽`, count: payouts.filter(p => p.status === 'processing').length, accent: '#3B82F6' },
          { label: 'Выплачено (всего)', value: `${totalCompleted.toLocaleString('ru')} ₽`, count: payouts.filter(p => p.status === 'paid').length, accent: '#65A30D' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: `1.5px solid #E2E8F0`, borderRadius: 12, padding: '18px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: s.accent, borderRadius: '12px 0 0 12px' }} />
            <div style={{ paddingLeft: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.accent, marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{s.count} транзакции</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Batch action */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        {['all', 'pending', 'processing', 'paid', 'failed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1.5px solid', borderColor: filter === f ? '#A3E635' : '#E2E8F0', background: filter === f ? '#F7FEE7' : '#fff', color: filter === f ? '#3F6212' : '#64748B', cursor: 'pointer', fontFamily: 'inherit' }}>
            {f === 'all' ? 'Все' : STATUS_MAP[f]?.label || f}
            {f === 'pending' && payouts.filter(p => p.status === 'pending').length > 0 && (
              <span style={{ marginLeft: 6, background: '#F59E0B', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>{payouts.filter(p => p.status === 'pending').length}</span>
            )}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {filter === 'pending' && (
          <button style={{ padding: '8px 18px', borderRadius: 10, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            Одобрить все
          </button>
        )}
      </div>

      {/* Payouts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(payout => {
          const status = approvedIds.has(payout.id) ? STATUS_MAP['processing'] : STATUS_MAP[payout.status]
          const prog = programs.find(p => p.id === payout.program_id)
          const isApproving = approvingId === payout.id
          const wasApproved = approvedIds.has(payout.id)

          return (
            <div key={payout.id} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#0F172A', flexShrink: 0 }}>
                {payout.partner_name[0]}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{payout.partner_name}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: '#64748B' }}>{prog?.name.split(' ')[0] || '—'}</span>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>·</span>
                  <span style={{ fontSize: 12, color: '#64748B' }}>{METHOD_MAP[payout.method] || payout.method}</span>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>·</span>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>{new Date(payout.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                {payout.details && (
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontFamily: 'monospace' }}>{payout.details}</div>
                )}
              </div>

              {/* Amount */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>{payout.amount.toLocaleString('ru')} ₽</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Запрос #{payout.id.slice(-6).toUpperCase()}</div>
              </div>

              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: status.bg, color: status.color }}>
                  {isApproving ? '⏳ Обработка...' : (wasApproved ? 'В обработке' : status.label)}
                </span>
                {(payout.status === 'pending' && !wasApproved) && (
                  <button onClick={() => approve(payout)} disabled={isApproving} style={{ padding: '7px 16px', borderRadius: 8, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 12, border: 'none', cursor: isApproving ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: isApproving ? 0.7 : 1 }}>
                    {isApproving ? '...' : 'Одобрить'}
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ background: '#fff', border: '1.5px dashed #E2E8F0', borderRadius: 14, padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💳</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>Нет выплат</h3>
            <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Выплаты появятся, когда партнёры накопят комиссию</p>
          </div>
        )}
      </div>

      {/* Payout rules info */}
      <div style={{ marginTop: 24, background: '#F8FAFC', borderRadius: 14, padding: '18px 22px', border: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>Правила выплат</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Минимальная сумма', value: '1 000 ₽' },
            { label: 'Период обработки', value: '3-5 рабочих дней' },
            { label: 'Методы выплат', value: 'Карта, Банк, Крипто' },
          ].map(r => (
            <div key={r.label}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{r.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{r.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
