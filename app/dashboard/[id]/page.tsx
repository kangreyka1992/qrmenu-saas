import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { CategoryForm, DishForm, DeleteButton } from './components'
import EditCategoryForm from './EditCategoryForm'
import EditDishForm from './EditDishForm'
import {
  deleteCategory,
  deleteDish,
  toggleDishAvailability,
  moveDish,
} from './actions'

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

  // Считаем новые заказы
  const { count: newOrdersRaw } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', id)
    .eq('status', 'new')

  const newOrders = newOrdersRaw ?? 0

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
            <Link
              href={`/menu/${restaurant.slug}`}
              target="_blank"
              className="text-[#ff9b26] font-bold"
            >
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
              ⚙️ Настройки
            </Link>
            <Link
              href={`/dashboard/${restaurant.id}/analytics`}
              className="inline-block px-5 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-lg"
            >
              📊 Аналитика
            </Link>
            <Link
              href={`/dashboard/${restaurant.id}/orders`}
              className="relative inline-block px-5 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-lg"
            >
              📦 Заказы
              {newOrders > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[24px] h-[24px] px-1 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                  {newOrders}
                </span>
              )}
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
            {categories.map((cat: any) => {
              const sortedDishes = [...(cat.dishes || [])].sort(
                (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
              )

              return (
                <div
                  key={cat.id}
                  className="bg-[#1a1d24] rounded-2xl border border-white/10 p-5"
                >
                  {/* Заголовок категории */}
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <h2 className="text-lg font-bold text-white">
                      {cat.icon} {cat.name}
                    </h2>
                    <div className="flex items-center gap-3">
                      <EditCategoryForm
                        category={cat}
                        restaurantId={restaurant.id}
                        slug={restaurant.slug}
                      />
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
                  </div>

                  {/* Список блюд */}
                  <div className="space-y-2 mb-3">
                    {sortedDishes.map((dish: any) => (
                      <div
                        key={dish.id}
                        className={`flex gap-3 p-3 bg-[#0a0e14] rounded-lg items-center ${
                          !dish.is_available ? 'opacity-50' : ''
                        }`}
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
                          <div className="text-sm font-bold text-white">
                            {dish.name}
                          </div>
                          {dish.description && (
                            <div className="text-xs text-[#8a92a3] line-clamp-1">
                              {dish.description}
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-black text-[#ff9b26] whitespace-nowrap">
                          {dish.price} ₽
                        </div>

                        {/* Кнопки управления блюдом */}
                        <div className="flex items-center gap-2 ml-2">
                          {/* РЕДАКТИРОВАНИЕ */}
                          <EditDishForm
                            dish={dish}
                            restaurantId={restaurant.id}
                            slug={restaurant.slug}
                          />

                          {/* Вверх */}
                          <form action={moveDish}>
                            <input type="hidden" name="dish_id" value={dish.id} />
                            <input type="hidden" name="direction" value="up" />
                            <input type="hidden" name="restaurant_id" value={restaurant.id} />
                            <input type="hidden" name="slug" value={restaurant.slug} />
                            <button
                              type="submit"
                              className="w-10 h-10 rounded-lg bg-[#1a1d24] hover:bg-[#232732] text-white text-lg font-bold transition-colors"
                              title="Вверх"
                            >
                              ↑
                            </button>
                          </form>

                          {/* Вниз */}
                          <form action={moveDish}>
                            <input type="hidden" name="dish_id" value={dish.id} />
                            <input type="hidden" name="direction" value="down" />
                            <input type="hidden" name="restaurant_id" value={restaurant.id} />
                            <input type="hidden" name="slug" value={restaurant.slug} />
                            <button
                              type="submit"
                              className="w-10 h-10 rounded-lg bg-[#1a1d24] hover:bg-[#232732] text-white text-lg font-bold transition-colors"
                              title="Вниз"
                            >
                              ↓
                            </button>
                          </form>

                          {/* Показать/скрыть */}
                          <form action={toggleDishAvailability}>
                            <input type="hidden" name="dish_id" value={dish.id} />
                            <input type="hidden" name="restaurant_id" value={restaurant.id} />
                            <input type="hidden" name="slug" value={restaurant.slug} />
                            <button
                              type="submit"
                              className={`w-10 h-10 rounded-lg text-lg transition-colors ${
                                dish.is_available
                                  ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
                                  : 'bg-gray-500/15 text-gray-500 hover:bg-gray-500/25'
                              }`}
                              title={dish.is_available ? 'Скрыть' : 'Показать'}
                            >
                              👁
                            </button>
                          </form>

                          {/* Удалить */}
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
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}