import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Order ID missing' }, { status: 400 })
    }

    // Загружаем заказ
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, total_amount, customer_name, customer_phone')
      .eq('id', id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
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

    // Создаём платёж в ЮKassa
    const idempotenceKey = `${order.id}-${Date.now()}`

    const paymentBody = {
      amount: {
        value: order.total_amount.toFixed(2),
        currency: 'RUB',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: `${appUrl}/payment/success`,
      },
      description: `Оплата заказа №${order.id.slice(0, 8).toUpperCase()}`,
      metadata: {
        order_id: order.id,
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

    // Сохраняем ID платежа ЮKassa в заказ для вебхука
    await supabaseAdmin
      .from('orders')
      .update({ robokassa_inv_id: data.id })
      .eq('id', order.id)

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