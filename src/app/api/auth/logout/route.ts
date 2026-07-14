import { NextResponse } from 'next/server'
import { isConfigured } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const res = NextResponse.json({ success: true })
  // Always clear local session cookie
  res.cookies.set('dt-local-session', '', { path: '/', maxAge: 0 })

  if (!isConfigured()) {
    return res
  }
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return res
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
