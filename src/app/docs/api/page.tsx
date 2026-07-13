import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = { title: 'API-документация — Drops Traffic' }

export default function ApiDocsPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ display: 'inline-block', background: '#F8FAFC', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 16 }}>API</div>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-0.8px' }}>API-документация</h1>
        <p style={{ fontSize: 16, color: '#64748B', margin: '0 0 48px', lineHeight: 1.7 }}>
          REST API Drops Traffic доступен на тарифах Бизнес и Агентство. Base URL: <code style={{ background: '#F1F5F9', padding: '2px 8px', borderRadius: 6, fontSize: 14 }}>https://api.drops-traffic.ru/v1</code>
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 20px', paddingBottom: 16, borderBottom: '1px solid #E2E8F0' }}>Аутентификация</h2>
        <p style={{ fontSize: 15, color: '#475569', margin: '0 0 16px', lineHeight: 1.7 }}>
          Все запросы к API должны содержать заголовок <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: 5, fontSize: 13 }}>Authorization: Bearer YOUR_API_KEY</code>. Получить ключ можно в разделе Настройки → API в личном кабинете.
        </p>

        {[
          {
            title: 'Получить список партнёров',
            method: 'GET', endpoint: '/partners',
            desc: 'Возвращает список всех партнёров вашей программы.',
            response: `{
  "data": [
    {
      "id": "p_123",
      "email": "partner@example.com",
      "clicks": 142,
      "conversions": 8,
      "earnings": 2400
    }
  ],
  "total": 1
}`,
          },
          {
            title: 'Создать конверсию',
            method: 'POST', endpoint: '/conversions',
            desc: 'Записать конверсию вручную (например, офлайн-продажа).',
            response: `{
  "id": "conv_456",
  "partner_id": "p_123",
  "amount": 2990,
  "commission": 299,
  "status": "pending"
}`,
          },
          {
            title: 'Получить статистику UTM',
            method: 'GET', endpoint: '/utm/stats',
            desc: 'Сводная статистика по всем UTM-кампаниям.',
            response: `{
  "campaigns": [
    {
      "utm_source": "telegram",
      "clicks": 1420,
      "conversions": 37,
      "revenue": 110630
    }
  ]
}`,
          },
        ].map(endpoint => (
          <div key={endpoint.endpoint} style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 12px' }}>{endpoint.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{
                background: endpoint.method === 'GET' ? '#EFF6FF' : '#F0FDF4',
                color: endpoint.method === 'GET' ? '#2563EB' : '#15803D',
                fontWeight: 700, fontSize: 13, padding: '4px 10px', borderRadius: 6, fontFamily: 'monospace',
              }}>{endpoint.method}</span>
              <code style={{ fontSize: 14, color: '#475569', background: '#F8FAFC', padding: '4px 10px', borderRadius: 6 }}>{endpoint.endpoint}</code>
            </div>
            <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 12px' }}>{endpoint.desc}</p>
            <pre style={{ background: '#0F172A', borderRadius: 12, padding: 20, margin: 0, overflowX: 'auto' }}>
              <code style={{ fontSize: 13, color: '#A3E635', fontFamily: 'monospace', lineHeight: 1.6 }}>{endpoint.response}</code>
            </pre>
          </div>
        ))}

        <div style={{ background: '#F8FAFC', borderRadius: 16, padding: 28, border: '1px solid #E2E8F0', marginTop: 40 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>Нужен API-доступ?</p>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>API доступен на тарифах Бизнес и Агентство. <a href="/pricing" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>Обновить тариф →</a></p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
