'use client'
import Link from 'next/link'
import { useState, useMemo, useEffect, useRef } from 'react'

// ─── Design tokens ──────────────────────────────────────────────────────────
const INK = '#0F172A', MUTED = '#64748B', BORDER = '#E2E8F0'
const LIME = '#A3E635', BLUE = '#3B82F6', RED = '#EF4444'
const GREEN = '#22C55E', ORANGE = '#F59E0B', BG = '#F8FAFC'

// ─── Types ──────────────────────────────────────────────────────────────────
type MP = 'ozon' | 'wb' | 'avito' | 'own'
type TabId = 'overview' | 'products' | 'calculator' | 'marketplaces'

interface Product {
  id: string; name: string; sku: string; marketplace: MP
  price: number; cost: number; commission: number; fulfillment: number
  monthlySales: number; adSpend: number; returnRate: number
}

interface MPConn {
  mp: MP; clientId: string; apiKey: string
  status: 'idle' | 'connecting' | 'connected' | 'error'
  error?: string; syncedAt?: string
  imported?: { id: string; name: string; price: number; sold: number; revenue: number; commission: number }[]
}

// ─── Constants ──────────────────────────────────────────────────────────────
const MP_NAME: Record<MP, string> = { ozon: 'Ozon', wb: 'Wildberries', avito: 'Авито', own: 'Свой сайт' }
const MP_COLOR: Record<MP, string> = { ozon: '#005BFF', wb: '#CB11AB', avito: '#00AAFF', own: '#22C55E' }
const MP_COMM: Record<MP, number> = { ozon: 12, wb: 15, avito: 5, own: 0 }

const DEMO_PRODUCTS: Product[] = [
  { id: '1', name: 'Наушники TWS X10', sku: 'TWS-X10', marketplace: 'ozon', price: 1490, cost: 520, commission: 12, fulfillment: 85, monthlySales: 43, adSpend: 3500, returnRate: 4 },
  { id: '2', name: 'Чехол iPhone 14 Pro', sku: 'CASE-IP14P', marketplace: 'wb', price: 590, cost: 85, commission: 15, fulfillment: 60, monthlySales: 128, adSpend: 2000, returnRate: 8 },
  { id: '3', name: 'Лампа настольная LED', sku: 'LAMP-LED', marketplace: 'ozon', price: 2200, cost: 890, commission: 10, fulfillment: 120, monthlySales: 21, adSpend: 1800, returnRate: 3 },
  { id: '4', name: 'Зарядка 65W GaN', sku: 'CHG-65W', marketplace: 'wb', price: 1890, cost: 680, commission: 12, fulfillment: 75, monthlySales: 37, adSpend: 4200, returnRate: 5 },
  { id: '5', name: 'Кабель USB-C 2м', sku: 'CBL-C2M', marketplace: 'avito', price: 290, cost: 45, commission: 5, fulfillment: 0, monthlySales: 64, adSpend: 800, returnRate: 2 },
]

// ─── Math ────────────────────────────────────────────────────────────────────
function calc(p: Product) {
  const net = p.monthlySales * (1 - p.returnRate / 100)
  const revenue = net * p.price
  const commAmt = revenue * p.commission / 100
  const ffAmt = net * p.fulfillment
  const cogs = net * p.cost
  const totalCost = cogs + commAmt + ffAmt + p.adSpend
  const profit = revenue - totalCost
  const margin = revenue > 0 ? profit / revenue * 100 : 0
  const ppu = net > 0 ? profit / net : 0
  const roi = (cogs + p.adSpend) > 0 ? profit / (cogs + p.adSpend) * 100 : 0
  const roas = p.adSpend > 0 ? revenue / p.adSpend : null
  const minPrice = net * (1 - p.commission / 100) > 0
    ? (cogs + ffAmt) / (net * (1 - p.commission / 100))
    : 0
  const rec = minPrice > 0 ? minPrice * 1.3 : p.price
  return { revenue, commAmt, ffAmt, cogs, totalCost, profit, margin, ppu, roi, roas, minPrice, rec, net }
}

function fmt(n: number, dec = 0) {
  if (!isFinite(n) || isNaN(n)) return '—'
  return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// ─── Tooltip component ───────────────────────────────────────────────────────
function Tip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-flex', marginLeft: 4 }}>
      <span onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        style={{ width: 15, height: 15, borderRadius: '50%', background: '#E2E8F0', color: MUTED, fontSize: 10, fontWeight: 700, cursor: 'default', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>?</span>
      {show && (
        <span style={{ position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)', background: INK, color: '#fff', fontSize: 12, padding: '6px 10px', borderRadius: 8, whiteSpace: 'nowrap', maxWidth: 240, lineHeight: 1.4, zIndex: 50 }}>
          {text}
        </span>
      )}
    </span>
  )
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function Stat({ label, value, unit = '₽', color = INK, tip }: { label: string; value: string; unit?: string; color?: string; tip?: string }) {
  return (
    <div style={{ padding: 18, border: `1.5px solid ${BORDER}`, borderRadius: 14, background: '#fff' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px', display: 'flex', alignItems: 'center' }}>
        {label}{tip && <Tip text={tip} />}
      </p>
      <p style={{ fontSize: 24, fontWeight: 800, color, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
        {value}<span style={{ fontSize: 13, fontWeight: 500, color: MUTED, marginLeft: 4 }}>{unit}</span>
      </p>
    </div>
  )
}

// ─── Field ───────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, suffix, step = 1, min = 0, tip }: {
  label: string; value: number; onChange: (v: number) => void; suffix?: string; step?: number; min?: number; tip?: string
}) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 600, color: INK, marginBottom: 5 }}>
        {label}{tip && <Tip text={tip} />}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
        <input type="number" value={value} min={min} step={step}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 10px', fontSize: 14, color: INK, fontFamily: 'inherit', background: 'transparent' }}
        />
        {suffix && <span style={{ padding: '8px 10px', fontSize: 13, color: MUTED, borderLeft: `1px solid ${BORDER}`, background: BG }}>{suffix}</span>}
      </div>
    </div>
  )
}

// ─── Mini bar chart ──────────────────────────────────────────────────────────
function MiniBar({ items }: { items: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...items.map(i => Math.abs(i.value)), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(item => (
        <div key={item.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: MUTED, marginBottom: 3 }}>
            <span>{item.label}</span>
            <span style={{ fontWeight: 600, color: item.value >= 0 ? INK : RED }}>{fmt(item.value)} ₽</span>
          </div>
          <div style={{ height: 6, background: BORDER, borderRadius: 99 }}>
            <div style={{ height: '100%', borderRadius: 99, background: item.color, width: `${Math.abs(item.value) / max * 100}%`, transition: 'width 400ms' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function UnitCalcPage() {
  const [tab, setTab] = useState<TabId>('overview')
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [connections, setConnections] = useState<MPConn[]>([
    { mp: 'ozon', clientId: '', apiKey: '', status: 'idle' },
    { mp: 'wb', clientId: '', apiKey: '', status: 'idle' },
    { mp: 'avito', clientId: '', apiKey: '', status: 'idle' },
  ])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  // Persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('uc-products')
      if (saved) setProducts(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('uc-products', JSON.stringify(products)) } catch {}
  }, [products])

  // Aggregate stats
  const agg = useMemo(() => {
    const rows = products.map(p => ({ p, r: calc(p) }))
    const totalRev = rows.reduce((s, { r }) => s + r.revenue, 0)
    const totalProfit = rows.reduce((s, { r }) => s + r.profit, 0)
    const totalCost = rows.reduce((s, { r }) => s + r.totalCost, 0)
    const totalAd = rows.reduce((s, { p }) => s + p.adSpend, 0)
    const totalCogs = rows.reduce((s, { r }) => s + r.cogs, 0)
    const totalComm = rows.reduce((s, { r }) => s + r.commAmt, 0)
    const totalFf = rows.reduce((s, { r }) => s + r.ffAmt, 0)
    const margin = totalRev > 0 ? totalProfit / totalRev * 100 : 0
    const sorted = [...rows].sort((a, b) => b.r.profit - a.r.profit)
    const byMp: Record<string, number> = {}
    rows.forEach(({ p, r }) => { byMp[p.marketplace] = (byMp[p.marketplace] ?? 0) + r.revenue })
    return { rows, totalRev, totalProfit, totalCost, totalAd, totalCogs, totalComm, totalFf, margin, sorted, byMp }
  }, [products])

  // ── Tabs nav
  const TABS: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Обзор' },
    { id: 'products', label: `Товары (${products.length})` },
    { id: 'calculator', label: 'Калькулятор' },
    { id: 'marketplaces', label: 'Маркетплейсы' },
  ]

  // ── Connect marketplace
  async function connectOzon(conn: MPConn) {
    setConnections(cs => cs.map(c => c.mp === 'ozon' ? { ...c, status: 'connecting', error: undefined } : c))
    try {
      const res = await fetch('/api/marketplaces/ozon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: conn.clientId, apiKey: conn.apiKey,
          endpoint: '/v2/product/list',
          body: { filter: { visibility: 'ALL' }, limit: 50, last_id: '' },
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.message || data.error || `HTTP ${res.status}`)
      const imported = (data.result?.items ?? []).map((item: { product_id: number; name: string; price: string; commission_percent: number }) => ({
        id: String(item.product_id), name: item.name,
        price: parseFloat(item.price) || 0, sold: 0, revenue: 0,
        commission: item.commission_percent ?? 12,
      }))
      setConnections(cs => cs.map(c => c.mp === 'ozon'
        ? { ...c, status: 'connected', syncedAt: new Date().toLocaleString('ru'), imported }
        : c))
    } catch (e) {
      setConnections(cs => cs.map(c => c.mp === 'ozon'
        ? { ...c, status: 'error', error: String(e).replace('Error: ', '') }
        : c))
    }
  }

  async function connectWB(conn: MPConn) {
    setConnections(cs => cs.map(c => c.mp === 'wb' ? { ...c, status: 'connecting', error: undefined } : c))
    try {
      const dateFrom = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
      const res = await fetch('/api/marketplaces/wb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: conn.apiKey,
          endpoint: '/api/v5/supplier/reportDetailByPeriod',
          params: { dateFrom, limit: 100, rrdid: 0 },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.errors?.[0]?.description || `HTTP ${res.status}`)
      // Aggregate by nm_id
      const byNm: Record<string, { name: string; sold: number; revenue: number }> = {}
      ;(data ?? []).forEach((row: { nm_id: number; sa_name: string; quantity: number; retail_amount: number }) => {
        const k = String(row.nm_id)
        if (!byNm[k]) byNm[k] = { name: row.sa_name, sold: 0, revenue: 0 }
        byNm[k].sold += row.quantity
        byNm[k].revenue += row.retail_amount
      })
      const imported = Object.entries(byNm).slice(0, 50).map(([id, v]) => ({
        id, name: v.name, price: v.sold > 0 ? v.revenue / v.sold : 0,
        sold: v.sold, revenue: v.revenue, commission: 15,
      }))
      setConnections(cs => cs.map(c => c.mp === 'wb'
        ? { ...c, status: 'connected', syncedAt: new Date().toLocaleString('ru'), imported }
        : c))
    } catch (e) {
      setConnections(cs => cs.map(c => c.mp === 'wb'
        ? { ...c, status: 'error', error: String(e).replace('Error: ', '') }
        : c))
    }
  }

  // Import product from marketplace
  function importProduct(conn: MPConn, item: NonNullable<MPConn['imported']>[number]) {
    const p: Product = {
      id: `${conn.mp}-${item.id}-${Date.now()}`,
      name: item.name, sku: item.id,
      marketplace: conn.mp, price: item.price, cost: Math.round(item.price * 0.4),
      commission: item.commission, fulfillment: conn.mp === 'ozon' ? 80 : 60,
      monthlySales: item.sold || 10, adSpend: 0, returnRate: 5,
    }
    setProducts(ps => [...ps, p])
    setTab('products')
  }

  // ── Export PDF
  function handleExport() {
    const date = new Date().toLocaleDateString('ru', { year: 'numeric', month: 'long', day: 'numeric' })
    const win = window.open('', '_blank')
    if (!win) return
    const rows = agg.sorted.map(({ p, r }) => `
      <tr>
        <td>${p.name}</td>
        <td>${MP_NAME[p.marketplace]}</td>
        <td>${fmt(r.revenue)} ₽</td>
        <td style="color:${r.profit >= 0 ? '#15803D' : '#DC2626'}">${r.profit >= 0 ? '+' : ''}${fmt(r.profit)} ₽</td>
        <td>${fmt(r.margin, 1)}%</td>
        <td>${fmt(p.monthlySales, 0)} шт</td>
        <td style="color:${r.margin < 0 ? '#DC2626' : '#15803D'}">${r.margin < 0 ? '⚠ В минус' : '✓ Прибыль'}</td>
      </tr>`).join('')

    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>Аналитика Юнит-экономики — ${date}</title>
      <style>
        body{font-family:Arial,sans-serif;padding:32px;color:#0F172A}
        h1{font-size:24px;margin:0 0 4px}
        .date{color:#64748B;font-size:14px;margin:0 0 24px}
        .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
        .card{border:1.5px solid #E2E8F0;border-radius:12px;padding:16px}
        .card-label{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#64748B;margin:0 0 6px}
        .card-val{font-size:22px;font-weight:800;margin:0}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{background:#F8FAFC;padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#64748B;border-bottom:2px solid #E2E8F0}
        td{padding:10px 12px;border-bottom:1px solid #E2E8F0}
        tr:last-child td{border-bottom:none}
        .footer{margin-top:24px;font-size:12px;color:#94A3B8;text-align:right}
      </style></head><body>
      <h1>Отчёт по юнит-экономике</h1>
      <p class="date">${date} · drops-traffic.vercel.app</p>
      <div class="cards">
        <div class="card"><p class="card-label">Выручка (месяц)</p><p class="card-val">${fmt(agg.totalRev)} ₽</p></div>
        <div class="card"><p class="card-label">Прибыль</p><p class="card-val" style="color:${agg.totalProfit >= 0 ? '#15803D' : '#DC2626'}">${agg.totalProfit >= 0 ? '+' : ''}${fmt(agg.totalProfit)} ₽</p></div>
        <div class="card"><p class="card-label">Маржа</p><p class="card-val">${fmt(agg.margin, 1)}%</p></div>
        <div class="card"><p class="card-label">Товаров</p><p class="card-val">${products.length} шт</p></div>
      </div>
      <table>
        <thead><tr><th>Товар</th><th>Маркетплейс</th><th>Выручка</th><th>Прибыль</th><th>Маржа</th><th>Продажи</th><th>Статус</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="footer">Drops Traffic — Платформа для e-commerce трафика</p>
      </body></html>`)
    win.document.close()
    win.print()
  }

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '0 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 56 }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: MUTED, textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Кабинет
          </Link>
          <span style={{ color: BORDER }}>·</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: INK }}>Юнит-экономика</span>
          <span style={{ fontSize: 11, fontWeight: 700, background: '#DCFCE7', color: '#15803D', borderRadius: 20, padding: '3px 10px', marginLeft: 4 }}>● Live</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button onClick={handleExport} style={{ padding: '7px 16px', borderRadius: 8, border: `1.5px solid ${BORDER}`, background: '#fff', color: INK, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Экспорт PDF
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 0, borderTop: `1px solid ${BORDER}` }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '10px 20px', background: 'none', border: 'none',
              borderBottom: tab === t.id ? `2px solid ${INK}` : '2px solid transparent',
              color: tab === t.id ? INK : MUTED, fontSize: 14, fontWeight: tab === t.id ? 700 : 500,
              cursor: 'pointer', fontFamily: 'inherit', marginBottom: -1,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px' }} ref={printRef}>

        {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="uc-grid4">
              <div style={{ padding: 24, border: `2px solid ${agg.totalProfit >= 0 ? '#BBF7D0' : '#FECACA'}`, borderRadius: 16, background: agg.totalProfit >= 0 ? '#F0FDF4' : '#FEF2F2' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: agg.totalProfit >= 0 ? '#15803D' : '#DC2626', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>
                  {agg.totalProfit >= 0 ? '✓ Чистая прибыль' : '✗ Убыток'}
                </p>
                <p style={{ fontSize: 32, fontWeight: 800, color: agg.totalProfit >= 0 ? '#15803D' : '#DC2626', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {agg.totalProfit >= 0 ? '+' : ''}{fmt(agg.totalProfit)} ₽
                </p>
                <p style={{ fontSize: 12, color: MUTED, margin: '4px 0 0' }}>в месяц по всем товарам</p>
              </div>
              <Stat label="Выручка" value={fmt(agg.totalRev)} tip="Суммарная выручка по всем товарам за месяц за вычетом возвратов" />
              <Stat label="Маржа" value={fmt(agg.margin, 1)} unit="%" tip="Доля прибыли от выручки. Нормально для маркетплейсов: 15–35%" color={agg.margin >= 20 ? GREEN : agg.margin >= 0 ? ORANGE : RED} />
              <Stat label="Расходов" value={fmt(agg.totalCost)} tip="Себестоимость + комиссии + фулфилмент + реклама" color={MUTED} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }} className="uc-grid2">
              {/* Best/worst sellers */}
              <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: INK, margin: '0 0 16px' }}>Рейтинг прибыльности товаров</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {agg.sorted.map(({ p, r }, i) => {
                    const pct = agg.sorted[0].r.profit !== 0
                      ? Math.max(0, r.profit) / Math.max(agg.sorted[0].r.profit, 1) * 100
                      : 0
                    return (
                      <div key={p.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, width: 20, textAlign: 'right' }}>{i + 1}</span>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: MP_COLOR[p.marketplace], borderRadius: 6, padding: '2px 7px', flexShrink: 0 }}>{MP_NAME[p.marketplace]}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: r.profit >= 0 ? GREEN : RED, fontVariantNumeric: 'tabular-nums', width: 90, textAlign: 'right' }}>
                            {r.profit >= 0 ? '+' : ''}{fmt(r.profit)} ₽
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ width: 20 }} />
                          <div style={{ flex: 1, height: 5, background: BORDER, borderRadius: 99 }}>
                            <div style={{ height: '100%', borderRadius: 99, background: r.profit >= 0 ? LIME : '#FECACA', width: `${pct}%`, transition: 'width 400ms' }} />
                          </div>
                          <span style={{ fontSize: 11, color: MUTED, width: 50, textAlign: 'right' }}>{fmt(r.margin, 1)}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Cost breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: INK, margin: '0 0 16px' }}>Структура расходов</p>
                  <MiniBar items={[
                    { label: 'Себестоимость (COGS)', value: agg.totalCogs, color: BLUE },
                    { label: 'Комиссии маркетплейсов', value: agg.totalComm, color: ORANGE },
                    { label: 'Фулфилмент и доставка', value: agg.totalFf, color: '#8B5CF6' },
                    { label: 'Реклама', value: agg.totalAd, color: RED },
                  ]} />
                </div>
                <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: INK, margin: '0 0 16px' }}>По маркетплейсам</p>
                  <MiniBar items={Object.entries(agg.byMp).map(([mp, rev]) => ({
                    label: MP_NAME[mp as MP] ?? mp, value: rev, color: MP_COLOR[mp as MP] ?? BLUE,
                  }))} />
                </div>
              </div>
            </div>

            {/* Убыточные товары */}
            {agg.sorted.some(({ r }) => r.profit < 0) && (
              <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#DC2626', margin: '0 0 12px' }}>⚠ Убыточные товары — вы теряете деньги</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {agg.sorted.filter(({ r }) => r.profit < 0).map(({ p, r }) => (
                    <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #FECACA' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: INK, margin: '0 0 4px' }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: RED, margin: '0 0 8px' }}>Убыток: {fmt(r.profit)} ₽/мес</p>
                      <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
                        Мин. цена без убытка: <strong style={{ color: INK }}>{fmt(r.minPrice)} ₽</strong> · Текущая: {fmt(p.price)} ₽
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS ─────────────────────────────────────────────────────── */}
        {tab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: INK, margin: 0 }}>Товары и прибыльность</p>
              <button onClick={() => setShowAddForm(true)} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: LIME, color: INK, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                + Добавить товар
              </button>
            </div>

            {showAddForm && <ProductForm onSave={p => { setProducts(ps => [...ps, p]); setShowAddForm(false) }} onCancel={() => setShowAddForm(false)} />}

            {editingId && (
              <ProductForm
                initial={products.find(p => p.id === editingId)}
                onSave={p => { setProducts(ps => ps.map(x => x.id === p.id ? p : x)); setEditingId(null) }}
                onCancel={() => setEditingId(null)}
              />
            )}

            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: BG }}>
                      {['Товар / SKU', 'МП', 'Цена', 'Себест.', 'Продажи', 'Выручка', 'Прибыль', 'Маржа', 'Мин. цена', 'Статус', ''].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.4px', color: MUTED, borderBottom: `1.5px solid ${BORDER}`, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => {
                      const r = calc(p)
                      const ok = r.profit >= 0
                      const warn = r.margin < 10 && r.margin >= 0
                      return (
                        <tr key={p.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                          <td style={{ padding: '12px 14px' }}>
                            <p style={{ margin: 0, fontWeight: 700, color: INK }}>{p.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: MUTED }}>{p.sku}</p>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: MP_COLOR[p.marketplace], borderRadius: 6, padding: '3px 8px' }}>{MP_NAME[p.marketplace]}</span>
                          </td>
                          <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{fmt(p.price)} ₽</td>
                          <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', color: MUTED, whiteSpace: 'nowrap' }}>{fmt(p.cost)} ₽</td>
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>{fmt(p.monthlySales, 0)} шт</td>
                          <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(r.revenue)} ₽</td>
                          <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: ok ? GREEN : RED, whiteSpace: 'nowrap' }}>
                            {ok ? '+' : ''}{fmt(r.profit)} ₽
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: ok ? (warn ? ORANGE : GREEN) : RED }}>{fmt(r.margin, 1)}%</td>
                          <td style={{ padding: '12px 14px', fontSize: 12, color: MUTED, whiteSpace: 'nowrap' }}>
                            {fmt(r.minPrice)} ₽
                            {p.price < r.minPrice && <span style={{ color: RED, fontWeight: 700 }}> !</span>}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, background: ok ? (warn ? '#FEF3C7' : '#DCFCE7') : '#FEF2F2', color: ok ? (warn ? '#92400E' : '#15803D') : '#DC2626', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>
                              {!ok ? '✗ В минус' : warn ? '⚠ Мало маржи' : '✓ Прибыль'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => setEditingId(p.id)} style={{ fontSize: 12, color: BLUE, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Ред.</button>
                              <button onClick={() => setProducts(ps => ps.filter(x => x.id !== p.id))} style={{ fontSize: 12, color: RED, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Удал.</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── CALCULATOR ───────────────────────────────────────────────────── */}
        {tab === 'calculator' && <CalcTab />}

        {/* ── MARKETPLACES ─────────────────────────────────────────────────── */}
        {tab === 'marketplaces' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
              Подключите API маркетплейсов — мы загрузим ваши товары и продажи автоматически.
              Ключи хранятся только в вашем браузере и нигде не передаются.
            </p>
            {connections.map((conn, idx) => (
              <MPCard key={conn.mp} conn={conn}
                onChange={c => setConnections(cs => cs.map((x, i) => i === idx ? c : x))}
                onConnect={() => { if (conn.mp === 'ozon') connectOzon(conn); else if (conn.mp === 'wb') connectWB(conn) }}
                onImport={item => importProduct(conn, item)}
              />
            ))}
          </div>
        )}

      </div>

      <style>{`
        @media(max-width:900px){.uc-grid4{grid-template-columns:1fr 1fr!important}.uc-grid2{grid-template-columns:1fr!important}}
        @media(max-width:600px){.uc-grid4{grid-template-columns:1fr!important}}
        input[type=number]::-webkit-inner-spin-button{opacity:1}
        @media print{button,nav,header{display:none!important}}
      `}</style>
    </div>
  )
}

// ─── Product form ─────────────────────────────────────────────────────────────
function ProductForm({ initial, onSave, onCancel }: {
  initial?: Product; onSave: (p: Product) => void; onCancel: () => void
}) {
  const [p, setP] = useState<Product>(initial ?? {
    id: 'p_' + Date.now(), name: '', sku: '', marketplace: 'ozon',
    price: 1000, cost: 400, commission: 12, fulfillment: 80,
    monthlySales: 20, adSpend: 0, returnRate: 5,
  })
  const up = (k: keyof Product, v: string | number) => setP(x => ({ ...x, [k]: v }))
  const r = calc(p)

  return (
    <div style={{ background: '#fff', border: `1.5px solid ${LIME}`, borderRadius: 16, padding: 24 }}>
      <p style={{ fontSize: 15, fontWeight: 800, color: INK, margin: '0 0 20px' }}>{initial ? 'Редактировать товар' : 'Новый товар'}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: INK, display: 'block', marginBottom: 5 }}>Название</label>
          <input value={p.name} onChange={e => up('name', e.target.value)} placeholder="Напр.: Наушники TWS X10"
            style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: '8px 10px', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: INK }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: INK, display: 'block', marginBottom: 5 }}>SKU</label>
          <input value={p.sku} onChange={e => up('sku', e.target.value)} placeholder="SKU-001"
            style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: '8px 10px', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: INK }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: INK, display: 'block', marginBottom: 5 }}>Маркетплейс</label>
          <select value={p.marketplace} onChange={e => { up('marketplace', e.target.value as MP); up('commission', MP_COMM[e.target.value as MP]) }}
            style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: '8px 10px', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: INK, background: '#fff' }}>
            {(Object.keys(MP_NAME) as MP[]).map(m => <option key={m} value={m}>{MP_NAME[m]}</option>)}
          </select>
        </div>
        <Field label="Цена продажи" value={p.price} onChange={v => up('price', v)} suffix="₽" tip="Цена, по которой покупатель видит товар на маркетплейсе" />
        <Field label="Себестоимость" value={p.cost} onChange={v => up('cost', v)} suffix="₽" tip="Ваша закупочная цена у поставщика за единицу товара" />
        <Field label="Комиссия МП" value={p.commission} onChange={v => up('commission', v)} suffix="%" step={0.5} tip="Процент, который удерживает маркетплейс с каждой продажи. Ozon: 5–25%, WB: 5–25%" />
        <Field label="Фулфилмент" value={p.fulfillment} onChange={v => up('fulfillment', v)} suffix="₽/шт" tip="Стоимость доставки + упаковки + хранения на складе маркетплейса на единицу" />
        <Field label="Продажи в месяц" value={p.monthlySales} onChange={v => up('monthlySales', v)} suffix="шт" step={1} />
        <Field label="Реклама в месяц" value={p.adSpend} onChange={v => up('adSpend', v)} suffix="₽" tip="Ежемесячный бюджет на рекламу (ставки, продвижение) для этого товара" />
        <Field label="Возвраты" value={p.returnRate} onChange={v => up('returnRate', v)} suffix="%" step={0.5} tip="Процент заказов которые покупатели возвращают. Электроника: 5–15%, одежда: 20–40%" />
      </div>
      {/* Preview */}
      <div style={{ marginTop: 16, padding: 14, background: BG, borderRadius: 10, display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {[
          { label: 'Прибыль/мес', value: `${r.profit >= 0 ? '+' : ''}${fmt(r.profit)} ₽`, color: r.profit >= 0 ? GREEN : RED },
          { label: 'Маржа', value: `${fmt(r.margin, 1)}%`, color: r.margin >= 15 ? GREEN : r.margin >= 0 ? ORANGE : RED },
          { label: 'Мин. цена', value: `${fmt(r.minPrice)} ₽`, color: p.price < r.minPrice ? RED : MUTED },
          { label: 'Прибыль/шт', value: `${fmt(r.ppu)} ₽`, color: r.ppu >= 0 ? INK : RED },
        ].map(m => (
          <div key={m.label}>
            <p style={{ fontSize: 11, color: MUTED, margin: '0 0 2px', fontWeight: 600, textTransform: 'uppercase' }}>{m.label}</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: m.color, margin: 0 }}>{m.value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button onClick={() => onSave(p)} disabled={!p.name} style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: LIME, color: INK, fontSize: 14, fontWeight: 700, cursor: p.name ? 'pointer' : 'not-allowed', opacity: p.name ? 1 : 0.5, fontFamily: 'inherit' }}>Сохранить</button>
        <button onClick={onCancel} style={{ padding: '9px 20px', borderRadius: 10, border: `1.5px solid ${BORDER}`, background: '#fff', color: MUTED, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Отмена</button>
      </div>
    </div>
  )
}

// ─── Marketplace card ─────────────────────────────────────────────────────────
function MPCard({ conn, onChange, onConnect, onImport }: {
  conn: MPConn; onChange: (c: MPConn) => void; onConnect: () => void
  onImport: (item: NonNullable<MPConn['imported']>[number]) => void
}) {
  const isOzon = conn.mp === 'ozon'
  const isWB = conn.mp === 'wb'
  const needsClientId = isOzon

  return (
    <div style={{ background: '#fff', border: `1.5px solid ${conn.status === 'connected' ? '#BBF7D0' : BORDER}`, borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: MP_COLOR[conn.mp], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>
          {MP_NAME[conn.mp][0]}
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 800, color: INK, margin: 0 }}>{MP_NAME[conn.mp]}</p>
          <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
            {conn.status === 'connected' ? `✓ Подключено · Синхр. ${conn.syncedAt}` :
             conn.status === 'error' ? `✗ Ошибка: ${conn.error}` :
             conn.status === 'connecting' ? '⏳ Подключаемся...' : 'Не подключено'}
          </p>
        </div>
        {conn.status === 'connected' && (
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, background: '#DCFCE7', color: '#15803D', borderRadius: 20, padding: '4px 12px' }}>
            {conn.imported?.length ?? 0} товаров
          </span>
        )}
      </div>

      {conn.status !== 'connected' && (conn.mp === 'ozon' || conn.mp === 'wb') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {needsClientId && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: INK, display: 'block', marginBottom: 5 }}>Client ID</label>
              <input value={conn.clientId} onChange={e => onChange({ ...conn, clientId: e.target.value })}
                placeholder={isOzon ? 'Напр.: 1234567' : ''}
                style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: INK }} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: INK, display: 'block', marginBottom: 5 }}>
              {isOzon ? 'API-ключ (из раздела Настройки → API)' : 'API-токен (из личного кабинета WB → Настройки)'}
            </label>
            <input value={conn.apiKey} onChange={e => onChange({ ...conn, apiKey: e.target.value })}
              placeholder={isOzon ? 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}
              type="password"
              style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${conn.status === 'error' ? '#FECACA' : BORDER}`, borderRadius: 8, padding: '8px 12px', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: INK }} />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={onConnect} disabled={conn.status === 'connecting' || !conn.apiKey || (needsClientId && !conn.clientId)}
              style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: MP_COLOR[conn.mp], color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: (conn.status === 'connecting' || !conn.apiKey) ? 0.6 : 1 }}>
              {conn.status === 'connecting' ? 'Подключаем...' : 'Подключить'}
            </button>
            <span style={{ fontSize: 12, color: MUTED }}>
              {isOzon ? 'Ozon Seller API → Настройки → API · Нужна роль «Seller API»' : 'WB Личный кабинет → Настройки → Доступ к API'}
            </span>
          </div>
        </div>
      )}

      {conn.mp === 'avito' && conn.status !== 'connected' && (
        <div style={{ background: BG, borderRadius: 10, padding: 16 }}>
          <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
            Авито использует OAuth 2.0. Интеграция через авторизацию в личном кабинете — добавляйте товары вручную в разделе «Товары».
          </p>
        </div>
      )}

      {conn.status === 'connected' && conn.imported && conn.imported.length > 0 && (
        <div style={{ marginTop: 4 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: INK, margin: '0 0 10px' }}>Загруженные товары — нажмите чтобы добавить в анализ:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
            {conn.imported.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', border: `1px solid ${BORDER}`, borderRadius: 10, background: BG }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: INK, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{fmt(item.price)} ₽ · {fmt(item.sold, 0)} продаж · {fmt(item.revenue)} ₽ выручки</p>
                </div>
                <button onClick={() => onImport(item)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: LIME, color: INK, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                  + В анализ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {conn.status === 'connected' && (
        <button onClick={() => onChange({ ...conn, status: 'idle', imported: undefined, syncedAt: undefined })}
          style={{ marginTop: 12, fontSize: 12, color: RED, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
          Отключить
        </button>
      )}
    </div>
  )
}

// ─── Calculator tab (unit economics ad calculator) ────────────────────────────
function CalcTab() {
  const [budget, setBudget] = useState(50000)
  const [cpc, setCpc] = useState(35)
  const [convRate, setConvRate] = useState(2.5)
  const [aov, setAov] = useState(2800)
  const [cogsP, setCogsP] = useState(45)
  const [retRate, setRetRate] = useState(5)
  const [repeat, setRepeat] = useState(2.2)
  const [mode, setMode] = useState<'cpc' | 'cpm'>('cpc')
  const [cpm, setCpm] = useState(180)
  const [ctr, setCtr] = useState(1.5)

  const r = useMemo(() => {
    const clicks = mode === 'cpc' ? budget / Math.max(cpc, 0.01) : (budget / Math.max(cpm, 0.01)) * 1000 * (ctr / 100)
    const orders = clicks * (convRate / 100)
    const netOrders = orders * (1 - retRate / 100)
    const grossRev = orders * aov; const netRev = netOrders * aov
    const cogs = netRev * (cogsP / 100)
    const profit = netRev - cogs - budget
    const margin = grossRev > 0 ? profit / grossRev * 100 : 0
    const cac = orders > 0 ? budget / orders : Infinity
    const roas = budget > 0 ? grossRev / budget : 0
    const ltv = aov * repeat * (1 - cogsP / 100)
    const beOrders = (cogsP < 100) ? budget / (aov * (1 - cogsP / 100)) : Infinity
    return { clicks, orders, grossRev, netRev, profit, margin, cac, roas, ltv, beOrders }
  }, [budget, cpc, cpm, ctr, convRate, aov, cogsP, retRate, repeat, mode])

  const ok = r.profit > 0
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24, alignItems: 'start' }} className="uc-grid2">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: INK, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Трафик и реклама</p>
          <div style={{ display: 'flex', marginBottom: 16, border: `1.5px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
            {(['cpc', 'cpm'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '8px', fontSize: 13, fontWeight: 700, border: 'none', background: mode === m ? INK : '#fff', color: mode === m ? '#fff' : MUTED, cursor: 'pointer', fontFamily: 'inherit' }}>
                {m === 'cpc' ? 'CPC (за клик)' : 'CPM (за 1000)'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Рекламный бюджет" value={budget} onChange={setBudget} suffix="₽" step={1000} tip="Сколько тратите на рекламу за месяц" />
            {mode === 'cpc'
              ? <Field label="Стоимость клика (CPC)" value={cpc} onChange={setCpc} suffix="₽" step={0.5} tip="Средняя цена одного перехода на ваш сайт/карточку" />
              : <><Field label="CPM" value={cpm} onChange={setCpm} suffix="₽" step={5} tip="Стоимость 1000 показов объявления" /><Field label="CTR" value={ctr} onChange={setCtr} suffix="%" step={0.1} tip="Процент людей, кликнувших по объявлению" /></>}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: INK, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Конверсия и экономика</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Конверсия сайта" value={convRate} onChange={setConvRate} suffix="%" step={0.1} tip="Процент посетителей, которые делают заказ. Средний для e-commerce: 1–3%" />
            <Field label="Средний чек (AOV)" value={aov} onChange={setAov} suffix="₽" step={100} tip="Average Order Value — средняя сумма одного заказа" />
            <Field label="Себестоимость (COGS)" value={cogsP} onChange={setCogsP} suffix="%" step={1} tip="Процент себестоимости от выручки. Если товар за 1000₽ стоит вам 400₽, COGS = 40%" />
            <Field label="Процент возвратов" value={retRate} onChange={setRetRate} suffix="%" step={0.5} tip="Сколько заказов возвращают покупатели. Электроника: 3–8%, одежда: 15–30%" />
            <Field label="Повторных покупок/клиент" value={repeat} onChange={setRepeat} suffix="×" step={0.1} tip="Сколько раз в среднем один клиент покупает за всё время (для расчёта LTV)" />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: ok ? '#F0FDF4' : '#FEF2F2', border: `2px solid ${ok ? '#BBF7D0' : '#FECACA'}`, borderRadius: 20, padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: ok ? '#15803D' : '#DC2626', margin: '0 0 4px', textTransform: 'uppercase' }}>{ok ? '✓ Кампания прибыльна' : '✗ Кампания убыточна'}</p>
          <p style={{ fontSize: 40, fontWeight: 800, color: ok ? '#15803D' : '#DC2626', margin: '0 0 4px', fontVariantNumeric: 'tabular-nums' }}>{ok ? '+' : ''}{fmt(r.profit)} ₽</p>
          <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>маржа {fmt(r.margin, 1)}% · ROAS {fmt(r.roas, 2)}×</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Stat label="CAC" value={fmt(r.cac)} tip="Cost per Acquisition — сколько стоит один заказ из рекламы" color={r.cac < aov * 0.3 ? GREEN : r.cac < aov ? INK : RED} />
          <Stat label="ROAS" value={fmt(r.roas, 2)} unit="×" tip="Return on Ad Spend — сколько рублей выручки на каждый рубль рекламы. Норма: 3–5×" color={r.roas >= 3 ? GREEN : r.roas >= 1 ? INK : RED} />
          <Stat label="LTV" value={fmt(r.ltv)} tip="Lifetime Value — сколько прибыли принесёт один клиент за всё время" color={BLUE} />
          <Stat label="Кликов" value={fmt(r.clicks, 0)} unit="шт" tip="Ожидаемое количество переходов на ваш сайт/карточку" color={INK} />
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: INK, margin: '0 0 12px' }}>Воронка продаж</p>
          {[
            { l: 'Кликов', v: fmt(r.clicks, 0) + ' шт' },
            { l: 'Заказов', v: fmt(r.orders, 0) + ` шт (CR ${convRate}%)` },
            { l: 'Чистых заказов', v: fmt(r.orders * (1 - retRate / 100), 0) + ' шт' },
            { l: 'Выручка', v: fmt(r.grossRev) + ' ₽' },
            { l: 'Прибыль', v: (r.profit >= 0 ? '+' : '') + fmt(r.profit) + ' ₽' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 4 ? `1px solid ${BORDER}` : 'none', fontSize: 13 }}>
              <span style={{ color: MUTED }}>{row.l}</span>
              <span style={{ fontWeight: 700, color: INK }}>{row.v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: INK, margin: '0 0 10px' }}>Точка безубыточности</p>
          <p style={{ fontSize: 13, color: MUTED, margin: '0 0 8px' }}>Нужно минимум <strong style={{ color: INK }}>{fmt(r.beOrders, 0)} заказов</strong>, чтобы не работать в минус</p>
          <div style={{ height: 8, background: BORDER, borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, background: ok ? LIME : '#FCA5A5', width: `${Math.min(r.orders / Math.max(r.beOrders, 0.01) * 100, 100)}%`, transition: 'width 300ms' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginTop: 4 }}>
            <span>Текущие: {fmt(r.orders, 0)}</span><span>Нужно: {fmt(r.beOrders, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
