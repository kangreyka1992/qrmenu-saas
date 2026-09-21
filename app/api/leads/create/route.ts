import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || ''
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurant_name, contact_name, phone, telegram, email, comment } = body

    if (!restaurant_name || !contact_name || !phone) {
      return NextResponse.json(
        { error: 'Заполните обязательные поля' },
        { status: 400 }
      )
    }

    // Сохраняем заявку в БД
    const { data: lead, error } = await supabaseAdmin
      .from('leads')
      .insert({
        restaurant_name,
        contact_name,
        phone,
        telegram: telegram || null,
        email: email || null,
        comment: comment || null,
        status: 'new',
      })
      .select()
      .single()

    if (error) throw error

    // Отправляем уведомление админу в Telegram
    if (ADMIN_CHAT_ID && BOT_TOKEN) {
      const message = `
🔔 <b>НОВАЯ ЗАЯВКА!</b>

🏪 <b>${restaurant_name}</b>
👤 ${contact_name}
📞 ${phone}
${telegram ? `💬 Telegram: ${telegram}\n` : ''}${email ? `📧 Email: ${email}\n` : ''}${comment ? `\n💭 ${comment}\n` : ''}
━━━━━━━━━━━━━━━
🆔 Заявка: <code>${lead.id}</code>

Свяжись с клиентом в течение часа!
`.trim()

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }).catch((e) => console.error('Telegram notify error:', e))
    }

    return NextResponse.json({ ok: true, lead_id: lead.id })
  } catch (error: any) {
    console.error('Lead error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}