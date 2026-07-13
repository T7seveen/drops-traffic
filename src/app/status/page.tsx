import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = { title: 'Статус сервиса — Drops Traffic' }

const services = [
  { name: 'API платформы', status: 'up', latency: '42ms' },
  { name: 'Unit Calc', status: 'up', latency: '18ms' },
  { name: 'PriceSpy — сбор данных', status: 'up', latency: '156ms' },
  { name: 'SMM-радар', status: 'up', latency: '89ms' },
  { name: 'PostMaker', status: 'up', latency: '34ms' },
  { name: 'RefBuilder', status: 'up', latency: '28ms' },
  { name: 'UTM Hub', status: 'up', latency: '21ms' },
  { name: 'TrendFinder', status: 'up', latency: '203ms' },
  { name: 'Telegram-уведомления', status: 'up', latency: '67ms' },
  { name: 'Личный кабинет', status: 'up', latency: '44ms' },
]

const statusConfig = {
  up: { label: 'Работает', color: '#15803D', bg: '#F0FDF4', dot: '#22C55E' },
  degraded: { label: 'Деградация', color: '#92400E', bg: '#FFF7ED', dot: '#F59E0B' },
  down: { label: 'Недоступен', color: '#991B1B', bg: '#FEF2F2', dot: '#EF4444' },
}

export default function StatusPage() {
  const allUp = services.every(s => s.status === 'up')

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, background: allUp ? '#F0FDF4' : '#FFF7ED',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32,
          }}>
            {allUp ? '✅' : '⚠️'}
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            {allUp ? 'Все системы работают нормально' : 'Часть систем недоступна'}
          </h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: 0 }}>
            Обновлено: {new Date().toLocaleString('ru', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 48 }}>
          {services.map(service => {
            const cfg = statusConfig[service.status as keyof typeof statusConfig]
            return (
              <div key={service.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', border: '1.5px solid #E2E8F0', borderRadius: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot }} />
                  <span style={{ fontSize: 15, fontWeight: 500, color: '#0F172A' }}>{service.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 13, color: '#94A3B8' }}>{service.latency}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '3px 10px', borderRadius: 20 }}>{cfg.label}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ background: '#F8FAFC', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <p style={{ fontSize: 15, color: '#475569', margin: '0 0 8px' }}>Обнаружили проблему?</p>
          <a href="https://t.me/dropstraffic" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 700, color: '#2563EB', textDecoration: 'none' }}>Сообщить в поддержку →</a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
