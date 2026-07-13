import { ToolIcon } from '@/components/ToolIcon'
import Link from 'next/link'

const partners = [
  { name: 'shop_maria92', status: 'активен', bg: '#14532D', fg: '#86EFAC' },
  { name: 'trafficpro_ru', status: 'на холде', bg: '#78350F', fg: '#FDE68A' },
  { name: 'dropstore_kz', status: 'новый', bg: '#1E3A8A', fg: '#93C5FD' },
]

const toolCards = [
  { iconType: 'bars' as const, iconColor: '#3B82F6', tag: 'Калькулятор · Бесплатно', name: 'Юнит-экономика (Unit Calc)', desc: 'Считай CAC, LTV, ROAS, маржу и точку безубыточности в одном окне. Сравнивай до 3 сценариев без Excel.', slug: 'unit-calc' },
  { iconType: 'target' as const, iconColor: '#65A30D', tag: 'Мониторинг цен · Авто', name: 'Прайс-сканер (PriceSpy)', desc: 'Отслеживает цены конкурентов на Wildberries, Ozon, AliExpress и Авито. Telegram-алерт при изменении.', slug: 'price-spy' },
  { iconType: 'radar' as const, iconColor: '#2563EB', tag: 'ИИ-аналитика · Telegram/ВК', name: 'SMM-радар (AI Analytics)', desc: 'Анализирует охваты и вовлечённость каналов. ИИ подсказывает лучшее время для постинга.', slug: 'smm-radar' },
  { iconType: 'grid' as const, iconColor: '#84CC16', tag: 'Контент · 50 постов/мес', name: 'Конструктор карусели (PostMaker)', desc: 'Продающие карусели и посты для Telegram и ВКонтакте с ИИ-текстами за 30 секунд.', slug: 'post-maker' },
  { iconType: 'layers' as const, iconColor: '#3B82F6', tag: 'Аналитика · Все источники', name: 'Трекер трафика (UTM Hub)', desc: 'Единое место для всех UTM-меток. Видишь, откуда пришёл каждый заказ.', slug: 'utm-hub' },
  { iconType: 'trend' as const, iconColor: '#65A30D', tag: 'Дропшиппинг · Тренды', name: 'Поиск товаров (TrendFinder)', desc: 'Находит товары с высоким спросом и низкой конкуренцией на Wildberries и Ozon.', slug: 'trend-finder' },
]

export function Tools() {
  return (
    <section id="tools" style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.8px', margin: '0 0 10px' }}>
            7 инструментов в одной подписке
          </h2>
          <p style={{ fontSize: 17, color: '#64748B', margin: 0, maxWidth: 560 }}>
            От расчёта юнит-экономики до автопостинга — всё, что нужно дропшипперу и SMM-специалисту.
          </p>
        </div>
        <Link href="/tools" style={{ fontSize: 14, fontWeight: 600, color: '#3B82F6', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Все инструменты →
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="tools-grid">
        {/* Featured card */}
        <Link href="/tools/ref-builder" style={{ gridColumn: 'span 2', textDecoration: 'none' }} className="featured-card">
          <div style={{
            background: '#0F172A', borderRadius: 24,
            padding: 32, color: '#F1F5F9', height: '100%',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center',
            transition: 'opacity 150ms',
          }} className="featured-inner">
            <div>
              <div style={{
                display: 'inline-block', background: '#A3E635', color: '#0F172A',
                fontSize: 12, fontWeight: 700, padding: '5px 12px',
                borderRadius: 999, marginBottom: 16,
              }}>Флагман</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 10px' }}>
                Конструктор партнёрок (RefBuilder)
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Запусти свою партнёрскую сеть без разработчика. Виджет встраивается на любой сайт,
                партнёры получают личные ссылки, ты видишь клики и конверсии в реальном времени.
              </p>
            </div>
            <div style={{ background: '#1E293B', borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>Партнёры</div>
              {partners.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: i < partners.length - 1 ? '1px solid #334155' : 'none',
                }}>
                  <span style={{ fontSize: 13, color: '#E2E8F0' }}>{p.name}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px',
                    borderRadius: 999, background: p.bg, color: p.fg,
                  }}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* Regular cards */}
        {toolCards.map((tool, i) => (
          <Link key={i} href={`/tools/${tool.slug}`} style={{ textDecoration: 'none' }}>
            <div className="tool-card" style={{
              background: '#F8FAFC', border: '1px solid #E2E8F0',
              borderRadius: 24, padding: 28, transition: 'all 200ms ease',
              height: '100%',
            }}>
              <div style={{ marginBottom: 16 }}>
                <ToolIcon type={tool.iconType} color={tool.iconColor} />
              </div>
              <div style={{
                display: 'inline-block', fontSize: 11, fontWeight: 700,
                color: '#3B82F6', background: '#DBEAFE',
                padding: '4px 10px', borderRadius: 999, marginBottom: 12,
              }}>{tool.tag}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#0F172A' }}>{tool.name}</h3>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, margin: 0 }}>{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .tools-grid { grid-template-columns: 1fr 1fr !important; }
          .featured-card { grid-column: span 2 !important; }
          .featured-inner { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .tools-grid { grid-template-columns: 1fr !important; }
          .featured-card { grid-column: span 1 !important; }
        }
        .tool-card:hover { border-color: #A3E635 !important; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .featured-card:hover .featured-inner { opacity: 0.9; }
      `}</style>
    </section>
  )
}
