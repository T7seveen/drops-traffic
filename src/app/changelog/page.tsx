import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = { title: 'Обновления — Drops Traffic' }

const releases = [
  {
    version: '2.4.0', date: '10 июля 2026', type: 'feature',
    changes: [
      'TrendFinder: добавлен тренд-скор для оценки потенциала товаров',
      'PriceSpy: история цен теперь доступна за 180 дней (было 90)',
      'PostMaker: 20 новых шаблонов для летнего сезона',
      'Dashboard: новый виджет сводной статистики',
    ],
  },
  {
    version: '2.3.2', date: '28 июня 2026', type: 'fix',
    changes: [
      'Исправлена ошибка при экспорте расчётов Unit Calc в Excel',
      'RefBuilder: исправлен подсчёт конверсий при использовании нескольких программ',
      'Улучшена скорость загрузки страниц на 15%',
    ],
  },
  {
    version: '2.3.0', date: '15 июня 2026', type: 'feature',
    changes: [
      'SMM-радар: добавлен анализ конкурентных каналов',
      'UTM Hub: интеграция с рекламным кабинетом ВКонтакте',
      'Новый тариф Агентство с white-label возможностями',
      'API v1: публичный релиз для тарифов Бизнес и Агентство',
    ],
  },
  {
    version: '2.2.0', date: '1 июня 2026', type: 'feature',
    changes: [
      'Добавлен инструмент TrendFinder для поиска трендовых товаров',
      'Unit Calc: шаблоны для 5 бизнес-моделей',
      'Редизайн личного кабинета',
    ],
  },
]

const typeLabel: Record<string, { label: string; color: string; bg: string }> = {
  feature: { label: 'Новое', color: '#15803D', bg: '#F0FDF4' },
  fix: { label: 'Исправления', color: '#92400E', bg: '#FFF7ED' },
}

export default function ChangelogPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: '#F8FAFC', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 16 }}>Changelog</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#0F172A', margin: '0 0 12px', letterSpacing: '-0.8px' }}>Обновления платформы</h1>
          <p style={{ fontSize: 16, color: '#64748B', margin: 0 }}>Следите за изменениями в Drops Traffic.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {releases.map(release => {
            const t = typeLabel[release.type]
            return (
              <div key={release.version} style={{ paddingBottom: 40, borderBottom: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>v{release.version}</span>
                  <span style={{ background: t.bg, color: t.color, fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>{t.label}</span>
                  <span style={{ fontSize: 14, color: '#94A3B8' }}>{release.date}</span>
                </div>
                <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {release.changes.map(c => (
                    <li key={c} style={{ fontSize: 15, color: '#475569', lineHeight: 1.6 }}>{c}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}
