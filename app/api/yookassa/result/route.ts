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
      const planId = payment?.metadata?.plan_id
      const planName = payment?.metadata?.plan_name
      const planType = payment?.metadata?.plan_type
      const email = payment?.metadata?.email

      if (!email) {
        console.error('No email in metadata')
        return NextResponse.json({ ok: false }, { status: 400 })
      }

      // Находим пользователя по email
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const user = users?.users?.find((u) => u.email === email)

      if (!user) {
        console.error('User not found:', email)
        return NextResponse.json({ ok: false }, { status: 404 })
      }

      if (planType === 'lifetime') {
        // Разовая оплата — навсегда
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

      // Уведомление админу
      const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID
      if (adminChatId && process.env.TELEGRAM_BOT_TOKEN) {
        await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: adminChatId,
              text: `💰 <b>Новая оплата!</b>\n\nТариф: ${planName}\nСумма: ${payment.amount.value} ₽\nEmail: ${email}`,
              parse_mode: 'HTML',
            }),
          }
        ).catch((e) => console.error('Telegram error:', e))
      }
    }

    if (event === 'payment.canceled') {
      console.log('Payment canceled:', payment?.id)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('YooKassa webhook error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'YooKassa webhook is alive' })
}