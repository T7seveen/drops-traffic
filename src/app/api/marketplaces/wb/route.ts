import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { apiKey, endpoint, params } = await req.json()
    if (!apiKey || !endpoint) {
      return NextResponse.json({ error: 'apiKey и endpoint обязательны' }, { status: 400 })
    }

    const url = new URL(`https://statistics-api.wildberries.ru${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Authorization': String(apiKey) },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Ошибка соединения с WB API', detail: String(e) }, { status: 502 })
  }
}
