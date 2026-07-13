import { NextResponse } from 'next/server'
import { isConfigured } from '@/lib/supabase/client'
import { createClient, getUserRole } from '@/lib/supabase/server'

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ posts: MOCK_POSTS })
  }
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id,title,slug,excerpt,cover_url,published_at,read_time')
      .eq('published', true)
      .order('published_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ posts: data })
  } catch {
    return NextResponse.json({ error: 'Ошибка загрузки статей' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ error: 'Сервис временно недоступен' }, { status: 503 })
  }
  const role = await getUserRole()
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  }
  try {
    const body = await request.json()
    const { title, slug, content, excerpt, cover_url, read_time } = body
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
    }
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({ title, slug, content, excerpt, cover_url, read_time, published: true, published_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ post: data })
  } catch {
    return NextResponse.json({ error: 'Ошибка создания статьи' }, { status: 500 })
  }
}

const MOCK_POSTS = [
  {
    id: '1',
    title: 'Как считать юнит-экономику дропшиппинга: полное руководство 2025',
    slug: 'unit-economics-dropshipping-2025',
    excerpt: 'Разбираем CAC, ROAS, LTV и маржу на реальных примерах. Почему большинство дропшипперов уходят в минус и как это исправить.',
    cover_url: null,
    published_at: '2025-06-15T10:00:00Z',
    read_time: 8,
  },
  {
    id: '2',
    title: 'Wildberries vs Ozon 2025: где выгоднее продавать в СНГ',
    slug: 'wildberries-vs-ozon-2025',
    excerpt: 'Сравниваем комиссии, логистику, алгоритмы продвижения и аудиторию двух крупнейших маркетплейсов России.',
    cover_url: null,
    published_at: '2025-06-08T10:00:00Z',
    read_time: 12,
  },
  {
    id: '3',
    title: 'Топ-7 трендовых ниш для дропшиппинга: что покупают прямо сейчас',
    slug: 'top-7-dropshipping-niches-2025',
    excerpt: 'Анализ 500 000 транзакций на WB и Ozon показал неожиданные категории с высокой маржой и низкой конкуренцией.',
    cover_url: null,
    published_at: '2025-05-28T10:00:00Z',
    read_time: 6,
  },
]
