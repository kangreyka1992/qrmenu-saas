import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, payment_status, status')
      .eq('id', id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Отменяем только неоплаченные заказы
    if (order.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Нельзя отменить оплаченный заказ' },
        { status: 400 }
      )
    }

    await supabaseAdmin
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Cancel error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}