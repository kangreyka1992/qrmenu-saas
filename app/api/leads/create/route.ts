import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurant_name, name, phone, telegram, comment, email, user_id } = body

    if (!restaurant_name || !name || !phone) {
      return NextResponse.json(
        { error: 'Заполните обязательные поля' },
        { status: 400 }
      )
    }

    // ═══ Сохраняем в БД ═══
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        restaurant_name,
        name,
        phone,
        telegram: telegram || null,
        comment: comment || null,
        email: email || null,
        user_id: user_id || null,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      console.error('DB error:', error)
      throw new Error(error.message)
    }

    console.log('Lead saved:', data.id)

    // ═══ Уведомление в Telegram ═══
    const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (adminChatId && botToken) {
      try {
        await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: adminChatId,
              text: `🎉 <b>Новый клиент!</b>\n\n🏪 ${restaurant_name}\n👤 ${name}\n📞 ${phone}\n💬 ${telegram || '—'}\n📝 ${comment || '—'}\n📧 ${email || '—'}`,
              parse_mode: 'HTML',
            }),
          }
        )
      } catch (tgError) {
        console.error('Telegram error:', tgError)
        // Не блокируем — заявка уже сохранена
      }
    }

    return NextResponse.json({ ok: true, id: data.id })
  } catch (error: any) {
    console.error('Lead error:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка сервера' },
      { status: 500 }
    )
  }
}