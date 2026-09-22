import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      slug,
      customer_name,
      customer_phone,
      customer_comment,
      table_number,
      items,
    } = body

    if (!slug || !customer_name || !customer_phone || !items?.length) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { data: restaurant, error: restaurantError } = await supabaseAdmin
      .from('restaurants')
      .select('id, name, telegram_chat_id')
      .eq('slug', slug)
      .single()

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const total_amount = items.reduce(
      (sum: number, i: any) => sum + i.price * i.quantity,
      0
    )

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        restaurant_id: restaurant.id,
        customer_name,
        customer_phone,
        customer_comment: customer_comment || null,
        table_number: table_number || null,
        total_amount,
        status: 'new',
        payment_status: 'unpaid',
        payment_method: 'at_venue',
      })
      .select()
      .single()

    if (orderError) throw orderError

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(
        items.map((i: any) => ({
          order_id: order.id,
          dish_id: i.dish_id || null,
          dish_name: i.dish_name,
          price: i.price,
          quantity: i.quantity,
        }))
      )

    if (itemsError) throw itemsError

    if (restaurant.telegram_chat_id) {
      await sendTelegramNotification(
        restaurant.telegram_chat_id,
        order.id,
        restaurant.name,
        customer_name,
        customer_phone,
        customer_comment,
        table_number,
        total_amount,
        items
      ).catch((e) => console.error('Telegram error:', e))
    }

    return NextResponse.json({
      ok: true,
      order_id: order.id,
      total: total_amount,
    })
  } catch (error: any) {
    console.error('Order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function sendTelegramNotification(
  chatId: string,
  orderId: string,
  restaurantName: string,
  customerName: string,
  customerPhone: string,
  comment: string | null,
  tableNumber: string | null,
  total: number,
  items: any[]
) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

  if (!BOT_TOKEN) {
    console.warn('TELEGRAM_BOT_TOKEN не задан — уведомление не отправлено')
    return
  }

  const itemsText = items
    .map((i) => `  ${i.quantity}× ${i.dish_name} — ${i.price * i.quantity} ₽`)
    .join('\n')

  const shortId = orderId.slice(0, 8).toUpperCase()

  const message = `
🔔 <b>НОВЫЙ ЗАКАЗ #${shortId}</b>

📍 ${restaurantName}
${tableNumber ? `🪑 Стол: <b>${tableNumber}</b>\n` : ''}
👤 <b>${customerName}</b>
📞 ${customerPhone}

${comment ? `💬 ${comment}\n` : ''}
🛒 <b>Состав заказа:</b>
${itemsText}

━━━━━━━━━━━━━━━
💰 <b>Итого: ${total} ₽</b>
💵 Оплата на месте

Откройте панель управления, чтобы принять заказ.
`.trim()

  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    }
  )

  if (!res.ok) {
    throw new Error(`Telegram API error: ${await res.text()}`)
  }
}