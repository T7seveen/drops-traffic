import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = { title: 'Партнёрская программа — Drops Traffic' }

export default function PartnersPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main>
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 32px 64px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#F0FDF4', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600, color: '#65A30D', marginBottom: 16 }}>Партнёрам</div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-1px', lineHeight: 1.15 }}>
            Зарабатывайте с Drops Traffic
          </h1>
          <p style={{ fontSize: 18, color: '#64748B', maxWidth: 540, margin: '0 auto 40px' }}>
            Рекомендуйте платформу и получайте 30% от каждой оплаты приглашённого пользователя на протяжении всего срока его подписки.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" style={{ padding: '13px 28px', borderRadius: 12, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>Стать партнёром</Link>
            <Link href="/contacts" style={{ padding: '13px 28px', borderRadius: 12, border: '1.5px solid #E2E8F0', color: '#0F172A', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>Задать вопрос</Link>
          </div>
        </section>

        <section style={{ background: '#F8FAFC', padding: '64px 32px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="partner-grid">
              {[
                { icon: '💰', title: '30% комиссия', desc: 'С каждого платежа ваших рефералов — навсегда, пока они подписаны.' },
                { icon: '⏱️', title: '60-дневный cookie', desc: 'Атрибуция сохраняется 60 дней после первого клика по вашей ссылке.' },
                { icon: '📊', title: 'Личный кабинет', desc: 'Статистика кликов, конверсий и выплат в реальном времени.' },
                { icon: '🚀', title: 'Маркетинговые материалы', desc: 'Баннеры, тексты и кейсы — всё готово для продвижения.' },
                { icon: '💳', title: 'Выплаты каждые 2 недели', desc: 'На карту или СБП при достижении порога 1 000 ₽.' },
                { icon: '🤝', title: 'Поддержка партнёров', desc: 'Отдельный менеджер для партнёров, зарабатывающих 5 000+ ₽/мес.' },
              ].map(card => (
                <div key={card.title} style={{ background: '#fff', padding: 28, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 28, marginBottom: 16 }}>{card.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>{card.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 32px' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: '0 0 40px', textAlign: 'center', letterSpacing: '-0.5px' }}>Как начать</h2>
          {[
            { num: 1, title: 'Зарегистрируйтесь', desc: 'Создайте аккаунт и перейдите в раздел "Партнёрская программа" в личном кабинете.' },
            { num: 2, title: 'Получите ссылку', desc: 'Ваша персональная реферальная ссылка готова сразу после регистрации.' },
            { num: 3, title: 'Продвигайте', desc: 'Делитесь ссылкой в соцсетях, блоге, Telegram-канале или с клиентами.' },
            { num: 4, title: 'Зарабатывайте', desc: 'Получайте 30% с каждого платежа ваших рефералов.' },
          ].map(step => (
            <div key={step.num} style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#A3E635', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#0F172A', flexShrink: 0 }}>{step.num}</div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>{step.title}</p>
                <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section style={{ background: '#0F172A', padding: '64px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 16px', letterSpacing: '-0.5px' }}>Готовы начать зарабатывать?</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', margin: '0 0 32px' }}>Регистрация и участие в программе — бесплатно.</p>
          <Link href="/auth/register" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 12, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
            Стать партнёром
          </Link>
        </section>
      </main>
      <Footer />
      <style>{`
        @media (max-width: 768px) { .partner-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .partner-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
