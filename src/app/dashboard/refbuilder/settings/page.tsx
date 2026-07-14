'use client'
import { useState } from 'react'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
      <div style={{ padding: '18px 28px', borderBottom: '1px solid #F1F5F9' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: '24px 28px' }}>{children}</div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: hint ? 2 : 8 }}>{label}</label>
      {hint && <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>{hint}</div>}
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [brand, setBrand] = useState('Моя компания')
  const [domain, setDomain] = useState('')
  const [logo, setLogo] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#A3E635')
  const [apiKey] = useState('rbk_live_' + Math.random().toString(36).slice(2, 18))
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyNew, setNotifyNew] = useState(true)
  const [notifyPayout, setNotifyPayout] = useState(true)
  const [payoutMin, setPayoutMin] = useState(1000)
  const [payoutSchedule, setPayoutSchedule] = useState('manual')
  const [bankINN, setBankINN] = useState('')

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 740 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>Настройки</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Бренд, уведомления и параметры выплат</p>
        </div>
        <button onClick={save} style={{ padding: '10px 24px', borderRadius: 10, background: saved ? '#F0FDF4' : '#A3E635', color: saved ? '#15803D' : '#0F172A', fontWeight: 700, fontSize: 13, border: saved ? '1.5px solid #A3E635' : 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 200ms' }}>
          {saved ? '✓ Сохранено' : 'Сохранить'}
        </button>
      </div>

      {/* Brand */}
      <Section title="Брендинг">
        <Field label="Название компании">
          <input value={brand} onChange={e => setBrand(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </Field>
        <Field label="URL логотипа" hint="PNG или SVG, рекомендуется 200×60px">
          <input value={logo} onChange={e => setLogo(e.target.value)} placeholder="https://yoursite.com/logo.png" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </Field>
        <Field label="Основной цвет бренда" hint="Используется в партнёрском портале и письмах">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ width: 48, height: 40, padding: 0, borderRadius: 9, border: '1.5px solid #E2E8F0', cursor: 'pointer' }} />
            <input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'monospace', outline: 'none' }} />
            <div style={{ display: 'flex', gap: 6 }}>
              {['#A3E635', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'].map(c => (
                <div key={c} onClick={() => setPrimaryColor(c)} style={{ width: 24, height: 24, borderRadius: 6, background: c, cursor: 'pointer', border: primaryColor === c ? '2px solid #0F172A' : '2px solid transparent', transition: 'border 100ms' }} />
              ))}
            </div>
          </div>
        </Field>
        <Field label="Пользовательский домен для партнёрского портала" hint="Например: partners.yourstore.ru">
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="partners.yoursite.ru" style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
            <button style={{ padding: '10px 16px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#fff', color: '#0F172A', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Проверить DNS</button>
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 6 }}>Добавьте CNAME запись: <code style={{ background: '#F8FAFC', padding: '1px 6px', borderRadius: 4 }}>cname.refbuilder.io</code></div>
        </Field>
      </Section>

      {/* API */}
      <Section title="API ключ">
        <Field label="Ваш API ключ" hint="Используется для server-side интеграции">
          <div style={{ display: 'flex', gap: 10 }}>
            <code style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 12, background: '#F8FAFC', color: '#64748B', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apiKey}</code>
            <button onClick={() => navigator.clipboard.writeText(apiKey)} style={{ padding: '10px 16px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#fff', color: '#0F172A', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Копировать</button>
            <button style={{ padding: '10px 16px', borderRadius: 10, border: '1.5px solid #FCA5A5', background: '#FEF2F2', color: '#991B1B', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Сбросить</button>
          </div>
        </Field>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>Не передавайте ключ третьим лицам. При компрометации немедленно сбросьте.</div>
      </Section>

      {/* Notifications */}
      <Section title="Уведомления">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'notifyEmail', label: 'Email-уведомления', desc: 'Получать уведомления на email', val: notifyEmail, set: setNotifyEmail },
            { key: 'notifyNew', label: 'Новый партнёр', desc: 'Уведомлять при регистрации нового участника', val: notifyNew, set: setNotifyNew },
            { key: 'notifyPayout', label: 'Запрос выплаты', desc: 'Уведомлять когда партнёр запрашивает выплату', val: notifyPayout, set: setNotifyPayout },
          ].map(n => (
            <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8FAFC', borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{n.label}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{n.desc}</div>
              </div>
              <div onClick={() => n.set(!n.val)} style={{ width: 44, height: 24, borderRadius: 12, background: n.val ? '#A3E635' : '#E2E8F0', cursor: 'pointer', position: 'relative', transition: 'background 200ms' }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, background: '#fff', position: 'absolute', top: 3, left: n.val ? 23 : 3, transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Payouts */}
      <Section title="Настройки выплат">
        <Field label="Минимальная сумма для выплаты (₽)">
          <input type="number" value={payoutMin} onChange={e => setPayoutMin(Number(e.target.value))} min={100} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </Field>
        <Field label="Расписание выплат">
          <select value={payoutSchedule} onChange={e => setPayoutSchedule(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#0F172A' }}>
            <option value="manual">Ручное одобрение</option>
            <option value="weekly">Автоматически — каждую неделю</option>
            <option value="monthly">Автоматически — каждый месяц</option>
          </select>
        </Field>
        <Field label="ИНН компании (для документов)" hint="Используется в актах выплат партнёрам">
          <input value={bankINN} onChange={e => setBankINN(e.target.value)} placeholder="7700000000" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </Field>
      </Section>

      {/* Danger zone */}
      <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 16, padding: '22px 28px' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#991B1B', margin: '0 0 8px' }}>Опасная зона</h2>
        <p style={{ fontSize: 13, color: '#B91C1C', margin: '0 0 16px' }}>Действия необратимы. Вся история конверсий и данные партнёров будут удалены.</p>
        <button style={{ padding: '9px 20px', borderRadius: 10, border: '1.5px solid #FCA5A5', background: '#fff', color: '#991B1B', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          Удалить все данные ReBuilder
        </button>
      </div>
    </div>
  )
}
