'use client'
import { use, useState, useEffect } from 'react'
import { getPartnerByCode, getProgramById } from '@/lib/refbuilder/store'
import type { Partner, Program } from '@/lib/refbuilder/types'
import Link from 'next/link'

function QRPlaceholder({ value }: { value: string }) {
  const cells = Array.from({ length: 21 }, (_, r) =>
    Array.from({ length: 21 }, (_, c) => {
      const finder = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7)
      const inner = (r >= 2 && r <= 4 && c >= 2 && c <= 4) || (r >= 2 && r <= 4 && c >= 15 && c <= 17) || (r >= 15 && r <= 17 && c >= 2 && c <= 4)
      const data = (r + c + value.length) % 3 === 0
      return finder || inner || data
    })
  )
  return (
    <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(21, 6px)', gap: 1, padding: 10, background: '#fff', borderRadius: 10 }}>
      {cells.flat().map((on, i) => <div key={i} style={{ width: 6, height: 6, background: on ? '#0F172A' : 'transparent', borderRadius: 1 }} />)}
    </div>
  )
}

export default function PartnerPortal({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [partner, setPartner] = useState<Partner | null>(null)
  const [program, setProgram] = useState<Program | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedPromo, setCopiedPromo] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'payouts'>('overview')

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://drops-traffic.vercel.app'
  const refLink = `${baseUrl}/r/${code}`

  useEffect(() => {
    const p = getPartnerByCode(code)
    setPartner(p || null)
    if (p) {
      const prog = getProgramById(p.program_id)
      setProgram(prog || null)
    }
  }, [code])

  if (!partner) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Партнёр не найден</h1>
          <p style={{ color: '#64748B', marginBottom: 20 }}>Ссылка недействительна или истёк срок действия</p>
          <Link href="/" style={{ padding: '10px 22px', borderRadius: 10, background: '#A3E635', color: '#0F172A', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>На главную</Link>
        </div>
      </div>
    )
  }

  const TIERS: Record<string, { label: string; color: string; icon: string }> = {
    vip: { label: 'VIP', color: '#15803D', icon: '💎' },
    top: { label: 'Топ партнёр', color: '#2563EB', icon: '⭐' },
    standard: { label: 'Стандарт', color: '#64748B', icon: '🔗' },
  }
  const tier = TIERS[partner.tier] || TIERS.standard

  const stats30d = (partner.daily || []).slice(-30)
  const clicks30d = stats30d.reduce((s, d) => s + d.clicks, 0)
  const conv30d = stats30d.reduce((s, d) => s + d.conversions, 0)

  function copyLink() {
    navigator.clipboard.writeText(refLink).then(() => { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000) })
  }
  function copyPromo() {
    if (partner.promo_code) navigator.clipboard.writeText(partner.promo_code).then(() => { setCopiedPromo(true); setTimeout(() => setCopiedPromo(false), 2000) })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#0F172A', padding: '0 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#A3E635' }}>RefBuilder</div>
            <span style={{ color: '#334155', fontSize: 12 }}>/</span>
            <span style={{ color: '#94A3B8', fontSize: 13 }}>Партнёрский кабинет</span>
          </div>
          <div style={{ fontSize: 13, color: '#64748B' }}>Привет, {partner.name.split(' ')[0]}!</div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px' }}>
        {/* Partner card */}
        <div style={{ background: '#0F172A', borderRadius: 20, padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 200, height: 200, borderRadius: '50%', background: '#A3E63515' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: '#A3E635', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: '#0F172A' }}>{partner.name[0]}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{partner.name}</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 11 }}>{tier.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: tier.color }}>{tier.label}</span>
                  </div>
                </div>
              </div>
              {program && <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 8 }}>Программа: <span style={{ color: '#fff', fontWeight: 600 }}>{program.name}</span></div>}
              {program && <div style={{ fontSize: 13, color: '#94A3B8' }}>Комиссия: <span style={{ color: '#A3E635', fontWeight: 700 }}>{program.commission_type === 'percent' ? `${program.commission_value}%` : `${program.commission_value} ₽`}</span> с каждой продажи</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 180 }}>
              <div style={{ background: '#1E293B', borderRadius: 14, padding: '14px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#A3E635' }}>{partner.stats.pending_commission.toLocaleString('ru')} ₽</div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Доступно к выплате</div>
              </div>
              <div style={{ background: '#1E293B', borderRadius: 14, padding: '14px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{partner.stats.commission.toLocaleString('ru')} ₽</div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Выплачено всего</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ref link */}
        <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '22px 26px', marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Ваша реферальная ссылка</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: '#F8FAFC', border: '1.5px solid #E2E8F0', fontSize: 13, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {refLink}
            </div>
            <button onClick={copyLink} style={{ padding: '10px 20px', borderRadius: 10, background: copiedLink ? '#F0FDF4' : '#A3E635', color: copiedLink ? '#15803D' : '#0F172A', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', minWidth: 110 }}>
              {copiedLink ? '✓ Скопировано' : 'Копировать'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {partner.promo_code && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Промокод:</span>
                <code style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', background: '#F1F5F9', padding: '4px 12px', borderRadius: 8 }}>{partner.promo_code}</code>
                <button onClick={copyPromo} style={{ fontSize: 12, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>{copiedPromo ? '✓' : 'Копировать'}</button>
              </div>
            )}
            {partner.vanity && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Красивая ссылка:</span>
                <code style={{ fontSize: 12, color: '#64748B', background: '#F8FAFC', padding: '3px 8px', borderRadius: 6 }}>/{partner.vanity}</code>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#F8FAFC', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {[
            { key: 'overview', label: 'Обзор' },
            { key: 'materials', label: 'Материалы' },
            { key: 'payouts', label: 'Выплаты' },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key as 'overview' | 'materials' | 'payouts')} style={{ padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: activeTab === t.key ? '#fff' : 'transparent', color: activeTab === t.key ? '#0F172A' : '#94A3B8', boxShadow: activeTab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
              {[
                { label: 'Переходов за 30 дней', value: String(clicks30d) },
                { label: 'Конверсий за 30 дней', value: String(conv30d) },
                { label: 'Всего кликов', value: partner.stats.clicks.toLocaleString('ru') },
                { label: 'Всего конверсий', value: String(partner.stats.conversions) },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '16px 18px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.3 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Mini chart */}
            {stats30d.length > 0 && (
              <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '20px 22px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Статистика за 30 дней</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
                  {stats30d.map((d, i) => {
                    const max = Math.max(...stats30d.map(x => x.clicks), 1)
                    const h = Math.max(2, (d.clicks / max) * 56)
                    return <div key={i} title={`${d.date}: ${d.clicks} кликов`} style={{ flex: 1, height: h, background: '#A3E635', borderRadius: '3px 3px 0 0', opacity: 0.8 + (i / stats30d.length) * 0.2 }} />
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: '#94A3B8' }}>30 дней назад</span>
                  <span style={{ fontSize: 10, color: '#94A3B8' }}>Сегодня</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Materials */}
        {activeTab === 'materials' && (
          <div>
            <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '22px 26px', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>QR-код для вашей ссылки</div>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                <QRPlaceholder value={refLink} />
                <div>
                  <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 14px', maxWidth: 320 }}>Распечатайте QR-код и разместите в оффлайн-точках, флаерах или визитках.</p>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>Ссылка в коде: <code style={{ color: '#64748B' }}>{refLink}</code></div>
                  <button style={{ padding: '9px 18px', borderRadius: 9, background: '#0F172A', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Скачать PNG</button>
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '22px 26px' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Готовые тексты для публикации</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { platform: 'Telegram / ВКонтакте', text: `Ребята, советую попробовать этот сервис — реально выручает. Вот моя ссылка: ${refLink} ${partner.promo_code ? `\nПромокод: ${partner.promo_code}` : ''}` },
                  { platform: 'Instagram / Stories', text: `👆 Сохраните ссылку: ${refLink}\n${partner.promo_code ? `Промокод: ${partner.promo_code}` : 'Переходите, не пожалеете!'}` },
                  { platform: 'Отзыв / Комментарий', text: `Пользуюсь уже давно, очень доволен. Если кто хочет попробовать — переходите по ссылке ${refLink}` },
                ].map(item => (
                  <div key={item.platform} style={{ background: '#F8FAFC', borderRadius: 12, padding: '14px 16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>{item.platform}</span>
                      <button onClick={() => navigator.clipboard.writeText(item.text)} style={{ fontSize: 11, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Копировать</button>
                    </div>
                    <div style={{ fontSize: 13, color: '#0F172A', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payouts */}
        {activeTab === 'payouts' && (
          <div>
            <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '22px 26px', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Запросить выплату</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div style={{ background: '#F7FEE7', border: '1.5px solid #A3E635', borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#65A30D' }}>{partner.stats.pending_commission.toLocaleString('ru')} ₽</div>
                  <div style={{ fontSize: 12, color: '#4D7C0F', fontWeight: 600 }}>Доступно к выплате</div>
                </div>
                <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A' }}>{partner.stats.commission.toLocaleString('ru')} ₽</div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Выплачено всего</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <select style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#0F172A' }}>
                  <option>Выбрать способ выплаты...</option>
                  <option>Банковская карта</option>
                  <option>Расчётный счёт</option>
                  <option>Криптовалюта (USDT TRC20)</option>
                  <option>ЮMoney</option>
                </select>
                <button disabled={partner.stats.pending_commission < 1000} style={{ padding: '10px 22px', borderRadius: 10, background: partner.stats.pending_commission >= 1000 ? '#0F172A' : '#E2E8F0', color: partner.stats.pending_commission >= 1000 ? '#fff' : '#94A3B8', fontWeight: 700, fontSize: 13, border: 'none', cursor: partner.stats.pending_commission >= 1000 ? 'pointer' : 'not-allowed', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  Запросить выплату
                </button>
              </div>
              {partner.stats.pending_commission < 1000 && (
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>Минимальная сумма для выплаты: 1 000 ₽. Вам не хватает {(1000 - partner.stats.pending_commission).toLocaleString('ru')} ₽</div>
              )}
            </div>

            {program && (
              <div style={{ background: '#F8FAFC', borderRadius: 14, padding: '16px 20px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>Условия программы</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { label: 'Комиссия', value: program.commission_type === 'percent' ? `${program.commission_value}%` : `${program.commission_value} ₽` },
                    { label: 'Холд', value: `${program.hold_days} дней` },
                    { label: 'Cookie', value: `${program.cookie_days} дней` },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{s.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
