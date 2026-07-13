'use client'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { href: '#tools', label: 'Инструменты' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#blog', label: 'Блог' },
  { href: '/dashboard', label: 'Кабинет' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50, height: 60,
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9, background: '#A3E635',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 16, color: '#0F172A',
        }}>D</div>
        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px', color: '#0F172A' }}>
          Drops <span style={{ color: '#3B82F6' }}>Traffic</span>
        </span>
      </Link>

      {/* Desktop nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
        {navLinks.map(l => (
          <a key={l.href} href={l.href} className="nav-link" style={{
            padding: '8px 14px', borderRadius: 8,
            color: '#64748B', fontSize: 14, fontWeight: 500,
            textDecoration: 'none', transition: 'all 150ms',
          }}>{l.label}</a>
        ))}
      </nav>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/auth/login" style={{
          fontSize: 14, fontWeight: 600, color: '#0F172A',
          textDecoration: 'none', padding: '8px 16px',
        }} className="hidden-mobile">Войти</Link>
        <Link href="/auth/register" className="btn-lime" style={{
          fontSize: 14, fontWeight: 700, color: '#0F172A',
          textDecoration: 'none', padding: '9px 18px',
          background: '#A3E635', borderRadius: 10, transition: 'background 150ms',
        }}>Начать бесплатно</Link>

        {/* Burger */}
        <button
          onClick={() => setOpen(!open)}
          className="show-mobile"
          style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', padding: 8, color: '#0F172A',
          }}
          aria-label="Меню"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {open
              ? <path d="M4 4l12 12M4 16L16 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              : <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'absolute', top: 60, left: 0, right: 0,
          background: '#fff', borderBottom: '1px solid #E2E8F0',
          padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 4,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              padding: '10px 12px', borderRadius: 8, color: '#64748B',
              fontSize: 15, fontWeight: 500, textDecoration: 'none',
            }}>{l.label}</a>
          ))}
          <Link href="/auth/login" onClick={() => setOpen(false)} style={{
            padding: '10px 12px', fontSize: 15, fontWeight: 600,
            color: '#0F172A', textDecoration: 'none',
          }}>Войти</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
