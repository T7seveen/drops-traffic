import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { clientId, apiKey, endpoint, body } = await req.json()
    if (!clientId || !apiKey || !endpoint) {
      return NextResponse.json({ error: 'clientId, apiKey и endpoint обязательны' }, { status: 400 })
    }

    const res = await fetch(`https://api-seller.ozon.ru${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-Id': String(clientId),
        'Api-Key': String(apiKey),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body ?? {}),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Ошибка соединения с Ozon API', detail: String(e) }, { status: 502 })
  }
}
