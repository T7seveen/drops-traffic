import { NextResponse } from 'next/server'
import { isConfigured } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  if (!isConfigured()) {
    return NextResponse.json({ success: true })
  }
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
