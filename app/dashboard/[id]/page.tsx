import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { CategoryForm, DishForm, DeleteButton } from './components'
import { deleteCategory, deleteDish } from './actions'

export default async function EditRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!restaurant) notFound()

  const { data: categories } = await supabase
    .from('categories')
    .select('*, dishes(*)')
    .eq('restaurant_id', restaurant.id)
    .order('sort_order')

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-[#8a92a3] text-sm inline-block mb-4">
          ← Назад
        </Link>

        {/* Заголовок */}
        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/10 mb-6">
          <h1 className="text-2xl font-black text-white mb-2">{restaurant.name}</h1>
          <p className="text-sm text-[#8a92a3] mb-4">
            Публичная ссылка:{' '}
            <Link href={`/menu/${restaurant.slug}`} target="_blank" className="text-[#ff9b26] font-bold">
              /menu/{restaurant.slug}
            </Link>
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link
              href={`/dashboard/${restaurant.id}/qr`}
              className="inline-block px-5 py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg"
            >
              📱 QR-код для печати
            </Link>
            <Link
              href={`/dashboard/${restaurant.id}/settings`}
              className="inline-block px-5 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-lg"
            >
              ⚙️ Настройки заведения
            </Link>
          </div>
        </div>

        {/* Кнопка добавить категорию */}
        <div className="mb-4">
          <CategoryForm restaurantId={restaurant.id} slug={restaurant.slug} />
        </div>

        {/* Категории и блюда */}
        {!categories?.length ? (
          <div className="text-center py-10 bg-[#1a1d24] rounded-2xl border border-white/10">
            <p className="text-[#8a92a3]">Пока нет категорий</p>
            <p className="text-sm text-[#5a6373] mt-2">
              Нажмите «Добавить категорию», чтобы начать
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat: any) => (
              <div key={cat.id} className="bg-[#1a1d24] rounded-2xl border border-white/10 p-5">
                {/* Заголовок категории */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-white">
                    {cat.icon} {cat.name}
                  </h2>
                  <DeleteButton
                    action={deleteCategory}
                    hiddenFields={{
                      category_id: cat.id,
                      restaurant_id: restaurant.id,
                      slug: restaurant.slug,
                    }}
                    confirmText={`Удалить категорию "${cat.name}"? Все блюда тоже удалятся.`}
                  />
                </div>

                {/* Список блюд */}
                <div className="space-y-2 mb-3">
                  {cat.dishes?.map((dish: any) => (
                    <div
                      key={dish.id}
                      className="flex gap-3 p-3 bg-[#0a0e14] rounded-lg items-center"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#1a1d24] overflow-hidden flex-shrink-0 flex items-center justify-center text-xl">
                        {dish.image_url ? (
                          <img
                            src={dish.image_url}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          '🍽'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white">{dish.name}</div>
                        {dish.description && (
                          <div className="text-xs text-[#8a92a3] line-clamp-1">
                            {dish.description}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-black text-[#ff9b26] whitespace-nowrap">
                        {dish.price} ₽
                      </div>
                      <DeleteButton
                        action={deleteDish}
                        hiddenFields={{
                          dish_id: dish.id,
                          restaurant_id: restaurant.id,
                          slug: restaurant.slug,
                        }}
                        confirmText={`Удалить "${dish.name}"?`}
                      />
                    </div>
                  ))}
                </div>

                {/* Форма добавления блюда */}
                <DishForm
                  categoryId={cat.id}
                  restaurantId={restaurant.id}
                  slug={restaurant.slug}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}