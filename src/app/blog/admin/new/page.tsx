'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function BlogAdminNewPage() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [readTime, setReadTime] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function toSlug(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!slug || slug === toSlug(title)) setSlug(toSlug(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, excerpt, content, read_time: readTime }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Ошибка'); return }
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: 0 }}>Новая статья</h1>
          <Link href="/blog" style={{ fontSize: 14, color: '#64748B', textDecoration: 'none' }}>← Блог</Link>
        </div>

        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#DC2626' }}>{error}</div>}
        {success && <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#15803D' }}>Статья опубликована!</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { label: 'Заголовок*', value: title, onChange: handleTitleChange, placeholder: 'Заголовок статьи', type: 'text' },
            { label: 'URL (slug)*', value: slug, onChange: (v: string) => setSlug(toSlug(v)), placeholder: 'url-stati', type: 'text' },
            { label: 'Краткое описание', value: excerpt, onChange: setExcerpt, placeholder: 'Анонс статьи (1-2 предложения)', type: 'text' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{f.label}</label>
              <input
                type={f.type} value={f.value} onChange={e => f.onChange(e.target.value)} required={f.label.includes('*')}
                placeholder={f.placeholder}
                style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 15, outline: 'none', fontFamily: 'inherit', color: '#0F172A' }}
              />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Время чтения (мин)</label>
            <input type="number" min={1} max={60} value={readTime} onChange={e => setReadTime(Number(e.target.value))}
              style={{ width: 100, padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 15, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Содержание* (Markdown)</label>
            <textarea
              value={content} onChange={e => setContent(e.target.value)} required
              placeholder="## Заголовок раздела&#10;&#10;Текст статьи..."
              rows={20}
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'monospace', resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading || success} style={{
              padding: '12px 28px', borderRadius: 10, border: 'none', background: '#A3E635', color: '#0F172A',
              fontWeight: 700, fontSize: 15, cursor: (loading || success) ? 'not-allowed' : 'pointer',
              opacity: (loading || success) ? 0.7 : 1, fontFamily: 'inherit',
            }}>
              {loading ? 'Публикуем...' : 'Опубликовать'}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}
