import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getYookassaPayment } from '@/lib/yookassa'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const event = body.event
    const paymentId = body.object?.id

    if (!paymentId) {
      return NextResponse.json({ error: 'No payment id' }, { status: 400 })
    }

    if (event !== 'payment.succeeded') {
      return NextResponse.json({ ok: true })
    }

    // Проверяем платёж в ЮKassa
    const payment = await getYookassaPayment(paymentId)

    if (!payment.paid) {
      return NextResponse.json({ ok: true })
    }

    const userId = payment.metadata.user_id
    const planId = payment.metadata.plan_id

    if (!userId || !planId) {
      return NextResponse.json({ error: 'No metadata' }, { status: 400 })
    }

    // Обновляем платёж
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('yookassa_payment_id', paymentId)

    // Обновляем подписку
    const periodEnd = new Date()
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan: planId,
        status: 'active',
        current_period_ends_at: periodEnd.toISOString(),
      }, { onConflict: 'user_id' })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}