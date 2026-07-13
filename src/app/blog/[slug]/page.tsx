import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const posts: Record<string, {
  title: string; date: string; readTime: number; category: string; excerpt: string; content: string
}> = {
  'unit-economics-dropshipping-2025': {
    title: 'Как считать юнит-экономику дропшиппинга: полное руководство 2025',
    date: '15 июня 2025', readTime: 8, category: 'Аналитика',
    excerpt: 'Разбираем CAC, ROAS, LTV и маржу на реальных примерах.',
    content: `
## Зачем считать юнит-экономику?

Большинство начинающих дропшипперов смотрят только на выручку — и это главная ошибка. Без понимания юнит-экономики невозможно масштабировать бизнес: вы не знаете, сколько стоит привлечь одного клиента и окупаются ли эти расходы.

## Ключевые метрики

**CAC (Customer Acquisition Cost)** — стоимость привлечения клиента. Считается просто: рекламный бюджет / количество новых покупателей. Например, если вы потратили 50 000 ₽ на рекламу и получили 100 заказов — CAC = 500 ₽.

**LTV (Lifetime Value)** — сколько денег клиент принесёт за всё время. Для дропшиппинга чаще всего LTV = средний чек × среднее количество покупок за год.

**ROAS (Return on Ad Spend)** — возврат на рекламные расходы. ROAS = выручка / рекламный бюджет. ROAS > 3 — хороший результат для большинства ниш.

**Маржа** — разница между ценой продажи и себестоимостью (включая доставку, комиссию платформы, рекламу). Здоровая маржа для дропшиппинга — 25-40%.

## Формула прибыльности

Бизнес прибылен, когда:
> LTV > CAC × 3

Это называется правилом 3x. Если ваш LTV = 1500 ₽, то CAC должен быть не выше 500 ₽.

## Пример расчёта

| Показатель | Значение |
|---|---|
| Средний чек | 2 500 ₽ |
| Маржа на товаре | 35% = 875 ₽ |
| CAC | 400 ₽ |
| Чистая прибыль с заказа | 875 − 400 = 475 ₽ |
| ROAS | 2 500 / 400 = 6.25 |

Такие показатели говорят о здоровом бизнесе. Масштабируйте.

## Как автоматизировать расчёты

Вручную считать юнит-экономику — долго и неудобно. В Drops Traffic есть инструмент **Unit Calc**, который делает это автоматически: вводите данные один раз, система обновляет все метрики в реальном времени.
    `,
  },
  'wildberries-vs-ozon-2025': {
    title: 'Wildberries vs Ozon 2025: где выгоднее продавать в СНГ',
    date: '8 июня 2025', readTime: 12, category: 'Маркетплейсы',
    excerpt: 'Сравниваем комиссии, логистику и алгоритмы продвижения.',
    content: `
## Аудитория и охват

**Wildberries** — крупнейший маркетплейс России с ежемесячной аудиторией более 100 млн посетителей. Сильные стороны: огромный охват, высокая импульсивность покупок, сильные категории — одежда, обувь, косметика.

**Ozon** — второй по величине с ~50 млн посетителей в месяц. Сильные стороны: электроника, товары для дома, книги, более качественная аудитория с высоким средним чеком.

## Комиссии в 2025

| Категория | WB | Ozon |
|---|---|---|
| Одежда и обувь | 23% | 20% |
| Электроника | 10% | 8% |
| Косметика | 19% | 16% |
| Товары для дома | 15% | 14% |

Ozon в среднем дешевле на 2-4%, но это компенсируется более высокой выручкой на WB за счёт трафика.

## Логистика

WB продвигает собственные склады и штрафует за нарушение сроков поставки. Ozon более гибкий: есть FBS (со своего склада) и FBO (с их склада). Для дропшипперов FBS на Ozon часто удобнее.

## Вывод

- **WB** — если ваша ниша: одежда, косметика, товары до 3000 ₽
- **Ozon** — если ваша ниша: электроника, дорогие товары, экспериментальные категории
- **Оба** — для масштабирования и диверсификации рисков
    `,
  },
  'top-7-dropshipping-niches-2025': {
    title: 'Топ-7 трендовых ниш для дропшиппинга: что покупают прямо сейчас',
    date: '28 мая 2025', readTime: 6, category: 'Тренды',
    excerpt: 'Анализ 500 000 транзакций показал неожиданные категории с высокой маржой.',
    content: `
## Методология

Мы проанализировали 500 000 транзакций на Wildberries и Ozon за первое полугодие 2025, чтобы найти категории с растущим спросом, маржой выше 30% и относительно низкой конкуренцией.

## Топ-7 ниш

**1. Товары для домашних тренировок** — рост спроса +67% г/г. Маржа 35-45%. Конкуренция умеренная.

**2. Аксессуары для умного дома** — совместимые устройства, пульты, хабы. Маржа 40-55%. Покупают повторно.

**3. Эко-товары и zero-waste** — тренд продолжает расти. Средний чек 1 500-3 000 ₽, маржа 45%.

**4. Товары для рукоделия** — стабильная аудитория, низкая сезонность, высокий LTV.

**5. Уходовая косметика для мужчин** — недооценённая ниша с растущей аудиторией. Маржа 40%.

**6. Органайзеры и системы хранения** — вечная ниша с постоянным спросом.

**7. Товары для животных** — премиум-сегмент растёт быстрее масс-маркета. Маржа 35-50%.

## Как искать тренды самостоятельно

Инструмент **TrendFinder** в Drops Traffic ежедневно анализирует данные WB и Ozon и показывает товары с растущим спросом ещё до того, как они стали массовыми.
    `,
  },
  'traffic-sources-ecom-2025': {
    title: 'Лучшие источники трафика для e-commerce в 2025: рейтинг по ROI',
    date: '20 мая 2025', readTime: 10, category: 'Трафик',
    excerpt: 'Где самый высокий возврат на рекламный бюджет?',
    content: `
## Источники трафика в 2025

После изменений рекламного рынка в России пейзаж источников трафика существенно изменился. Делимся актуальным рейтингом по медиане ROAS.

| Источник | Медианный ROAS | Сложность входа |
|---|---|---|
| ВКонтакте | 3.8x | Средняя |
| Telegram Ads | 4.2x | Высокая |
| Маркетплейсы (реклама) | 5.1x | Низкая |
| SEO + Яндекс | 6.5x | Высокая |
| Email-рассылки | 8.2x | Средняя |

## Telegram Ads в 2025

Показывает один из лучших ROAS среди платных каналов. Аудитория качественная, конкуренция ниже, чем в контексте. Минус — высокий порог входа (€1500 на пополнение).

## Email-рассылки

Лучший ROAS, но работает только при наличии собственной базы. Основной канал для LTV: если вы не собираете email покупателей — вы оставляете деньги на столе.

## Рекомендация

Начните с рекламы на маркетплейсах (низкий порог, быстрый результат), параллельно стройте Telegram-канал и базу email для масштабирования.
    `,
  },
  'referral-program-ecom': {
    title: 'Партнёрская программа для интернет-магазина: запуск за 10 минут',
    date: '12 мая 2025', readTime: 7, category: 'Партнёрки',
    excerpt: 'Пошаговое руководство по запуску реферальной программы без разработчика.',
    content: `
## Зачем нужна партнёрская программа?

Партнёрская программа — один из самых дешёвых источников клиентов: вы платите только за результат. Средняя комиссия в e-commerce — 5-15% от заказа, что ниже CAC из платного трафика.

## Ключевые параметры

Перед запуском нужно определить:
- **Комиссия**: фиксированная (300 ₽ за заказ) или процент (10%). Процент выгоднее при высоком среднем чеке.
- **Холд**: время до подтверждения выплаты (стандарт — 14-30 дней, пока не истёк срок возврата).
- **Минимальная сумма выплаты**: обычно 1 000-2 000 ₽.

## Запуск через RefBuilder

1. Зарегистрируйтесь в Drops Traffic
2. Перейдите в раздел RefBuilder
3. Создайте программу, укажите условия
4. Вставьте одну строку кода на сайт
5. Пригласите первых партнёров по email или в Telegram

Весь процесс занимает около 10 минут. Каждый партнёр сразу получает личный кабинет с реферальной ссылкой и статистикой.

## Антифрод

RefBuilder автоматически проверяет уникальность IP и User-Agent, чтобы исключить самореферальные конверсии. Подозрительные заявки помечаются для ручной проверки.
    `,
  },
  'smm-telegram-2025': {
    title: 'SMM для дропшиппинга в Telegram: что работает в 2025',
    date: '5 мая 2025', readTime: 9, category: 'SMM',
    excerpt: 'Форматы контента и аналитика, которые увеличивают продажи через Telegram.',
    content: `
## Telegram как канал продаж

Telegram — второй по конверсии канал для дропшипперов после маркетплейсов. Причина: прямой контакт с аудиторией без алгоритмов, возможность продавать через сторис и посты одновременно.

## Форматы, которые конвертируют

**Товарный пост с историей** — не просто "купите товар", а история: кто использует, какую проблему решает. Конверсия в 2-3 раза выше обычного товарного поста.

**"До / После"** — работает для косметики, товаров для дома, фитнеса. Честный контент доверяют.

**Подборки** — "5 товаров до 1000 ₽ для уютного дома" собирают репосты и привлекают новую аудиторию.

**Опросы** — вовлекают аудиторию и помогают понять спрос перед закупкой.

## Аналитика

Без аналитики сложно понять, что работает. SMM-радар в Drops Traffic показывает:
- Охват и ERR каждого поста
- Лучшее время публикации для вашей аудитории
- Сравнение с конкурентами

## Частота публикаций

Оптимально — 5-7 постов в неделю. Больше — падает вовлечённость, меньше — теряете актуальность в ленте.
    `,
  },
}

export async function generateStaticParams() {
  return Object.keys(posts).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts[slug]
  if (!post) return {}
  return { title: `${post.title} — Drops Traffic`, description: post.excerpt }
}

function renderContent(content: string) {
  const lines = content.trim().split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '40px 0 16px', letterSpacing: '-0.3px' }}>{line.slice(3)}</h2>)
    } else if (line.startsWith('| ')) {
      const tableLines = []
      while (i < lines.length && lines[i].startsWith('|')) { tableLines.push(lines[i]); i++ }
      const rows = tableLines.filter(l => !l.match(/^\|[-| ]+\|$/))
      elements.push(
        <div key={i} style={{ overflowX: 'auto', margin: '16px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            {rows.map((row, ri) => {
              const cells = row.split('|').filter(c => c.trim())
              const Tag = ri === 0 ? 'th' : 'td'
              return (
                <tr key={ri} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  {cells.map((cell, ci) => (
                    <Tag key={ci} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: ri === 0 ? 700 : 400, color: ri === 0 ? '#0F172A' : '#475569', background: ri === 0 ? '#F8FAFC' : 'transparent' }}>{cell.trim()}</Tag>
                  ))}
                </tr>
              )
            })}
          </table>
        </div>
      )
      continue
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={i} style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '20px 0 8px' }}>{line.replace(/\*\*/g, '')}</p>)
    } else if (line.startsWith('> ')) {
      elements.push(<blockquote key={i} style={{ margin: '16px 0', padding: '12px 20px', borderLeft: '4px solid #A3E635', background: '#F0FDF4', borderRadius: '0 8px 8px 0', fontSize: 15, color: '#374151', fontStyle: 'italic' }}>{line.slice(2)}</blockquote>)
    } else if (line.match(/^\d+\./)) {
      const items = []
      while (i < lines.length && lines[i].match(/^\d+\./)) { items.push(lines[i].replace(/^\d+\.\s*/, '')); i++ }
      elements.push(<ol key={i} style={{ margin: '12px 0', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>{items.map((it, idx) => <li key={idx} style={{ fontSize: 15, color: '#475569', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: it.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />)}</ol>)
      continue
    } else if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].startsWith('- ')) { items.push(lines[i].slice(2)); i++ }
      elements.push(<ul key={i} style={{ margin: '12px 0', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>{items.map((it, idx) => <li key={idx} style={{ fontSize: 15, color: '#475569', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: it.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />)}</ul>)
      continue
    } else if (line.trim()) {
      elements.push(<p key={i} style={{ fontSize: 16, color: '#475569', lineHeight: 1.75, margin: '12px 0' }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />)
    }
    i++
  }
  return elements
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts[slug]
  if (!post) notFound()

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 32px' }}>
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#64748B', textDecoration: 'none', marginBottom: 40 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Все статьи
        </Link>

        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', background: '#EFF6FF', borderRadius: 20, padding: '4px 12px' }}>{post.category}</span>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>{post.date}</span>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>·</span>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>{post.readTime} мин чтения</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-0.7px', lineHeight: 1.2 }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 18, color: '#64748B', margin: 0, lineHeight: 1.6 }}>{post.excerpt}</p>
        </div>

        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 40 }}>
          {renderContent(post.content)}
        </div>

        <div style={{ marginTop: 64, padding: 32, background: '#F8FAFC', borderRadius: 20, border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Попробуйте Drops Traffic бесплатно</p>
          <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 24px' }}>7 инструментов для дропшиппинга и e-commerce в одной подписке.</p>
          <Link href="/auth/register" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 10, background: '#A3E635', color: '#0F172A', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
            Начать бесплатно
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
