'use client'
import { use, useState } from 'react'
import Link from 'next/link'
import { usePrograms, usePartners } from '@/lib/refbuilder/store'

function SparkBars({ daily }: { daily: { date: string; clicks: number; conversions: number }[] }) {
  const last14 = daily.slice(-14)
  const maxClicks = Math.max(...last14.map(d => d.clicks), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 48 }}>
      {last14.map((d, i) => (
        <div key={i} title={`${d.date}: ${d.clicks} кликов, ${d.conversions} конверсий`} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', background: '#DBEAFE', borderRadius: 3, height: `${(d.clicks / maxClicks) * 36}px` }} />
          <div style={{ width: '100%', background: '#A3E635', borderRadius: 3, height: `${Math.min((d.conversions / maxClicks) * 36 * 3, 8)}px` }} />
        </div>
      ))}
    </div>
  )
}

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { programs, updateProgram } = usePrograms()
  const { partners, invitePartner, updatePartner } = usePartners(id)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'stats' | 'partners' | 'embed' | 'settings'>('stats')
  const [copied, setCopied] = useState('')

  const prog = programs.find(p => p.id === id)
  if (!prog) return <div style={{ padding: 40 }}>Программа не найдена. <Link href="/dashboard/refbuilder/programs">← Назад</Link></div>

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    const partner = invitePartner({ name: inviteName, email: inviteEmail, program_id: id, program_slug: prog.slug })
    setInviteSuccess(`Партнёр приглашён! Ссылка: /r/${partner.code}`)
    setInviteName(''); setInviteEmail('')
    setInviting(false)
    setTimeout(() => setInviteSuccess(''), 5000)
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(''), 2000) })
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://drops-traffic.vercel.app'
  const embedCode = `<script src="${baseUrl}/ref-widget.js" data-program="${prog.slug}"></script>`

  const tabs = [
    { key: 'stats', label: 'Статистика' },
    { key: 'partners', label: `Партнёры (${partners.length})` },
    { key: 'embed', label: 'Встройте виджет' },
    { key: 'settings', label: 'Настройки' },
  ]

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/dashboard/refbuilder/programs" style={{ fontSize: 13, color: '#64748B', textDecoration: 'none' }}>← Программы</Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>{prog.name}</h1>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
              background: prog.status === 'active' ? '#F0FDF4' : '#FFF7ED',
              color: prog.status === 'active' ? '#15803D' : '#92400E',
            }}>{prog.status === 'active' ? 'Активна' : 'Пауза'}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => copy(`${baseUrl}/r/invite/${prog.slug}`, 'invite')} style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: '#fff', fontSize: 12, fontWeight: 600, color: '#0F172A', cursor: 'pointer', fontFamily: 'inherit' }}>
              {copied === 'invite' ? '✓ Скопировано' : '🔗 Ссылка для партнёров'}
            </button>
            <button onClick={() => updateProgram(id, { status: prog.status === 'active' ? 'paused' : 'active' })} style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: '#fff', fontSize: 12, fontWeight: 600, color: prog.status === 'active' ? '#92400E' : '#15803D', cursor: 'pointer', fontFamily: 'inherit' }}>
              {prog.status === 'active' ? 'Приостановить' : 'Активировать'}
            </button>
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Всего кликов', value: prog.stats.total_clicks.toLocaleString('ru'), accent: '#3B82F6' },
          { label: 'Конверсий', value: `${prog.stats.total_conversions} (${prog.stats.conversion_rate}%)`, accent: '#0F172A' },
          { label: 'Выручка', value: `${(prog.stats.total_revenue / 1000).toFixed(0)}K ₽`, accent: '#0F172A' },
          { label: 'К выплате', value: `${prog.stats.pending_commission.toLocaleString('ru')} ₽`, accent: '#F59E0B' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.accent }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid #E2E8F0', marginBottom: 24 }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} style={{
            padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 500,
            color: activeTab === tab.key ? '#0F172A' : '#64748B',
            borderBottom: activeTab === tab.key ? '2px solid #A3E635' : '2px solid transparent',
            marginBottom: -2, fontFamily: 'inherit',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* STATS TAB */}
      {activeTab === 'stats' && (
        <div>
          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Клики и конверсии (14 дней)</h3>
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}><span style={{ width: 10, height: 10, background: '#DBEAFE', borderRadius: 2, display: 'inline-block' }}/>Клики</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}><span style={{ width: 10, height: 10, background: '#A3E635', borderRadius: 2, display: 'inline-block' }}/>Конверсии</span>
              </div>
            </div>
            <SparkBars daily={prog.daily} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Top sources */}
            <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Лучшие партнёры</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {partners.filter(p => p.status === 'active').sort((a, b) => b.stats.revenue - a.stats.revenue).slice(0, 5).map(p => {
                  const maxRev = Math.max(...partners.map(x => x.stats.revenue), 1)
                  return (
                    <div key={p.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                        <span style={{ fontWeight: 600, color: '#0F172A' }}>{p.name}</span>
                        <span style={{ color: '#65A30D', fontWeight: 700 }}>{(p.stats.commission / 1000).toFixed(1)}K ₽</span>
                      </div>
                      <div style={{ height: 4, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(p.stats.revenue / maxRev) * 100}%`, background: 'linear-gradient(90deg, #A3E635, #3B82F6)', borderRadius: 4 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Conversion funnel */}
            <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Воронка конверсий</h3>
              {[
                { label: 'Уникальные клики', value: Math.floor(prog.stats.total_clicks * 0.82), pct: 100 },
                { label: 'Перешли на сайт', value: prog.stats.total_clicks, pct: 100 },
                { label: 'Добавили в корзину', value: Math.floor(prog.stats.total_conversions * 2.8), pct: Math.floor(prog.stats.total_conversions * 2.8 / prog.stats.total_clicks * 100) },
                { label: 'Оформили заказ', value: prog.stats.total_conversions, pct: Math.round(prog.stats.conversion_rate) },
              ].map((s, i) => (
                <div key={s.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#64748B' }}>{s.label}</span>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{s.value.toLocaleString('ru')}</span>
                  </div>
                  <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.pct}%`, background: i === 3 ? '#A3E635' : '#DBEAFE', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PARTNERS TAB */}
      {activeTab === 'partners' && (
        <div>
          {/* Invite form */}
          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Пригласить партнёра</h3>
            {inviteSuccess && <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#15803D' }}>{inviteSuccess}</div>}
            <form onSubmit={handleInvite} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Имя партнёра" required style={{ flex: 1, minWidth: 160, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Email партнёра" type="email" required style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              <button type="submit" disabled={inviting} style={{ padding: '10px 20px', borderRadius: 10, background: '#A3E635', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#0F172A' }}>
                {inviting ? '...' : 'Пригласить'}
              </button>
            </form>
          </div>

          {/* Partners table */}
          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Партнёр', 'Код / ссылка', 'Клики', 'CR', 'Комиссия', 'Статус', ''].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {partners.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom: i < partners.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>{p.email}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <code style={{ fontSize: 12, color: '#64748B', background: '#F8FAFC', padding: '3px 8px', borderRadius: 6 }}>{p.vanity || p.code}</code>
                          <button onClick={() => copy(`${baseUrl}/r/${p.code}`, p.id)} style={{ fontSize: 11, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                            {copied === p.id ? '✓' : '📋'}
                          </button>
                        </div>
                        {p.promo_code && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>промо: {p.promo_code}</div>}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{p.stats.clicks.toLocaleString('ru')}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{p.stats.conversion_rate.toFixed(1)}%</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#65A30D' }}>{p.stats.commission.toLocaleString('ru')} ₽</div>
                        <div style={{ fontSize: 11, color: '#F59E0B' }}>{p.stats.pending_commission.toLocaleString('ru')} ₽ ожидает</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                          background: p.status === 'active' ? '#F0FDF4' : p.status === 'pending' ? '#FFF7ED' : '#FEF2F2',
                          color: p.status === 'active' ? '#15803D' : p.status === 'pending' ? '#92400E' : '#991B1B',
                        }}>{p.status === 'active' ? 'Активен' : p.status === 'pending' ? 'Ожидает' : 'Отключён'}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {p.status === 'pending' && (
                          <button onClick={() => updatePartner(p.id, { status: 'active' })} style={{ fontSize: 12, fontWeight: 700, color: '#15803D', background: '#F0FDF4', border: 'none', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Одобрить
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {partners.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>Партнёры пока не добавлены</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EMBED TAB */}
      {activeTab === 'embed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>JavaScript-виджет</h3>
            <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 16px' }}>Вставьте в свой сайт перед закрывающим тегом {'</body>'}. Виджет автоматически отслеживает клики и конверсии.</p>
            <div style={{ background: '#0F172A', borderRadius: 12, padding: '16px 20px', position: 'relative' }}>
              <code style={{ fontSize: 12, color: '#A3E635', fontFamily: 'monospace', display: 'block', overflowX: 'auto', whiteSpace: 'pre' }}>{embedCode}</code>
              <button onClick={() => copy(embedCode, 'embed')} style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                {copied === 'embed' ? '✓ Скопировано' : 'Копировать'}
              </button>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>API: регистрация конверсии</h3>
            <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 16px' }}>Отправьте POST-запрос при оформлении заказа, чтобы зарегистрировать конверсию.</p>
            <div style={{ background: '#0F172A', borderRadius: 12, padding: '16px 20px' }}>
              <pre style={{ fontSize: 12, color: '#A3E635', fontFamily: 'monospace', margin: 0, overflowX: 'auto' }}>{`POST /api/refbuilder/convert
Content-Type: application/json

{
  "program": "${prog.slug}",
  "partner_code": "PARTNER_CODE",
  "order_id": "ORDER_123",
  "order_value": 2990
}`}</pre>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Инструкции для партнёров</h3>
            <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 16px' }}>Поделитесь этим текстом с вашими партнёрами:</p>
            <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '16px 20px', fontSize: 14, color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {`1. Перейдите по ссылке: ${baseUrl}/r/invite/${prog.slug}
2. Получите вашу персональную реферальную ссылку
3. Размещайте ссылку в своём блоге, Telegram-канале или соцсетях
4. Отслеживайте статистику в личном кабинете партнёра
5. Получайте ${prog.commission_type === 'percent' ? prog.commission_value + '% от каждого заказа' : prog.commission_value + ' ₽ за каждый заказ'} после холда ${prog.hold_days} дней`}
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Параметры программы</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['Тип комиссии', prog.commission_type === 'percent' ? 'Процент от заказа' : 'Фиксированная сумма'],
              ['Размер комиссии', prog.commission_type === 'percent' ? `${prog.commission_value}%` : `${prog.commission_value} ₽`],
              ['Холд-период', `${prog.hold_days} дней`],
              ['Срок cookie', `${prog.cookie_days} дней`],
              ['Макс. партнёров', prog.max_partners ? String(prog.max_partners) : 'Без ограничений'],
              ['2-й уровень', prog.tier2_enabled ? `Да, ${prog.tier2_commission}%` : 'Отключён'],
              ['Промо-коды', prog.promo_code_enabled ? 'Включены' : 'Отключены'],
              ['Кастомные ссылки', prog.vanity_links_enabled ? 'Включены' : 'Отключены'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F8FAFC' }}>
                <span style={{ fontSize: 14, color: '#64748B' }}>{k}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 16, background: '#FEF2F2', borderRadius: 10, border: '1px solid #FECACA' }}>
            <p style={{ fontSize: 13, color: '#991B1B', margin: '0 0 10px', fontWeight: 600 }}>Удалить программу</p>
            <p style={{ fontSize: 13, color: '#DC2626', margin: '0 0 12px' }}>Это действие необратимо. Все данные о партнёрах и конверсиях будут удалены.</p>
            <button style={{ padding: '8px 16px', borderRadius: 8, background: '#EF4444', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Удалить программу</button>
          </div>
        </div>
      )}

      <style>{`@media (max-width: 768px) { div[style*="repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; } div[style*="1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
