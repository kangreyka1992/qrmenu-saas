import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, orderId, description, email, plan_id, plan_name, plan_type } = body

    if (!amount || !orderId || !plan_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const shopId = process.env.YOOKASSA_SHOP_ID
    const secretKey = process.env.YOOKASSA_SECRET_KEY
    const appUrl = process.env.NEXT_PUBLIC_SITE_URL

    if (!shopId || !secretKey || !appUrl) {
      return NextResponse.json(
        { error: 'YooKassa credentials not configured' },
        { status: 500 }
      )
    }

    const idempotenceKey = `${orderId}-${Date.now()}`

    const paymentBody = {
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: `${appUrl}/payment/success`,
      },
      description: description || `Тариф «${plan_name}»`,
      metadata: {
        order_id: orderId,
        plan_id,
        plan_name,
        plan_type,
        email,
      },
    }

    const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64')

    const res = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotenceKey,
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(paymentBody),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('YooKassa API error:', data)
      return NextResponse.json(
        { error: data.description || 'Не удалось создать платёж' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      paymentUrl: data.confirmation.confirmation_url,
      paymentId: data.id,
    })
  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    )
  }
}