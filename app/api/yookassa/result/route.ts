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

    // ═══ УСПЕШНАЯ ОПЛАТА ═══
    if (event === 'payment.succeeded') {
      const paymentId = payment.id
      const planId = payment?.metadata?.plan_id
      const planName = payment?.metadata?.plan_name
      const planType = payment?.metadata?.plan_type
      const email = payment?.metadata?.email

      // 1. Обновляем статус в payments
      await supabaseAdmin
        .from('payments')
        .update({
          status: 'succeeded',
          updated_at: new Date().toISOString(),
        })
        .eq('payment_id', paymentId)

      if (!email) {
        console.error('No email in metadata')
        return NextResponse.json({ ok: false }, { status: 400 })
      }

      // 2. Находим пользователя по email
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const user = users?.users?.find((u) => u.email === email)

      if (!user) {
        console.error('User not found:', email)
        return NextResponse.json({ ok: false }, { status: 404 })
      }

      // 3. Активируем подписку
      if (planType === 'lifetime') {
        // Навсегда
        await supabaseAdmin
          .from('subscriptions')
          .update({
            plan: planId,
            plan_type: 'lifetime',
            status: 'active',
            current_period_ends_at: null,
            trial_ends_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)

        console.log('Lifetime activated:', planId, 'for', email)
      } else {
        // Подписка — +1 месяц
        const nextMonth = new Date()
        nextMonth.setMonth(nextMonth.getMonth() + 1)

        await supabaseAdmin
          .from('subscriptions')
          .update({
            plan: planId,
            plan_type: 'subscription',
            status: 'active',
            current_period_ends_at: nextMonth.toISOString(),
            trial_ends_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)

        console.log('Subscription activated:', planId, 'for', email)
      }

      // 4. Уведомление админу
      const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID
      const botToken = process.env.TELEGRAM_BOT_TOKEN

      if (adminChatId && botToken) {
        await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: adminChatId,
              text: `💰 <b>Новая оплата!</b>\n\nТариф: ${planName}\nСумма: ${payment.amount.value} ₽\nEmail: ${email}\nТип: ${planType === 'lifetime' ? 'Навсегда' : 'Подписка'}`,
              parse_mode: 'HTML',
            }),
          }
        ).catch((e) => console.error('Telegram error:', e))
      }
    }

    // ═══ ОТМЕНА ═══
    if (event === 'payment.canceled') {
      const paymentId = payment.id

      await supabaseAdmin
        .from('payments')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('payment_id', paymentId)

      console.log('Payment canceled:', paymentId)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('YooKassa webhook error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

// GET для проверки, что роут живой
export async function GET() {
  return NextResponse.json({ status: 'YooKassa webhook is alive' })
}