'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateRestaurant(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const address = (formData.get('address') as string) || null
  const phone = (formData.get('phone') as string) || null
  const work_hours = (formData.get('work_hours') as string) || null
  const primary_color = (formData.get('primary_color') as string) || '#d4a574'
  const logo_url = (formData.get('logo_url') as string) || null
  const telegram_chat_id = (formData.get('telegram_chat_id') as string) || null

  // Получаем slug для ревалидации публичной страницы
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('slug')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!restaurant) throw new Error('Restaurant not found')

  const { error } = await supabase
    .from('restaurants')
    .update({
      name,
      address,
      phone,
      work_hours,
      primary_color,
      logo_url,
      telegram_chat_id,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  // Обновляем кэш
  revalidatePath(`/dashboard/${id}`)
  revalidatePath(`/dashboard/${id}/settings`)
  revalidatePath(`/menu/${restaurant.slug}`)
}