import { cookies } from 'next/headers'

export interface LocalSession {
  id: string
  email: string
  name: string
  role: string
}

export async function getLocalSession(): Promise<LocalSession | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get('dt-local-session')?.value
  if (!raw) return null
  try {
    return JSON.parse(decodeURIComponent(atob(raw))) as LocalSession
  } catch { return null }
}
