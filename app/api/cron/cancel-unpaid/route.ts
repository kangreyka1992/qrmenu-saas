import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  // Проверка секрета, чтобы cron мог вызвать только Vercel
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const fifteenMinutesAgo = new Date(
    Date.now() - 15 * 60 * 1000
  ).toISOString()

  // Отменяем неоплаченные онлайн-заказы старше 15 минут
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('payment_status', 'unpaid')
    .eq('status', 'new')
    .eq('payment_method', 'online')
    .lt('created_at', fifteenMinutesAgo)
    .select('id, customer_name, total_amount')

  if (error) {
    console.error('Cron cancel error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log(`Cancelled ${data?.length || 0} unpaid orders`)

  return NextResponse.json({
    ok: true,
    cancelled: data?.length || 0,
    orders: data?.map((o) => o.id) || [],
  })
}