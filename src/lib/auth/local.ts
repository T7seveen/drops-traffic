'use client'

export interface LocalUser {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  pwd: string
}

const KEY = 'dt-local-users'
const COOKIE = 'dt-local-session'

function getUsers(): LocalUser[] {
  if (typeof localStorage === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function registerLocal(email: string, password: string, name: string): { user?: LocalUser; error?: string } {
  const users = getUsers()
  const norm = email.toLowerCase().trim()
  if (users.find(u => u.email === norm)) return { error: 'Пользователь с таким email уже существует' }
  const user: LocalUser = {
    id: 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    email: norm,
    name: name.trim(),
    role: users.length === 0 ? 'admin' : 'user',
    pwd: password,
  }
  localStorage.setItem(KEY, JSON.stringify([...users, user]))
  setSessionCookie(user)
  return { user }
}

export function loginLocal(email: string, password: string): { user?: LocalUser; error?: string } {
  const norm = email.toLowerCase().trim()
  const user = getUsers().find(u => u.email === norm)
  if (!user) return { error: 'Пользователь не найден' }
  if (user.pwd !== password) return { error: 'Неверный пароль' }
  setSessionCookie(user)
  return { user }
}

export function setSessionCookie(user: LocalUser) {
  const payload = { id: user.id, email: user.email, name: user.name, role: user.role }
  const encoded = btoa(encodeURIComponent(JSON.stringify(payload)))
  const exp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${COOKIE}=${encoded}; path=/; expires=${exp}; SameSite=Lax`
}

export function clearSessionCookie() {
  document.cookie = `${COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

export function getLocalSessionFromString(cookieStr: string): { id: string; email: string; name: string; role: string } | null {
  const m = cookieStr.match(/(?:^|;\s*)dt-local-session=([^;]+)/)
  if (!m) return null
  try { return JSON.parse(decodeURIComponent(atob(m[1]))) } catch { return null }
}
