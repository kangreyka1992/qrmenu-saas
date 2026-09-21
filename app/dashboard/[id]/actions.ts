'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ═══ КАТЕГОРИИ ═══
export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const restaurantId = formData.get('restaurant_id') as string
  const name = formData.get('name') as string
  const icon = formData.get('icon') as string || '🍽'
  const slug = formData.get('slug') as string

  const { error } = await supabase.from('categories').insert({
    restaurant_id: restaurantId,
    name,
    icon,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${restaurantId}`)
  revalidatePath('/menu/' + slug)
}

export async function deleteCategory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const categoryId = formData.get('category_id') as string
  const restaurantId = formData.get('restaurant_id') as string
  const slug = formData.get('slug') as string

  await supabase.from('categories').delete().eq('id', categoryId)

  revalidatePath(`/dashboard/${restaurantId}`)
  revalidatePath('/menu/' + slug)
}

export async function updateCategory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const categoryId = formData.get('category_id') as string
  const name = formData.get('name') as string
  const icon = formData.get('icon') as string
  const restaurantId = formData.get('restaurant_id') as string
  const slug = formData.get('slug') as string

  await supabase
    .from('categories')
    .update({ name, icon })
    .eq('id', categoryId)

  revalidatePath(`/dashboard/${restaurantId}`)
  revalidatePath('/menu/' + slug)
}

// ═══ БЛЮДА ═══
export async function createDish(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const categoryId = formData.get('category_id') as string
  const restaurantId = formData.get('restaurant_id') as string
  const slug = formData.get('slug') as string
  const name = formData.get('name') as string
  const name_en = (formData.get('name_en') as string) || null
  const description = (formData.get('description') as string) || null
  const description_en = (formData.get('description_en') as string) || null
  const price = parseInt(formData.get('price') as string)
  const imageUrl = (formData.get('image_url') as string) || null

  const { error } = await supabase.from('dishes').insert({
    category_id: categoryId,
    name,
    name_en,
    description,
    description_en,
    price,
    image_url: imageUrl,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${restaurantId}`)
  revalidatePath('/menu/' + slug)
}

export async function deleteDish(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const dishId = formData.get('dish_id') as string
  const restaurantId = formData.get('restaurant_id') as string
  const slug = formData.get('slug') as string

  await supabase.from('dishes').delete().eq('id', dishId)

  revalidatePath(`/dashboard/${restaurantId}`)
  revalidatePath('/menu/' + slug)
}

export async function toggleDishAvailability(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const dishId = formData.get('dish_id') as string
  const restaurantId = formData.get('restaurant_id') as string
  const slug = formData.get('slug') as string

  const { data: dish } = await supabase
    .from('dishes')
    .select('is_available')
    .eq('id', dishId)
    .single()

  if (!dish) throw new Error('Dish not found')

  await supabase
    .from('dishes')
    .update({ is_available: !dish.is_available })
    .eq('id', dishId)

  revalidatePath(`/dashboard/${restaurantId}`)
  revalidatePath('/menu/' + slug)
}

export async function moveDish(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const dishId = formData.get('dish_id') as string
  const direction = formData.get('direction') as 'up' | 'down'
  const restaurantId = formData.get('restaurant_id') as string
  const slug = formData.get('slug') as string

  const { data: dish } = await supabase
    .from('dishes')
    .select('id, sort_order, category_id')
    .eq('id', dishId)
    .single()

  if (!dish) throw new Error('Dish not found')

  const { data: neighbors } = await supabase
    .from('dishes')
    .select('id, sort_order')
    .eq('category_id', dish.category_id)
    .order('sort_order', { ascending: true })

  if (!neighbors) return

  const currentIdx = neighbors.findIndex((d) => d.id === dishId)
  const swapIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1

  if (swapIdx < 0 || swapIdx >= neighbors.length) return

  const neighbor = neighbors[swapIdx]

  await supabase
    .from('dishes')
    .update({ sort_order: neighbor.sort_order })
    .eq('id', dish.id)

  await supabase
    .from('dishes')
    .update({ sort_order: dish.sort_order })
    .eq('id', neighbor.id)

  revalidatePath(`/dashboard/${restaurantId}`)
  revalidatePath('/menu/' + slug)
}

// ═══ ЗАГРУЗКА ФОТО ═══
export async function uploadDishImage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const file = formData.get('file') as File
  if (!file) throw new Error('No file')

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  const { error } = await supabase.storage
    .from('dish-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage
    .from('dish-images')
    .getPublicUrl(fileName)

  return publicUrl
}