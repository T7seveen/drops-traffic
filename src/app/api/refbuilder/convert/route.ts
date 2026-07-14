import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { program_id, ref_code, order_id, amount, currency = 'RUB', customer_email } = body

    if (!program_id || !ref_code || !order_id || !amount) {
      return NextResponse.json({ error: 'Missing required fields: program_id, ref_code, order_id, amount' }, { status: 400 })
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 })
    }

    // In demo/localStorage mode we can't access server-side store.
    // Real implementation would query the DB here.
    const conversionId = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    // Simulate commission calculation (10% default)
    const commission = amount * 0.1

    return NextResponse.json({
      success: true,
      conversion_id: conversionId,
      program_id,
      ref_code,
      order_id,
      amount,
      currency,
      commission,
      status: 'pending',
      hold_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/refbuilder/convert',
    description: 'Register a referral conversion',
    required_fields: ['program_id', 'ref_code', 'order_id', 'amount'],
    optional_fields: ['currency', 'customer_email'],
    example: {
      program_id: 'YOUR_PROGRAM_ID',
      ref_code: 'PARTNER123',
      order_id: 'ORD-456',
      amount: 5490,
      currency: 'RUB',
      customer_email: 'user@example.com',
    },
  })
}
