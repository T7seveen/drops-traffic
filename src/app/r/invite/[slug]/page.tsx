'use client'
import { use, useState } from 'react'
import { usePrograms, usePartners } from '@/lib/refbuilder/store'

export default function PartnerInvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { programs } = usePrograms()
  const { invitePartner } = usePartners()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [audience, setAudience] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [done, setDone] = useState(false)
  const [partnerCode, setPartnerCode] = useState('')

  const program = programs.find(p => p.slug === slug)

  function submit() {
    if (!program || !name.trim() || !email.trim() || !agreed) return
    const partner = invitePartner({ name: name.trim(), email: email.trim(), program_id: program.id, program_slug: program.slug })
    setPartnerCode(partner.code)
    setDone(true)
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://drops-traffic.vercel.app'

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: 24 }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>Вы в программе!</h1>
            <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 28px' }}>Ваша заявка принята. Вот ваша реферальная ссылка:</p>
            <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '16px 20px', marginBottom: 20, border: '2px solid #A3E635' }}>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 6 }}>Ваша ссылка</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', wordBreak: 'break-all' }}>{baseUrl}/r/{partnerCode}</div>
            </div>
            <button onClick={() => navigator.clipboard.writeText(`${baseUrl}/r/${partnerCode}`)} style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12 }}>
              Копировать ссылку
            </button>
            <a href={`/r/${partnerCode}`} style={{ display: 'block', width: '100%', padding: '12px', borderRadius: 12, border: '1.5px solid #E2E8F0', color: '#0F172A', fontWeight: 600, fontSize: 14, textDecoration: 'none', textAlign: 'center', boxSizing: 'border-box' }}>
              Открыть мой кабинет →
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Программа не найдена</h1>
          <p style={{ color: '#64748B' }}>Ссылка для вступления недействительна</p>
        </div>
      </div>
    )
  }

  const commValue = program.commission_type === 'percent' ? `${program.commission_value}%` : `${program.commission_value} ₽`
  const benefits = [
    `${commValue} комиссия с каждой продажи`,
    `Холд ${program.hold_days} дней — быстрые выплаты`,
    `Cookie ${program.cookie_days} дней — долгое окно атрибуции`,
    'Личный кабинет с детальной статистикой',
    'Поддержка 24/7 для партнёров',
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top bar */}
      <div style={{ padding: '0 24px', borderBottom: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', height: 58 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#A3E635' }}>RefBuilder</div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
        {/* Left: program info */}
        <div>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: '#A3E63522', color: '#A3E635', marginBottom: 20, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Партнёрская программа
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>{program.name}</h1>
          <p style={{ fontSize: 16, color: '#64748B', margin: '0 0 36px', lineHeight: 1.6 }}>{program.description}</p>

          <div style={{ display: 'flex', flex: 0, gap: 16, marginBottom: 36 }}>
            <div style={{ background: '#1E293B', borderRadius: 14, padding: '18px 20px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#A3E635' }}>{commValue}</div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Комиссия</div>
            </div>
            <div style={{ background: '#1E293B', borderRadius: 14, padding: '18px 20px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{program.stats.active_partners}</div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Партнёров</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {benefits.map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: '#A3E63522', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: '#A3E635' }} />
                </div>
                <span style={{ fontSize: 14, color: '#CBD5E1' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: registration form */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '36px 32px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>Вступить в программу</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 24px' }}>Заполните форму — получите ссылку сразу после регистрации</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 8 }}>Ваше имя *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Иван Иванов" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 8 }}>Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ivan@example.com" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 8 }}>Ваш сайт / канал (необязательно)</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://myblog.ru или @mychannel" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 8 }}>Как планируете продвигать? (необязательно)</label>
              <textarea value={audience} onChange={e => setAudience(e.target.value)} placeholder="Например: Telegram-канал про маркетинг, 5000 подписчиков" rows={2} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }} />
              <label htmlFor="agree" style={{ fontSize: 12, color: '#64748B', cursor: 'pointer', lineHeight: 1.5 }}>
                Я согласен с условиями партнёрской программы и <a href="/terms" style={{ color: '#3B82F6', textDecoration: 'none' }}>правилами использования</a>
              </label>
            </div>
            <button onClick={submit} disabled={!name.trim() || !email.trim() || !agreed} style={{ width: '100%', padding: '13px', borderRadius: 12, background: (!name.trim() || !email.trim() || !agreed) ? '#E2E8F0' : '#0F172A', color: (!name.trim() || !email.trim() || !agreed) ? '#94A3B8' : '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: (!name.trim() || !email.trim() || !agreed) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 150ms' }}>
              Получить реферальную ссылку →
            </button>
          </div>
          <p style={{ fontSize: 11, color: '#CBD5E1', margin: '16px 0 0', textAlign: 'center' }}>Ссылка доступна сразу. Одобрение может потребоваться для выплат.</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
