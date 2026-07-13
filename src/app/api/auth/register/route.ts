import { NextResponse } from 'next/server'
import { isConfigured } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ error: 'Сервис временно недоступен' }, { status: 503 })
  }
  try {
    const { email, password, name } = await request.json()
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Пароль должен быть не менее 8 символов' }, { status: 400 })
    }
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: name,
        email,
        role: 'user',
      })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
