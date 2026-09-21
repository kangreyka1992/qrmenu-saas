'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateRestaurant(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const work_hours = formData.get('work_hours') as string
  const primary_color = formData.get('primary_color') as string
  const logo_url = formData.get('logo_url') as string

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('slug')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!restaurant) throw new Error('Not found')

  await supabase
    .from('restaurants')
    .update({
      name,
      address: address || null,
      phone: phone || null,
      work_hours: work_hours || null,
      primary_color,
      logo_url: logo_url || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  revalidatePath(`/dashboard/${id}`)
  revalidatePath('/menu/' + restaurant.slug)
}