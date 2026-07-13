import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = { title: 'Политика конфиденциальности — Drops Traffic' }

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Какие данные мы собираем',
      text: 'Мы собираем данные, которые вы предоставляете при регистрации (имя, email, пароль в зашифрованном виде), а также данные об использовании сервиса: страницы, которые вы посещаете, функции, которые используете, и технические данные (IP-адрес, тип браузера, операционная система).',
    },
    {
      title: '2. Как мы используем данные',
      text: 'Данные используются для: предоставления и улучшения сервиса, отправки уведомлений о важных изменениях, технической поддержки, аналитики использования платформы. Мы не продаём ваши данные третьим лицам.',
    },
    {
      title: '3. Файлы cookie',
      text: 'Мы используем необходимые cookie для работы сервиса (сессии, аутентификация) и аналитические cookie для улучшения платформы. Вы можете отказаться от аналитических cookie через баннер при первом посещении.',
    },
    {
      title: '4. Хранение и защита данных',
      text: 'Данные хранятся на серверах в России. Пароли хранятся в зашифрованном виде (bcrypt). Мы используем HTTPS для всех соединений. Доступ к данным ограничен сотрудниками, которым он необходим для выполнения работы.',
    },
    {
      title: '5. Передача данных третьим лицам',
      text: 'Мы можем передавать данные только: по требованию законодательства РФ, платёжным системам для обработки транзакций (только необходимые данные), сервисам аналитики (в анонимизированном виде).',
    },
    {
      title: '6. Ваши права',
      text: 'Вы имеете право: получить копию своих данных, исправить неточные данные, удалить аккаунт и все связанные данные, ограничить обработку данных. Для реализации прав обратитесь по адресу hello@drops-traffic.ru.',
    },
    {
      title: '7. Изменения политики',
      text: 'Мы уведомим вас об изменениях политики конфиденциальности по email не менее чем за 7 дней до их вступления в силу.',
    },
  ]

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 32px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.8px' }}>Политика конфиденциальности</h1>
        <p style={{ fontSize: 14, color: '#94A3B8', margin: '0 0 48px' }}>Последнее обновление: 1 января 2026</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {sections.map(s => (
            <div key={s.title}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 12px' }}>{s.title}</h2>
              <p style={{ fontSize: 15, color: '#475569', margin: 0, lineHeight: 1.75 }}>{s.text}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, padding: 24, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
            Вопросы по защите данных: <a href="mailto:hello@drops-traffic.ru" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>hello@drops-traffic.ru</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
