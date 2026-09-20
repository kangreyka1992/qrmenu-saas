import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createYookassaPayment } from '@/lib/yookassa'
import { getPlan } from '@/lib/plans'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = await request.json()

    const plan = getPlan(planId)
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const payment = await createYookassaPayment({
      amount: plan.price,
      description: `Подписка QRMenu — ${plan.name}`,
      returnUrl: `${siteUrl}/dashboard/subscription?payment=success`,
      metadata: {
        user_id: user.id,
        plan_id: plan.id,
      },
    })

    // Сохраняем платёж в БД
    await supabase.from('payments').insert({
      user_id: user.id,
      plan: plan.id,
      amount: plan.price,
      status: 'pending',
      yookassa_payment_id: payment.id,
      yookassa_confirmation_url: payment.confirmation.confirmation_url,
    })

    return NextResponse.json({
      paymentId: payment.id,
      confirmationUrl: payment.confirmation.confirmation_url,
    })
  } catch (error: any) {
    console.error('Payment create error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment creation failed' },
      { status: 500 }
    )
  }
}