import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getUser } from '@/lib/supabase/server'
import { getLocalSession } from '@/lib/auth/server-session'
import { isConfigured } from '@/lib/supabase/client'
import { tools } from '@/lib/data/tools'
import { ToolIcon } from '@/components/ToolIcon'

export const metadata = { title: 'Кабинет — Drops Traffic' }

export default async function DashboardPage() {
  const configured = isConfigured()
  let displayName = ''
  let displayEmail = ''

  if (configured) {
    const user = await getUser()
    if (!user) redirect('/auth/login?next=/dashboard')
    displayEmail = user.email ?? ''
    displayName = displayEmail.split('@')[0]
  } else {
    const session = await getLocalSession()
    if (!session) redirect('/auth/login?next=/dashboard')
    displayName = session.name || session.email.split('@')[0]
    displayEmail = session.email
  }

  const liveTools = tools.filter(t => t.status === 'live')
  const soonTools = tools.filter(t => t.status === 'soon')

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>

        {/* Greeting */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            Привет, {displayName} 👋
          </h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: 0 }}>
            {displayEmail} · Тариф: <strong style={{ color: '#0F172A' }}>Старт</strong> ·{' '}
            <Link href="/pricing" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>Обновить до Про</Link>
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }} className="dash-stats">
          {[
            { label: 'Активных сервисов', value: String(liveTools.length), sub: 'доступно прямо сейчас' },
            { label: 'В разработке', value: String(soonTools.length), sub: 'появятся в следующих версиях' },
            { label: 'Партнёры', value: '0', sub: 'из 5 на тарифе Старт' },
            { label: 'Расчётов юнит-экономики', value: '0', sub: 'сохранено в кабинете' },
          ].map(s => (
            <div key={s.label} style={{ padding: 20, border: '1.5px solid #E2E8F0', borderRadius: 14 }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{s.value}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Live tools */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>Доступные сервисы</h2>
            <span style={{ fontSize: 12, fontWeight: 700, background: '#DCFCE7', color: '#15803D', borderRadius: 20, padding: '3px 10px' }}>Работают</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {liveTools.map(tool => (
              <Link key={tool.slug} href={tool.dashboardPath!} style={{ textDecoration: 'none' }}>
                <div className="dash-tool-card" style={{
                  padding: 24, border: '1.5px solid #E2E8F0', borderRadius: 16,
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  transition: 'all 150ms', cursor: 'pointer', background: '#fff',
                }}>
                  <ToolIcon type={tool.iconType} color={tool.iconColor} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>{tool.name.split(' (')[0]}</p>
                      <span style={{ fontSize: 11, fontWeight: 700, background: '#A3E635', color: '#0F172A', borderRadius: 6, padding: '2px 7px', flexShrink: 0 }}>Открыть →</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{tool.tagline}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Soon tools */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>Скоро</h2>
            <span style={{ fontSize: 12, fontWeight: 700, background: '#F1F5F9', color: '#64748B', borderRadius: 20, padding: '3px 10px' }}>В разработке</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {soonTools.map(tool => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: 24, border: '1.5px dashed #E2E8F0', borderRadius: 16,
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  opacity: 0.65, cursor: 'pointer',
                }}>
                  <ToolIcon type={tool.iconType} color={tool.iconColor} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>{tool.name.split(' (')[0]}</p>
                      <span style={{ fontSize: 11, fontWeight: 700, background: '#F1F5F9', color: '#64748B', borderRadius: 6, padding: '2px 7px', flexShrink: 0 }}>Скоро</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{tool.tagline}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upgrade banner */}
        <div style={{ background: '#0F172A', borderRadius: 20, padding: '32px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Перейдите на тариф Про</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Ранний доступ к новым сервисам, больше партнёров и расчётов</p>
          </div>
          <Link href="/pricing" style={{ padding: '12px 24px', borderRadius: 10, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Сравнить тарифы
          </Link>
        </div>
      </main>
      <Footer />
      <style>{`
        @media (max-width: 900px) { .dash-stats { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .dash-stats { grid-template-columns: 1fr !important; } }
        .dash-tool-card:hover { border-color: #A3E635 !important; box-shadow: 0 4px 16px rgba(163,230,53,0.15); }
      `}</style>
    </div>
  )
}
