'use client'
import { useEffect, useState } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('dt-cookie-consent')
    if (!accepted) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('dt-cookie-consent', '1')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('dt-cookie-consent', '0')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      background: '#0F172A',
      color: '#fff',
      borderRadius: 16,
      padding: '20px 24px',
      maxWidth: 560,
      width: 'calc(100vw - 48px)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>🍪</span>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>Мы используем файлы cookie</p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
            Для аналитики и улучшения сервиса. Продолжая использовать Drops Traffic, вы соглашаетесь с нашей{' '}
            <a href="/privacy" style={{ color: '#A3E635', textDecoration: 'underline' }}>Политикой конфиденциальности</a>.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={decline} style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.7)',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: 13,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
          Отклонить
        </button>
        <button onClick={accept} style={{
          background: '#A3E635',
          border: 'none',
          color: '#0F172A',
          borderRadius: 8,
          padding: '8px 20px',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
          Принять все
        </button>
      </div>
    </div>
  )
}
