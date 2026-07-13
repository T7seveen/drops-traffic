import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ToolIcon } from '@/components/ToolIcon'

export const metadata = { title: 'Блог — Drops Traffic' }

const posts = [
  {
    slug: 'unit-economics-dropshipping-2025',
    title: 'Как считать юнит-экономику дропшиппинга: полное руководство 2025',
    excerpt: 'Разбираем CAC, ROAS, LTV и маржу на реальных примерах. Почему большинство дропшипперов уходят в минус и как это исправить.',
    readTime: 8, date: '15 июня 2025', category: 'Аналитика',
  },
  {
    slug: 'wildberries-vs-ozon-2025',
    title: 'Wildberries vs Ozon 2025: где выгоднее продавать в СНГ',
    excerpt: 'Сравниваем комиссии, логистику, алгоритмы продвижения и аудиторию двух крупнейших маркетплейсов России.',
    readTime: 12, date: '8 июня 2025', category: 'Маркетплейсы',
  },
  {
    slug: 'top-7-dropshipping-niches-2025',
    title: 'Топ-7 трендовых ниш для дропшиппинга: что покупают прямо сейчас',
    excerpt: 'Анализ 500 000 транзакций на WB и Ozon показал неожиданные категории с высокой маржой и низкой конкуренцией.',
    readTime: 6, date: '28 мая 2025', category: 'Тренды',
  },
  {
    slug: 'traffic-sources-ecom-2025',
    title: 'Лучшие источники трафика для e-commerce в 2025: рейтинг по ROI',
    excerpt: 'ВКонтакте, Telegram Ads, поисковая реклама, маркетплейсы или SEO — где самый высокий возврат на рекламный бюджет?',
    readTime: 10, date: '20 мая 2025', category: 'Трафик',
  },
  {
    slug: 'referral-program-ecom',
    title: 'Партнёрская программа для интернет-магазина: запуск за 10 минут',
    excerpt: 'Пошаговое руководство по запуску реферальной программы без разработчика. Реальные результаты наших клиентов.',
    readTime: 7, date: '12 мая 2025', category: 'Партнёрки',
  },
  {
    slug: 'smm-telegram-2025',
    title: 'SMM для дропшиппинга в Telegram: что работает в 2025',
    excerpt: 'Форматы контента, частота публикаций и аналитика, которые увеличивают продажи через Telegram-каналы.',
    readTime: 9, date: '5 мая 2025', category: 'SMM',
  },
]

const iconTypes = ['bars', 'target', 'radar', 'grid', 'layers', 'trend'] as const
const iconColors = ['#3B82F6', '#65A30D', '#2563EB', '#84CC16', '#A3E635', '#65A30D']

export default function BlogPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: '#EFF6FF', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600, color: '#2563EB', marginBottom: 16 }}>Блог</div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-1px' }}>
            Знания для e-commerce
          </h1>
          <p style={{ fontSize: 18, color: '#64748B', maxWidth: 560, margin: 0 }}>
            Практические руководства, кейсы и аналитика о дропшиппинге, арбитраже трафика и маркетплейсах.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="blog-grid">
          {posts.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article className="blog-card" style={{
                border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden',
                transition: 'all 200ms', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ background: '#F8FAFC', padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #E2E8F0' }}>
                  <ToolIcon type={iconTypes[i % 6]} color={iconColors[i % 6]} size="large" />
                </div>
                <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', background: '#EFF6FF', borderRadius: 20, padding: '3px 10px' }}>{post.category}</span>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{post.readTime} мин</span>
                  </div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.4 }}>{post.title}</h2>
                  <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6, flex: 1 }}>{post.excerpt}</p>
                  <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>{post.date}</div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
      <style>{`
        @media (max-width: 900px) { .blog-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .blog-grid { grid-template-columns: 1fr !important; } }
        .blog-card:hover { border-color: #A3E635 !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
      `}</style>
    </div>
  )
}
