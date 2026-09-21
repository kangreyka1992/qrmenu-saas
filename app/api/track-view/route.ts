import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { restaurantId, dishId, type } = await request.json()

    if (type === 'menu' && restaurantId) {
      await supabaseAdmin.from('menu_views').insert({
        restaurant_id: restaurantId,
        user_agent: request.headers.get('user-agent') || null,
      })
    }

    if (type === 'dish' && dishId && restaurantId) {
      await supabaseAdmin.from('dish_views').insert({
        dish_id: dishId,
        restaurant_id: restaurantId,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Track error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}