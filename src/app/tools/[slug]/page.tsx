import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ToolIcon } from '@/components/ToolIcon'
import { getToolBySlug, tools } from '@/lib/data/tools'
import { getLocalSession } from '@/lib/auth/server-session'
import { isConfigured } from '@/lib/supabase/client'
import { getUser } from '@/lib/supabase/server'

export async function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}
  return { title: `${tool.name} — Drops Traffic`, description: tool.tagline }
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  // Check auth for CTA
  let isLoggedIn = false
  if (isConfigured()) {
    const user = await getUser()
    isLoggedIn = !!user
  } else {
    const session = await getLocalSession()
    isLoggedIn = !!session
  }

  const ctaHref = isLoggedIn && tool.dashboardPath
    ? tool.dashboardPath
    : isLoggedIn
      ? '/dashboard'
      : '/auth/register'

  const ctaLabel = isLoggedIn && tool.dashboardPath
    ? 'Открыть сервис →'
    : isLoggedIn
      ? 'В кабинет'
      : tool.cta

  const isLive = tool.status === 'live'

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px 64px' }}>
        <Link href="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#64748B', textDecoration: 'none', marginBottom: 32 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Все инструменты
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="tool-hero-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <ToolIcon type={tool.iconType} color={tool.iconColor} size="large" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', background: '#F1F5F9', borderRadius: 20, padding: '4px 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {tool.tag.split(' · ')[1]}
              </span>
              {isLive ? (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#15803D', background: '#DCFCE7', borderRadius: 20, padding: '4px 12px' }}>
                  ● Работает
                </span>
              ) : (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E', background: '#FEF3C7', borderRadius: 20, padding: '4px 12px' }}>
                  Скоро
                </span>
              )}
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-0.8px', lineHeight: 1.15 }}>
              {tool.name}
            </h1>
            <p style={{ fontSize: 18, color: '#64748B', margin: '0 0 32px', lineHeight: 1.6 }}>{tool.tagline}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={ctaHref} style={{
                padding: '12px 24px', borderRadius: 12,
                background: isLive ? '#A3E635' : '#E2E8F0',
                color: '#0F172A', fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}>
                {ctaLabel}
              </Link>
              {!isLoggedIn && (
                <Link href="/pricing" style={{ padding: '12px 24px', borderRadius: 12, border: '1.5px solid #E2E8F0', color: '#0F172A', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
                  Тарифы
                </Link>
              )}
              {isLoggedIn && tool.dashboardPath && (
                <Link href="/dashboard" style={{ padding: '12px 24px', borderRadius: 12, border: '1.5px solid #E2E8F0', color: '#64748B', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
                  Кабинет
                </Link>
              )}
            </div>
          </div>
          <div style={{ background: '#F8FAFC', borderRadius: 20, padding: 40, border: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, margin: 0 }}>{tool.description}</p>
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #E2E8F0' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Для кого</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tool.forWho.map(w => (
                  <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#475569' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: tool.iconColor, flexShrink: 0 }} />
                    {w}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#F8FAFC', padding: '64px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: '0 0 48px', letterSpacing: '-0.5px', textAlign: 'center' }}>Как это работает</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="steps-grid">
            {tool.steps.map((step, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: tool.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 16 }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: '0 0 48px', letterSpacing: '-0.5px', textAlign: 'center' }}>Возможности</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="features-grid">
          {tool.features.map(f => (
            <div key={f.title} style={{ padding: 28, border: '1.5px solid #E2E8F0', borderRadius: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: tool.iconColor, marginBottom: 16 }} />
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#F8FAFC', padding: '64px 32px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: '0 0 48px', letterSpacing: '-0.5px', textAlign: 'center' }}>Частые вопросы</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {tool.faq.map(item => (
              <div key={item.q} style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid #E2E8F0' }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 10px' }}>{item.q}</p>
                <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 32px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
            {isLoggedIn ? 'Готово — у вас есть доступ' : 'Готовы попробовать?'}
          </h2>
          <p style={{ fontSize: 16, color: '#64748B', margin: '0 0 32px' }}>
            {isLoggedIn ? 'Откройте сервис прямо сейчас из вашего кабинета.' : 'Тариф Старт — бесплатно. Без банковской карты.'}
          </p>
          <Link href={ctaHref} style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 12, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
            {ctaLabel}
          </Link>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .tool-hero-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
