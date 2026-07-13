import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = { title: 'База знаний — Drops Traffic' }

const sections = [
  {
    title: 'Начало работы',
    articles: [
      { title: 'Как зарегистрироваться и настроить аккаунт', slug: 'getting-started' },
      { title: 'Обзор личного кабинета', slug: 'dashboard-overview' },
      { title: 'Как выбрать тариф', slug: 'choose-plan' },
    ],
  },
  {
    title: 'Unit Calc — Юнит-экономика',
    articles: [
      { title: 'Быстрый старт с Unit Calc', slug: 'unit-calc-start' },
      { title: 'Как создать сценарий "что если"', slug: 'unit-calc-scenarios' },
      { title: 'Экспорт расчётов в PDF и Excel', slug: 'unit-calc-export' },
    ],
  },
  {
    title: 'PriceSpy — Мониторинг цен',
    articles: [
      { title: 'Добавить первый товар для отслеживания', slug: 'pricespy-start' },
      { title: 'Настройка Telegram-алертов', slug: 'pricespy-alerts' },
      { title: 'Анализ истории цен', slug: 'pricespy-history' },
    ],
  },
  {
    title: 'RefBuilder — Партнёрские программы',
    articles: [
      { title: 'Создание партнёрской программы', slug: 'refbuilder-create' },
      { title: 'Установка виджета на сайт', slug: 'refbuilder-widget' },
      { title: 'Управление выплатами', slug: 'refbuilder-payouts' },
    ],
  },
]

export default function DocsPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: '#F8FAFC', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 16 }}>База знаний</div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-1px' }}>Документация</h1>
          <p style={{ fontSize: 18, color: '#64748B', margin: '0 0 24px' }}>Всё, что нужно знать для работы с Drops Traffic.</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/docs/api" style={{ padding: '9px 18px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontWeight: 600, color: '#0F172A', textDecoration: 'none' }}>API-документация</Link>
            <a href="https://t.me/dropstraffic" target="_blank" rel="noopener noreferrer" style={{ padding: '9px 18px', borderRadius: 10, background: '#A3E635', fontSize: 14, fontWeight: 600, color: '#0F172A', textDecoration: 'none' }}>Задать вопрос</a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="docs-grid">
          {sections.map(section => (
            <div key={section.title}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', paddingBottom: 12, borderBottom: '1px solid #E2E8F0' }}>{section.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.articles.map(article => (
                  <a key={article.slug} href="#" style={{ fontSize: 14, color: '#475569', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#CBD5E1', fontSize: 16 }}>›</span>
                    {article.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, background: '#F8FAFC', borderRadius: 16, padding: 28, border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>Не нашли ответ?</p>
          <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 16px' }}>Наша поддержка ответит в течение 2 часов в рабочее время.</p>
          <a href="https://t.me/dropstraffic" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 700, color: '#2563EB', textDecoration: 'none' }}>Написать в Telegram →</a>
        </div>
      </main>
      <Footer />
      <style>{`@media (max-width: 640px) { .docs-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
