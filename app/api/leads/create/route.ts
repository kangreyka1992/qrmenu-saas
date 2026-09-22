import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurant_name, name, phone, telegram, comment, email, user_id } =
      body

    if (!restaurant_name || !name || !phone) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('leads').insert({
      restaurant_name,
      name,
      phone,
      telegram: telegram || null,
      comment: comment || null,
      email: email || null,
      user_id: user_id || null,
      status: 'new',
    })

    if (error) throw error

    // Уведомление админу в Telegram
    const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID
    if (adminChatId && process.env.TELEGRAM_BOT_TOKEN) {
      await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: adminChatId,
            text: `🎉 <b>Новый клиент оплатил!</b>\n\n🏪 ${restaurant_name}\n👤 ${name}\n📞 ${phone}\n💬 ${telegram || '—'}\n📝 ${comment || '—'}\n📧 ${email}`,
            parse_mode: 'HTML',
          }),
        }
      ).catch((e) => console.error('Telegram error:', e))
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Lead error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}