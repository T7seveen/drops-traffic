'use client'
import { useState } from 'react'

const TABS = ['JavaScript', 'API', 'Postback URL', 'UTM-метки']

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <pre style={{ background: '#0F172A', color: '#E2E8F0', borderRadius: 12, padding: '18px 20px', fontSize: 12, lineHeight: 1.7, overflowX: 'auto', margin: 0, fontFamily: 'monospace' }}>{code}</pre>
      <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }} style={{ position: 'absolute', top: 10, right: 10, padding: '5px 12px', borderRadius: 7, background: copied ? '#A3E635' : '#1E293B', color: copied ? '#0F172A' : '#94A3B8', border: '1px solid #334155', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
        {copied ? '✓ Скопировано' : 'Копировать'}
      </button>
    </div>
  )
}

export default function EmbedPage() {
  const [activeTab, setActiveTab] = useState('JavaScript')
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://drops-traffic.vercel.app'

  const jsCode = `<!-- RefBuilder Tracking Pixel -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['RefBuilder']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','rb','${baseUrl}/refbuilder.js'));
  rb('init', { programId: 'YOUR_PROGRAM_ID' });
</script>

<!-- При успешной конверсии (например, на странице спасибо) -->
<script>
  rb('conversion', {
    orderId: 'ORDER_123',
    amount: 5490,         // сумма заказа в рублях
    currency: 'RUB',
    ref: rb('getRef')     // автоматически читает реф-код из cookie/URL
  });
</script>`

  const apiCode = `# Регистрация конверсии через API
curl -X POST ${baseUrl}/api/refbuilder/convert \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "program_id": "YOUR_PROGRAM_ID",
    "ref_code": "PARTNER123",
    "order_id": "ORD-456",
    "amount": 5490,
    "currency": "RUB",
    "customer_email": "user@example.com"
  }'

# Ответ
{
  "success": true,
  "conversion_id": "conv_abc123",
  "commission": 549.00,
  "partner_id": "p_xyz789",
  "status": "pending"
}`

  const postbackCode = `# Postback URL для партнёрских сетей
# Настройте в вашей партнёрской сети:

${baseUrl}/api/refbuilder/postback?
  program_id=YOUR_PROGRAM_ID&
  click_id={click_id}&        # макрос вашей сети
  order_id={order_id}&
  amount={amount}&
  status={status}             # paid / cancelled

# Параметры поддерживаемых сетей:
# Admitad:  click_id={admitad_uid}&order_id={order_id}
# Gdeslon:  click_id={gds_uid}&amount={price}
# TradeTracker: click_id={tt_ref}&order_id={id}`

  const utmCode = `# Автоматическое UTM-трекинг (встроено в JS-пиксель)
# Партнёр получает ссылку вида:
${baseUrl}/r/PARTNER_CODE

# Пиксель автоматически добавляет UTM:
${baseUrl}/shop?
  utm_source=refbuilder&
  utm_medium=referral&
  utm_campaign=PROGRAM_SLUG&
  utm_content=PARTNER_CODE&
  ref=PARTNER_CODE

# Получить текущий ref в JavaScript:
const ref = RefBuilder.getRef()  // → 'PARTNER_CODE' или null

# В форме заказа добавьте скрытое поле:
<input type="hidden" name="ref" value="{{ RefBuilder.getRef() }}" />`

  const CONTENT: Record<string, string> = {
    'JavaScript': jsCode,
    'API': apiCode,
    'Postback URL': postbackCode,
    'UTM-метки': utmCode,
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>Интеграция</h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Подключите трекинг к вашему сайту за 5 минут</p>
      </div>

      {/* Quick start */}
      <div style={{ background: '#F7FEE7', border: '1.5px solid #A3E635', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#3F6212', marginBottom: 10 }}>Быстрый старт за 3 шага</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            '1. Вставьте JS-пиксель в <head> вашего сайта',
            '2. Вызовите rb(\'conversion\', {...}) при успешной оплате',
            '3. Убедитесь, что реф-код считывается: rb(\'getRef\')',
          ].map(step => (
            <div key={step} style={{ fontSize: 13, color: '#4D7C0F', fontWeight: 500 }}>✓ {step}</div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '2px solid #E2E8F0' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 18px', border: 'none', background: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: activeTab === tab ? '#0F172A' : '#94A3B8', borderBottom: `2px solid ${activeTab === tab ? '#A3E635' : 'transparent'}`, marginBottom: -2 }}>
            {tab}
          </button>
        ))}
      </div>

      <CodeBlock code={CONTENT[activeTab]} />

      {/* Webhook */}
      <div style={{ marginTop: 24, background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '24px 28px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Webhook-уведомления</div>
        <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>Получайте события в реальном времени на ваш сервер</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input placeholder={`${baseUrl}/webhooks/refbuilder`} style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
          <button style={{ padding: '10px 20px', borderRadius: 10, background: '#0F172A', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Сохранить</button>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 10 }}>Поддерживаемые события:</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['conversion.created', 'conversion.approved', 'partner.joined', 'payout.requested', 'payout.completed'].map(e => (
              <code key={e} style={{ fontSize: 11, background: '#F8FAFC', padding: '4px 10px', borderRadius: 6, color: '#64748B', border: '1px solid #E2E8F0' }}>{e}</code>
            ))}
          </div>
        </div>
      </div>

      {/* SDK info */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {[
          { title: 'npm пакет', desc: 'Для Node.js / TypeScript проектов', code: 'npm install @refbuilder/sdk' },
          { title: 'PHP SDK', desc: 'Для WordPress и других PHP CMS', code: 'composer require refbuilder/sdk-php' },
        ].map(item => (
          <div key={item.title} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>{item.desc}</div>
            <code style={{ fontSize: 12, background: '#0F172A', color: '#A3E635', padding: '8px 12px', borderRadius: 8, display: 'block', fontFamily: 'monospace' }}>{item.code}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
