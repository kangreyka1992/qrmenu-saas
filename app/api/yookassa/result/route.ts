import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const event = body.event
    const payment = body.object

    console.log('YooKassa webhook:', event, payment?.id)

    if (event === 'payment.succeeded') {
      const orderId = payment?.metadata?.order_id

      if (!orderId) {
        console.error('No order_id in metadata')
        return NextResponse.json({ ok: false }, { status: 400 })
      }

      // Обновляем заказ
      const { error } = await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'accepted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)

      if (error) {
        console.error('Failed to update order:', error)
        return NextResponse.json({ ok: false }, { status: 500 })
      }

      console.log('Order paid:', orderId)
    }

    if (event === 'payment.canceled') {
      const orderId = payment?.metadata?.order_id

      if (orderId) {
        await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('YooKassa webhook error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}