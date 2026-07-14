'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, isConfigured } from '@/lib/supabase/client'
import { loginLocal } from '@/lib/auth/local'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!isConfigured()) {
        // Local auth — no Supabase needed
        const result = loginLocal(email, password)
        if (result.error) { setError(result.error); return }
        router.push('/dashboard')
        return
      }
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError('Неверный email или пароль'); return }
      router.push('/dashboard')
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
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Войти в аккаунт</h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 32px' }}>
            Нет аккаунта?{' '}
            <Link href="/auth/register" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>Зарегистрироваться</Link>
          </p>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#DC2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 15, outline: 'none', fontFamily: 'inherit', color: '#0F172A', background: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Пароль</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="Введите пароль"
                style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 15, outline: 'none', fontFamily: 'inherit', color: '#0F172A', background: '#fff' }}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              padding: '13px', borderRadius: 12, border: 'none', background: '#A3E635', color: '#0F172A',
              fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, fontFamily: 'inherit', marginTop: 4,
            }}>
              {loading ? 'Входим...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
