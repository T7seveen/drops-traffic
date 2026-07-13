import { NextResponse } from 'next/server'
import { isConfigured } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ error: 'Сервис временно недоступен' }, { status: 503 })
  }
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Введите email и пароль' }, { status: 400 })
    }
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
