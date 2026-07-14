'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'

const INK = '#0F172A'
const MUTED = '#64748B'
const BORDER = '#E2E8F0'
const LIME = '#A3E635'
const BLUE = '#3B82F6'

function fmt(n: number, decimals = 0) {
  if (!isFinite(n) || isNaN(n)) return '—'
  return n.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function Num({ label, value, unit = '₽', color = INK, big = false }: {
  label: string; value: string; unit?: string; color?: string; big?: boolean
}) {
  return (
    <div style={{ padding: big ? 24 : 18, border: `1.5px solid ${BORDER}`, borderRadius: 14, background: '#fff' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>{label}</p>
      <p style={{ fontSize: big ? 32 : 24, fontWeight: 800, color, margin: 0, letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums' }}>
        {value}<span style={{ fontSize: big ? 16 : 13, fontWeight: 600, color: MUTED, marginLeft: 4 }}>{unit}</span>
      </p>
    </div>
  )
}

function Field({ label, hint, value, onChange, prefix, suffix, min = 0, max, step = 1 }: {
  label: string; hint?: string; value: number; onChange: (v: number) => void
  prefix?: string; suffix?: string; min?: number; max?: number; step?: number
}) {
  return (
    <div>
      <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6 }}>
        <span>{label}</span>
        {hint && <span style={{ fontSize: 12, color: MUTED, fontWeight: 400 }}>{hint}</span>}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
        {prefix && <span style={{ padding: '10px 12px', fontSize: 14, color: MUTED, borderRight: `1px solid ${BORDER}`, background: '#F8FAFC' }}>{prefix}</span>}
        <input
          type="number" value={value} min={min} max={max} step={step}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 12px', fontSize: 15, color: INK, fontFamily: 'inherit', background: 'transparent' }}
        />
        {suffix && <span style={{ padding: '10px 12px', fontSize: 14, color: MUTED, borderLeft: `1px solid ${BORDER}`, background: '#F8FAFC' }}>{suffix}</span>}
      </div>
    </div>
  )
}

export default function UnitCalcPage() {
  // Inputs
  const [budget, setBudget] = useState(50000)
  const [cpc, setCpc] = useState(35)
  const [convRate, setConvRate] = useState(2.5)
  const [aov, setAov] = useState(2800)
  const [cogsPercent, setCogsPercent] = useState(45)
  const [returnRate, setReturnRate] = useState(5)
  const [repeatOrders, setRepeatOrders] = useState(2.2)
  const [mode, setMode] = useState<'cpc' | 'cpm'>('cpc')
  const [cpm, setCpm] = useState(180)
  const [ctr, setCtr] = useState(1.5)

  const result = useMemo(() => {
    const clicks = mode === 'cpc'
      ? budget / Math.max(cpc, 0.01)
      : (budget / Math.max(cpm, 0.01)) * 1000 * (ctr / 100)

    const orders = clicks * (convRate / 100)
    const grossRev = orders * aov
    const netOrders = orders * (1 - returnRate / 100)
    const netRev = netOrders * aov
    const cogsCost = netRev * (cogsPercent / 100)
    const grossProfit = netRev - cogsCost
    const profit = grossProfit - budget
    const margin = grossRev > 0 ? (profit / grossRev) * 100 : 0
    const cac = orders > 0 ? budget / orders : Infinity
    const roas = budget > 0 ? grossRev / budget : 0
    const ltv = aov * repeatOrders * (1 - cogsPercent / 100)
    const breakEvenOrders = (cogsPercent < 100)
      ? budget / (aov * (1 - cogsPercent / 100))
      : Infinity
    const breakEvenBudget = breakEvenOrders * aov * (1 - cogsPercent / 100)

    return { clicks, orders, grossRev, netRev, profit, margin, cac, roas, ltv, breakEvenOrders, breakEvenBudget }
  }, [budget, cpc, cpm, ctr, convRate, aov, cogsPercent, returnRate, repeatOrders, mode])

  const profitPositive = result.profit > 0

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: MUTED, textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Кабинет
        </Link>
        <span style={{ color: BORDER }}>·</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="8" width="3" height="7" rx="1" fill="#fff"/><rect x="6" y="5" width="3" height="10" rx="1" fill="#fff"/><rect x="11" y="2" width="3" height="13" rx="1" fill="#fff"/></svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: INK }}>Юнит-экономика</span>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, background: '#DCFCE7', color: '#15803D', borderRadius: 20, padding: '4px 12px' }}>● Работает</span>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24, alignItems: 'start' }} className="calc-grid">

          {/* Left — Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Traffic */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: INK, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Трафик и реклама</p>
              <div style={{ display: 'flex', gap: 0, marginBottom: 20, border: `1.5px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
                {(['cpc', 'cpm'] as const).map(m => (
                  <button key={m} onClick={() => setMode(m)} style={{
                    flex: 1, padding: '9px', fontSize: 13, fontWeight: 700, border: 'none',
                    background: mode === m ? INK : '#fff', color: mode === m ? '#fff' : MUTED,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>{m === 'cpc' ? 'CPC (клик)' : 'CPM (тысяча)'}</button>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Рекламный бюджет" value={budget} onChange={setBudget} suffix="₽" min={1000} step={1000} />
                {mode === 'cpc' ? (
                  <Field label="Стоимость клика (CPC)" value={cpc} onChange={setCpc} suffix="₽" step={0.5} min={0.1} />
                ) : (
                  <>
                    <Field label="CPM (за 1000 показов)" value={cpm} onChange={setCpm} suffix="₽" step={5} min={1} />
                    <Field label="CTR" value={ctr} onChange={setCtr} suffix="%" step={0.1} min={0.1} max={30} />
                  </>
                )}
              </div>
            </div>

            {/* Conversion */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: INK, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Конверсия и заказы</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Конверсия сайта" hint="% посетителей → заказ" value={convRate} onChange={setConvRate} suffix="%" step={0.1} min={0.1} max={50} />
                <Field label="Средний чек (AOV)" value={aov} onChange={setAov} suffix="₽" min={100} step={100} />
                <Field label="Процент возвратов" value={returnRate} onChange={setReturnRate} suffix="%" step={0.5} min={0} max={50} />
              </div>
            </div>

            {/* Economics */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: INK, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Экономика</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Себестоимость (COGS)" hint="от выручки" value={cogsPercent} onChange={setCogsPercent} suffix="%" step={1} min={1} max={99} />
                <Field label="Повторных покупок на клиента" hint="за всё время" value={repeatOrders} onChange={setRepeatOrders} suffix="× " step={0.1} min={1} />
              </div>
            </div>
          </div>

          {/* Right — Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Big result */}
            <div style={{
              background: profitPositive ? '#F0FDF4' : '#FEF2F2',
              border: `2px solid ${profitPositive ? '#BBF7D0' : '#FECACA'}`,
              borderRadius: 20, padding: 28,
            }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: profitPositive ? '#15803D' : '#DC2626', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {profitPositive ? '✓ Кампания прибыльна' : '✗ Кампания убыточна'}
              </p>
              <p style={{ fontSize: 42, fontWeight: 800, color: profitPositive ? '#15803D' : '#DC2626', margin: '0 0 4px', letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>
                {profitPositive ? '+' : ''}{fmt(result.profit)} ₽
              </p>
              <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
                прибыль · маржа {fmt(result.margin, 1)}% · ROAS {fmt(result.roas, 2)}x
              </p>
            </div>

            {/* Key metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Num label="CAC (стоимость заказа)" value={fmt(result.cac)} color={result.cac < aov * 0.3 ? '#15803D' : result.cac < aov ? INK : '#DC2626'} />
              <Num label="ROAS" value={fmt(result.roas, 2)} unit="×" color={result.roas >= 3 ? '#15803D' : result.roas >= 1 ? INK : '#DC2626'} />
              <Num label="LTV" value={fmt(result.ltv)} color={BLUE} />
              <Num label="Кликов" value={fmt(result.clicks, 0)} unit="шт" color={INK} />
            </div>

            {/* Traffic & sales */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: INK, margin: '0 0 16px' }}>Воронка продаж</p>
              {[
                { label: 'Переходов на сайт', value: fmt(result.clicks, 0), unit: 'шт', pct: null },
                { label: 'Заказов', value: fmt(result.orders, 0), unit: 'шт', pct: convRate },
                { label: 'Чистых заказов (без возвратов)', value: fmt(result.orders * (1 - returnRate / 100), 0), unit: 'шт', pct: 100 - returnRate },
                { label: 'Валовая выручка', value: fmt(result.grossRev), unit: '₽', pct: null },
                { label: 'Выручка за вычетом себест.', value: fmt(result.netRev - result.netRev * cogsPercent / 100), unit: '₽', pct: 100 - cogsPercent },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? `1px solid ${BORDER}` : 'none' }}>
                  <span style={{ fontSize: 14, color: MUTED }}>{r.label}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: INK, fontVariantNumeric: 'tabular-nums' }}>{r.value} {r.unit}</span>
                    {r.pct !== null && <span style={{ fontSize: 12, color: MUTED, marginLeft: 8 }}>({r.pct}%)</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Break-even */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: INK, margin: '0 0 16px' }}>Точка безубыточности</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 12 }}>
                  <p style={{ fontSize: 12, color: MUTED, margin: '0 0 4px', fontWeight: 600 }}>Минимум заказов</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: INK, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{fmt(result.breakEvenOrders, 0)} <span style={{ fontSize: 13, color: MUTED }}>шт</span></p>
                </div>
                <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 12 }}>
                  <p style={{ fontSize: 12, color: MUTED, margin: '0 0 4px', fontWeight: 600 }}>Мин. бюджет</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: INK, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{fmt(result.breakEvenBudget)} <span style={{ fontSize: 13, color: MUTED }}>₽</span></p>
                </div>
              </div>
              {/* Progress bar */}
              {isFinite(result.breakEvenOrders) && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: MUTED, marginBottom: 6 }}>
                    <span>Текущие заказы: {fmt(result.orders, 0)}</span>
                    <span>Нужно: {fmt(result.breakEvenOrders, 0)}</span>
                  </div>
                  <div style={{ height: 8, background: BORDER, borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      background: profitPositive ? LIME : '#FCA5A5',
                      width: `${Math.min((result.orders / result.breakEvenOrders) * 100, 100)}%`,
                      transition: 'width 300ms',
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* Advice */}
            {!profitPositive && (
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16, padding: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#92400E', margin: '0 0 10px' }}>Что улучшить:</p>
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {result.roas < 1 && <li style={{ fontSize: 14, color: '#92400E' }}>Снизить CPC или повысить средний чек — ROAS меньше 1</li>}
                  {convRate < 1 && <li style={{ fontSize: 14, color: '#92400E' }}>Конверсия ниже 1% — оптимизируйте посадочную страницу</li>}
                  {cogsPercent > 70 && <li style={{ fontSize: 14, color: '#92400E' }}>Высокая себестоимость ({cogsPercent}%) — ищите дешевле поставщика</li>}
                  {returnRate > 10 && <li style={{ fontSize: 14, color: '#92400E' }}>Высокий процент возвратов ({returnRate}%) — улучшите описания</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .calc-grid { grid-template-columns: 1fr !important; } }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
      `}</style>
    </div>
  )
}
