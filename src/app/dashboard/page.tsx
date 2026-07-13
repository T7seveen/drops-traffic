import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getUser } from '@/lib/supabase/server'
import { isConfigured } from '@/lib/supabase/client'
import { tools } from '@/lib/data/tools'
import { ToolIcon } from '@/components/ToolIcon'

export const metadata = { title: 'Кабинет — Drops Traffic' }

export default async function DashboardPage() {
  const configured = isConfigured()
  let user = null

  if (configured) {
    user = await getUser()
    if (!user) redirect('/auth/login?next=/dashboard')
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>
        {!configured && (
          <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '12px 20px', marginBottom: 32, fontSize: 14, color: '#92400E' }}>
            Демонстрационный режим. Подключите Supabase для полной функциональности.
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            {user ? `Привет, ${user.email?.split('@')[0]}` : 'Добро пожаловать'}
          </h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: 0 }}>
            Тариф: <strong style={{ color: '#0F172A' }}>Старт</strong> · Обновить до{' '}
            <Link href="/pricing" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>Про</Link>
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }} className="dash-stats">
          {[
            { label: 'Инструментов доступно', value: '7', sub: 'все инструменты' },
            { label: 'Партнёры', value: '0', sub: 'из 5 на тарифе Старт' },
            { label: 'Посты PostMaker', value: '0', sub: 'из 15 за месяц' },
            { label: 'Отслеживаемых товаров', value: '0', sub: 'из 30 на тарифе Старт' },
          ].map(s => (
            <div key={s.label} style={{ padding: 20, border: '1.5px solid #E2E8F0', borderRadius: 14 }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{s.value}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tools */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '0 0 20px', letterSpacing: '-0.3px' }}>Ваши инструменты</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {tools.map(tool => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: 20, border: '1.5px solid #E2E8F0', borderRadius: 14, display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'border-color 150ms', cursor: 'pointer' }} className="dash-tool-card">
                  <ToolIcon type={tool.iconType} color={tool.iconColor} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>{tool.name.split(' (')[0]}</p>
                    <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{tool.tag.split(' · ')[1]}</p>
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
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Снимите все ограничения от 1 490 ₽/мес</p>
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
        .dash-tool-card:hover { border-color: #A3E635 !important; }
      `}</style>
    </div>
  )
}
