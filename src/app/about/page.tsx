import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = { title: 'О нас — Drops Traffic' }

const team = [
  { name: 'Алексей Семёнов', role: 'CEO & Co-founder', bio: 'Бывший руководитель отдела e-commerce в крупном ритейлере. 7 лет в дропшиппинге.' },
  { name: 'Мария Ковалёва', role: 'CTO & Co-founder', bio: 'Fullstack-разработчик с 10-летним стажем. Создала архитектуру платформы с нуля.' },
  { name: 'Дмитрий Волков', role: 'Head of Product', bio: 'Продакт с опытом в SaaS-компаниях. Отвечает за то, чтобы инструменты решали реальные задачи.' },
  { name: 'Анна Лебедева', role: 'Head of Marketing', bio: 'Специалист по контент-маркетингу и SEO. Ведёт блог и Telegram-канал Drops Traffic.' },
]

const milestones = [
  { year: '2023', text: 'Основание компании. Первый инструмент — Unit Calc — появился как внутренний проект для собственного бизнеса.' },
  { year: '2024', text: 'Запуск платформы в публичный доступ. 500 пользователей за первый месяц.' },
  { year: '2025', text: 'Добавление RefBuilder, SMM-радара и TrendFinder. 5 000+ активных пользователей.' },
  { year: '2026', text: 'Выход в страны СНГ. Запуск агентского тарифа и white-label решений.' },
]

export default function AboutPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main>
        {/* Hero */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '80px 32px 64px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#F0FDF4', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600, color: '#65A30D', marginBottom: 16 }}>О нас</div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0F172A', margin: '0 0 20px', letterSpacing: '-1px', lineHeight: 1.15 }}>
            Мы сами занимались дропшиппингом — поэтому знаем, что нужно
          </h1>
          <p style={{ fontSize: 18, color: '#64748B', lineHeight: 1.7, margin: 0 }}>
            Drops Traffic — это инструменты, которые мы хотели бы иметь, когда только начинали. Не абстрактный SaaS, а практический набор, решающий реальные задачи e-commerce предпринимателей в России и СНГ.
          </p>
        </section>

        {/* Mission */}
        <section style={{ background: '#F8FAFC', padding: '64px 32px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} className="about-grid">
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-0.5px' }}>Наша миссия</h2>
              <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.75, margin: '0 0 16px' }}>
                Сделать профессиональные инструменты e-commerce доступными для малого и среднего бизнеса. Раньше такой уровень аналитики и автоматизации был только у крупных игроков с большими командами.
              </p>
              <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.75, margin: 0 }}>
                Мы меняем это: один предприниматель с Drops Traffic может конкурировать с командами в 10-20 человек.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { num: '5 000+', label: 'активных пользователей' },
                { num: '7', label: 'инструментов в одной подписке' },
                { num: '98%', label: 'uptime платформы' },
                { num: 'СНГ', label: 'рынок — Россия и страны СНГ' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', minWidth: 80 }}>{s.num}</span>
                  <span style={{ fontSize: 14, color: '#64748B' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: '0 0 48px', letterSpacing: '-0.5px', textAlign: 'center' }}>Команда</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="team-grid">
            {team.map(member => (
              <div key={member.name} style={{ padding: 24, border: '1.5px solid #E2E8F0', borderRadius: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#A3E635', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>
                  {member.name[0]}
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>{member.name}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#3B82F6', margin: '0 0 12px' }}>{member.role}</p>
                <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section style={{ background: '#F8FAFC', padding: '64px 32px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: '0 0 48px', letterSpacing: '-0.5px', textAlign: 'center' }}>История</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {milestones.map(m => (
                <div key={m.year} style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 56, height: 56, borderRadius: 12, background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#A3E635' }}>{m.year}</div>
                  <div style={{ flex: 1, paddingTop: 16, borderTop: '1px solid #E2E8F0' }}>
                    <p style={{ fontSize: 15, color: '#475569', margin: 0, lineHeight: 1.65 }}>{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '64px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: '0 0 16px' }}>Присоединяйтесь к нам</h2>
          <p style={{ fontSize: 16, color: '#64748B', margin: '0 0 32px' }}>Начните бесплатно — без кредитной карты.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" style={{ padding: '13px 28px', borderRadius: 12, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>Начать бесплатно</Link>
            <Link href="/contacts" style={{ padding: '13px 28px', borderRadius: 12, border: '1.5px solid #E2E8F0', color: '#0F172A', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>Связаться с нами</Link>
          </div>
        </section>
      </main>
      <Footer />
      <style>{`
        @media (max-width: 768px) {
          .about-grid, .team-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .team-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
