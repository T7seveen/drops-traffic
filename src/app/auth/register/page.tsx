'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, isConfigured } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Пароль должен быть не менее 8 символов'); return }
    setLoading(true)
    try {
      if (!isConfigured()) {
        setError('Регистрация временно недоступна — сервис в режиме демонстрации.')
        return
      }
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      })
      if (error) { setError(error.message); return }
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #E2E8F0' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: '#A3E635', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#0F172A' }}>D</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>Drops <span style={{ color: '#3B82F6' }}>Traffic</span></span>
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Создать аккаунт</h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 32px' }}>
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>Войти</Link>
          </p>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#DC2626' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#15803D' }}>
              Аккаунт создан! Проверьте почту для подтверждения. Перенаправляем...
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Имя', value: name, setter: setName, type: 'text', placeholder: 'Ваше имя' },
              { label: 'Email', value: email, setter: setEmail, type: 'email', placeholder: 'you@example.com' },
              { label: 'Пароль', value: password, setter: setPassword, type: 'password', placeholder: 'Минимум 8 символов' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type} value={f.value} onChange={e => f.setter(e.target.value)} required
                  placeholder={f.placeholder}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 15, outline: 'none', fontFamily: 'inherit', color: '#0F172A', background: '#fff' }}
                />
              </div>
            ))}
            <button type="submit" disabled={loading || success} style={{
              padding: '13px', borderRadius: 12, border: 'none', background: '#A3E635', color: '#0F172A',
              fontWeight: 700, fontSize: 16, cursor: (loading || success) ? 'not-allowed' : 'pointer',
              opacity: (loading || success) ? 0.7 : 1, fontFamily: 'inherit', marginTop: 4,
            }}>
              {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </button>
            <p style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
              Регистрируясь, вы соглашаетесь с{' '}
              <Link href="/terms" style={{ color: '#64748B' }}>условиями использования</Link> и{' '}
              <Link href="/privacy" style={{ color: '#64748B' }}>политикой конфиденциальности</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
