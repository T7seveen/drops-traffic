'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLoyalty } from '@/lib/refbuilder/store'
import type { LoyaltyTier } from '@/lib/refbuilder/types'

const DEFAULT_TIERS: LoyaltyTier[] = [
  { name: 'Базовый', min_spend: 0, multiplier: 1, color: '#94A3B8', discount_percent: 0, cashback_bonus: 0, benefits: [] },
  { name: 'Серебро', min_spend: 5000, multiplier: 1.5, color: '#64748B', discount_percent: 3, cashback_bonus: 1, benefits: [] },
  { name: 'Золото', min_spend: 20000, multiplier: 2, color: '#F59E0B', discount_percent: 5, cashback_bonus: 3, benefits: [] },
  { name: 'Платина', min_spend: 50000, multiplier: 3, color: '#6366F1', discount_percent: 10, cashback_bonus: 5, benefits: [] },
]

export default function NewLoyaltyPage() {
  const router = useRouter()
  const { createProgram } = useLoyalty()
  const [step, setStep] = useState(1)
  const [type, setType] = useState<'points' | 'cashback'>('points')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [pointsPer100, setPointsPer100] = useState(10)
  const [pointValue, setPointValue] = useState(0.1)
  const [cashback, setCashback] = useState(3)
  const [tiers, setTiers] = useState(DEFAULT_TIERS)
  const [expireDays, setExpireDays] = useState(365)
  const [minRedeem, setMinRedeem] = useState(100)
  const [done, setDone] = useState(false)

  function submit() {
    createProgram({
      name,
      description,
      type,
      points_per_100_rub: pointsPer100,
      rub_per_point: Math.round(1 / pointValue),
      cashback_percent: cashback,
      tiers,
      point_expiry_days: expireDays || null,
      min_redeem_points: minRedeem,
      status: 'active',
    })
    setDone(true)
  }

  if (done) {
    return (
      <div style={{ padding: '64px 36px', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>Программа создана!</h1>
        <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 32px' }}>«{name}» готова к запуску. Начните привлекать клиентов.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => router.push('/dashboard/refbuilder/loyalty')} style={{ padding: '11px 24px', borderRadius: 10, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>К списку программ</button>
          <button onClick={() => { setDone(false); setStep(1); setName(''); }} style={{ padding: '11px 20px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#fff', color: '#0F172A', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Ещё одну</button>
        </div>
      </div>
    )
  }

  const steps = ['Тип программы', 'Настройки начисления', 'Уровни участников', 'Готово']

  return (
    <div style={{ padding: '32px 36px', maxWidth: 700 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 20px' }}>Создать программу лояльности</h1>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: i + 1 < step ? '#A3E635' : i + 1 === step ? '#0F172A' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: i + 1 < step ? '#0F172A' : i + 1 === step ? '#fff' : '#94A3B8', flexShrink: 0 }}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: i + 1 === step ? '#0F172A' : '#94A3B8', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: i + 1 < step ? '#A3E635' : '#E2E8F0', margin: '0 12px' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 18, padding: '28px 32px' }}>
        {/* Step 1: Type */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>Тип программы лояльности</h2>
            <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 24px' }}>Выберите механику начисления вознаграждений</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              {[
                { value: 'points', icon: '🎯', title: 'Бонусные баллы', desc: 'Клиенты накапливают баллы и тратят их на скидки. Гибкая система уровней с множителями.' },
                { value: 'cashback', icon: '💳', title: 'Кешбэк', desc: 'Процент от каждой покупки возвращается на счёт. Простая и понятная механика.' },
              ].map(opt => (
                <div key={opt.value} onClick={() => setType(opt.value as 'points' | 'cashback')} style={{ border: `2px solid ${type === opt.value ? '#A3E635' : '#E2E8F0'}`, borderRadius: 14, padding: '22px', cursor: 'pointer', background: type === opt.value ? '#F7FEE7' : '#fff', transition: 'all 150ms' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{opt.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{opt.title}</div>
                  <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{opt.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 8 }}>Название программы</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Например: Бонусная карта Любимый" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 8 }}>Описание (необязательно)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Коротко о программе для клиентов" rows={2} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
          </div>
        )}

        {/* Step 2: Accrual settings */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>Настройки начисления</h2>
            <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 24px' }}>Задайте правила вознаграждения клиентов</p>
            {type === 'points' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 8 }}>Баллов за каждые 100 ₽</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input type="range" min={1} max={50} value={pointsPer100} onChange={e => setPointsPer100(Number(e.target.value))} style={{ flex: 1 }} />
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', minWidth: 40, textAlign: 'right' }}>{pointsPer100}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>При покупке 1000₽ клиент получит {pointsPer100 * 10} баллов</div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 8 }}>Стоимость 1 балла (₽)</label>
                  <input type="number" value={pointValue} onChange={e => setPointValue(Number(e.target.value))} min={0.01} step={0.01} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>100 баллов = {(100 * pointValue).toFixed(0)} ₽ скидки</div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 8 }}>Минимум для списания (баллов)</label>
                  <input type="number" value={minRedeem} onChange={e => setMinRedeem(Number(e.target.value))} min={1} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 8 }}>Срок действия баллов (дней, 0 = бессрочно)</label>
                  <input type="number" value={expireDays} onChange={e => setExpireDays(Number(e.target.value))} min={0} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              </div>
            ) : (
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 8 }}>Процент кешбэка</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <input type="range" min={1} max={30} value={cashback} onChange={e => setCashback(Number(e.target.value))} style={{ flex: 1 }} />
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#65A30D', minWidth: 50, textAlign: 'right' }}>{cashback}%</div>
                </div>
                <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '14px 18px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 13, color: '#64748B' }}>При покупке <strong>1 000 ₽</strong> клиент получит <strong style={{ color: '#65A30D' }}>{(1000 * cashback / 100).toFixed(0)} ₽</strong> кешбэка</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Tiers */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>Уровни участников</h2>
            <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 24px' }}>Настройте пороги перехода между уровнями</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tiers.map((tier, i) => (
                <div key={tier.name} style={{ background: '#F8FAFC', borderRadius: 12, padding: '16px 20px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '100px 1fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 18 }}>{{ 'Базовый': '🎫', 'Серебро': '🥈', 'Золото': '🥇', 'Платина': '💎' }[tier.name] || '🎫'}</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: tier.color }}>{tier.name}</span>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Порог (₽)</label>
                    <input type="number" value={tier.min_spend} onChange={e => setTiers(tiers.map((t, j) => j === i ? { ...t, min_spend: Number(e.target.value) } : t))} disabled={i === 0} style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', background: i === 0 ? '#F1F5F9' : '#fff', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Множитель</label>
                    <input type="number" value={tier.multiplier} onChange={e => setTiers(tiers.map((t, j) => j === i ? { ...t, multiplier: Number(e.target.value) } : t))} step={0.5} min={1} style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Скидка %</label>
                    <input type="number" value={tier.discount_percent} onChange={e => setTiers(tiers.map((t, j) => j === i ? { ...t, discount_percent: Number(e.target.value) } : t))} min={0} max={50} style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} style={{ padding: '10px 22px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#fff', color: '#0F172A', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>← Назад</button>
        ) : <div />}
        {step < 3 ? (
          <button onClick={() => setStep(step + 1)} disabled={step === 1 && !name.trim()} style={{ padding: '10px 24px', borderRadius: 10, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 14, border: 'none', cursor: step === 1 && !name.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: step === 1 && !name.trim() ? 0.5 : 1 }}>Далее →</button>
        ) : (
          <button onClick={submit} style={{ padding: '10px 28px', borderRadius: 10, background: '#0F172A', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Создать программу</button>
        )}
      </div>
    </div>
  )
}
