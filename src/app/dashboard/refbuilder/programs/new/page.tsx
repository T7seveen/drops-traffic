'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePrograms } from '@/lib/refbuilder/store'
import type { CommissionType } from '@/lib/refbuilder/types'

type Step = 1 | 2 | 3 | 4

const STEPS = ['Основное', 'Условия', 'Настройки', 'Готово']

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 12, color: '#94A3B8', margin: '6px 0 0' }}>{hint}</p>}
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#0F172A', background: '#fff' }

export default function NewProgramPage() {
  const router = useRouter()
  const { createProgram } = usePrograms()
  const [step, setStep] = useState<Step>(1)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [commissionType, setCommissionType] = useState<CommissionType>('percent')
  const [commissionValue, setCommissionValue] = useState(10)
  const [holdDays, setHoldDays] = useState(14)
  const [cookieDays, setCookieDays] = useState(60)
  const [maxPartners, setMaxPartners] = useState('')
  const [tier2Enabled, setTier2Enabled] = useState(false)
  const [tier2Commission, setTier2Commission] = useState(3)
  const [promoEnabled, setPromoEnabled] = useState(true)
  const [vanityEnabled, setVanityEnabled] = useState(true)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [created, setCreated] = useState<{ id: string; name: string } | null>(null)

  function toSlug(v: string) {
    return v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function handleCreate() {
    const prog = createProgram({
      name, slug, description,
      commission_type: commissionType,
      commission_value: commissionValue,
      hold_days: holdDays,
      cookie_days: cookieDays,
      max_partners: maxPartners ? Number(maxPartners) : null,
      status: 'active',
      tier2_enabled: tier2Enabled,
      tier2_commission: tier2Commission,
      webhook_url: webhookUrl,
      promo_code_enabled: promoEnabled,
      vanity_links_enabled: vanityEnabled,
    })
    setCreated({ id: prog.id, name: prog.name })
    setStep(4)
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/dashboard/refbuilder/programs" style={{ fontSize: 13, color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          ← Программы
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>Новая программа</h1>
      </div>

      {/* Steps indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 36 }}>
        {STEPS.map((s, i) => {
          const n = (i + 1) as Step
          const done = step > n
          const active = step === n
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: done ? '#A3E635' : active ? '#0F172A' : '#E2E8F0',
                  color: done ? '#0F172A' : active ? '#fff' : '#94A3B8',
                }}>{done ? '✓' : n}</div>
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? '#0F172A' : '#94A3B8', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: done ? '#A3E635' : '#E2E8F0', margin: '0 12px' }} />}
            </div>
          )
        })}
      </div>

      {/* Step 1: Basic */}
      {step === 1 && (
        <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>Основная информация</h2>
          <Field label="Название программы *">
            <input value={name} onChange={e => { setName(e.target.value); if (!slug || slug === toSlug(name)) setSlug(toSlug(e.target.value)) }} placeholder="Основная партнёрская программа" style={inputStyle} />
          </Field>
          <Field label="URL-идентификатор *" hint="Используется в ссылках: drops-traffic.vercel.app/r/{slug}/...">
            <input value={slug} onChange={e => setSlug(toSlug(e.target.value))} placeholder="main-program" style={inputStyle} />
          </Field>
          <Field label="Описание для партнёров" hint="Отображается в партнёрском кабинете">
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Рекомендуйте наш магазин и получайте..." style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button disabled={!name || !slug} onClick={() => setStep(2)} style={{ padding: '11px 24px', borderRadius: 10, background: (!name || !slug) ? '#E2E8F0' : '#0F172A', color: (!name || !slug) ? '#94A3B8' : '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: (!name || !slug) ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              Далее →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Commission */}
      {step === 2 && (
        <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>Условия вознаграждения</h2>
          <Field label="Тип комиссии">
            <div style={{ display: 'flex', gap: 12 }}>
              {(['percent', 'fixed'] as CommissionType[]).map(t => (
                <button key={t} onClick={() => setCommissionType(t)} style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: `2px solid ${commissionType === t ? '#A3E635' : '#E2E8F0'}`,
                  background: commissionType === t ? '#F0FDF4' : '#fff', fontFamily: 'inherit', cursor: 'pointer',
                  fontWeight: commissionType === t ? 700 : 400, fontSize: 14, color: '#0F172A',
                }}>
                  {t === 'percent' ? '% от суммы заказа' : 'Фиксированная сумма (₽)'}
                </button>
              ))}
            </div>
          </Field>
          <Field label={commissionType === 'percent' ? 'Размер комиссии (%)' : 'Сумма вознаграждения (₽)'}>
            <input type="number" value={commissionValue} onChange={e => setCommissionValue(Number(e.target.value))} min={commissionType === 'percent' ? 1 : 50} max={commissionType === 'percent' ? 70 : 100000} style={{ ...inputStyle, width: 160 }} />
          </Field>
          <div style={{ background: '#F0FDF4', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#15803D' }}>
            Партнёр получит: {commissionType === 'percent' ? `${commissionValue}% от суммы каждого заказа` : `${commissionValue} ₽ за каждый новый заказ`}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Холд-период (дней)" hint="Ожидание перед начислением">
              <input type="number" min={0} max={90} value={holdDays} onChange={e => setHoldDays(Number(e.target.value))} style={inputStyle} />
            </Field>
            <Field label="Срок cookie (дней)" hint="Атрибуция клика">
              <input type="number" min={1} max={365} value={cookieDays} onChange={e => setCookieDays(Number(e.target.value))} style={inputStyle} />
            </Field>
          </div>
          <Field label="Макс. партнёров" hint="Оставьте пустым — без ограничений">
            <input type="number" min={1} value={maxPartners} onChange={e => setMaxPartners(e.target.value)} placeholder="Без лимита" style={{ ...inputStyle, width: 160 }} />
          </Field>

          {/* Tier 2 */}
          <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: tier2Enabled ? 16 : 0 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Двухуровневая программа</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Партнёры зарабатывают с продаж привлечённых ими партнёров</div>
              </div>
              <button onClick={() => setTier2Enabled(!tier2Enabled)} style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: tier2Enabled ? '#A3E635' : '#E2E8F0', cursor: 'pointer', position: 'relative', transition: 'background 200ms' }}>
                <div style={{ position: 'absolute', top: 3, left: tier2Enabled ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 200ms' }} />
              </button>
            </div>
            {tier2Enabled && (
              <Field label="Комиссия 2-го уровня (%)" hint="% от суммы конверсии суб-партнёра">
                <input type="number" min={1} max={20} value={tier2Commission} onChange={e => setTier2Commission(Number(e.target.value))} style={{ ...inputStyle, width: 120 }} />
              </Field>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button onClick={() => setStep(1)} style={{ padding: '11px 20px', borderRadius: 10, background: 'none', border: '1.5px solid #E2E8F0', color: '#64748B', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>← Назад</button>
            <button onClick={() => setStep(3)} style={{ padding: '11px 24px', borderRadius: 10, background: '#0F172A', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Далее →</button>
          </div>
        </div>
      )}

      {/* Step 3: Settings */}
      {step === 3 && (
        <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>Дополнительные настройки</h2>
          {[
            { label: 'Промо-коды партнёров', desc: 'Каждый партнёр получает уникальный промо-код', val: promoEnabled, set: setPromoEnabled },
            { label: 'Кастомные ссылки (vanity)', desc: 'Партнёры могут задать читаемый URL для своей ссылки', val: vanityEnabled, set: setVanityEnabled },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #F8FAFC' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{item.desc}</div>
              </div>
              <button onClick={() => item.set(!item.val)} style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: item.val ? '#A3E635' : '#E2E8F0', cursor: 'pointer', position: 'relative', transition: 'background 200ms', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 3, left: item.val ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 200ms' }} />
              </button>
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <Field label="Webhook URL" hint="POST-запрос при каждой конверсии. Оставьте пустым, если не нужен.">
              <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://yoursite.com/webhook/referral" style={inputStyle} />
            </Field>
          </div>

          {/* Summary */}
          <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, marginTop: 8, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>Итоговые параметры</div>
            {[
              ['Название', name],
              ['Комиссия', commissionType === 'percent' ? `${commissionValue}%` : `${commissionValue} ₽`],
              ['Холд', `${holdDays} дней`],
              ['Cookie', `${cookieDays} дней`],
              ['2-й уровень', tier2Enabled ? `${tier2Commission}%` : 'Отключён'],
              ['Промо-коды', promoEnabled ? 'Да' : 'Нет'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>{k}</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button onClick={() => setStep(2)} style={{ padding: '11px 20px', borderRadius: 10, background: 'none', border: '1.5px solid #E2E8F0', color: '#64748B', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>← Назад</button>
            <button onClick={handleCreate} style={{ padding: '11px 28px', borderRadius: 10, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Создать программу ✓</button>
          </div>
        </div>
      )}

      {/* Step 4: Done */}
      {step === 4 && created && (
        <div style={{ background: '#fff', border: '1.5px solid #A3E635', borderRadius: 16, padding: 40, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Программа создана!</h2>
          <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 28px' }}>«{created.name}» активна и готова к приёму партнёров</p>
          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '12px 16px', marginBottom: 28, textAlign: 'left' }}>
            <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>Ссылка для приглашения партнёров:</div>
            <code style={{ fontSize: 13, color: '#0F172A' }}>https://drops-traffic.vercel.app/r/invite/{slug}</code>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href={`/dashboard/refbuilder/programs/${created.id}`} style={{ padding: '11px 22px', borderRadius: 10, background: '#0F172A', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Открыть программу</Link>
            <Link href="/dashboard/refbuilder/programs" style={{ padding: '11px 22px', borderRadius: 10, border: '1.5px solid #E2E8F0', color: '#0F172A', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Все программы</Link>
          </div>
        </div>
      )}
    </div>
  )
}
