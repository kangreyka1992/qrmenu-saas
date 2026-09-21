import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isSubscriptionActive } from '@/lib/subscription'
import ShareButton from './ShareButton'

export default async function MenuPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!restaurant) notFound()

  // Проверка подписки
  const subActive = await isSubscriptionActive(restaurant.user_id)

  if (!subActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⏸</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Меню временно недоступно
          </h1>
          <p className="text-gray-500">
            Владелец заведения не оплатил подписку. Меню вернётся после оплаты.
          </p>
        </div>
      </div>
    )
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*, dishes(*)')
    .eq('restaurant_id', restaurant.id)
    .order('sort_order')

  const primaryColor = restaurant.primary_color || '#d4a574'

  return (
    <div
      className="min-h-screen bg-[#f5f5f5]"
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      {/* ═══ ШАПКА ═══ */}
      <div
        className="text-center py-10 px-5 text-white"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
        }}
      >
        {restaurant.logo_url ? (
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            className="w-20 h-20 rounded-xl mx-auto mb-3 object-cover shadow-lg"
          />
        ) : (
          <div className="text-5xl mb-3">☕</div>
        )}
        <h1 className="text-2xl font-black">{restaurant.name}</h1>
        {restaurant.address && (
          <p className="text-sm opacity-90 mt-2">📍 {restaurant.address}</p>
        )}
        {restaurant.phone && (
          <p className="text-sm opacity-90 mt-1">📞 {restaurant.phone}</p>
        )}
        {restaurant.work_hours && (
          <p className="text-sm opacity-90 mt-1">🕐 {restaurant.work_hours}</p>
        )}
      </div>

      {/* ═══ МЕНЮ ═══ */}
      <div className="p-4 pb-24">
        {!categories?.length ? (
          <div className="text-center py-20 text-gray-400">
            Меню пока пустое
          </div>
        ) : (
          categories.map((cat: any) => {
            const dishes = (cat.dishes || []).filter((d: any) => d.is_available)
            if (dishes.length === 0) return null

            return (
              <div key={cat.id} className="mb-8">
                <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-gray-900">
                  <span
                    className="w-1 h-6 rounded"
                    style={{ background: primaryColor }}
                  />
                  {cat.icon} {cat.name}
                </h2>

                {dishes.map((dish: any) => (
                  <div
                    key={dish.id}
                    className="flex gap-3 p-3 bg-white rounded-xl mb-2 shadow-sm"
                  >
                    <div className="w-20 h-20 rounded-lg bg-[#f0f0f0] overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
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
                      <div className="font-bold text-sm mb-1 text-gray-900">
                        {dish.name}
                      </div>
                      {dish.description && (
                        <div className="text-xs text-gray-500 line-clamp-2">
                          {dish.description}
                        </div>
                      )}
                    </div>
                    <div
                      className="font-black self-center whitespace-nowrap"
                      style={{ color: primaryColor }}
                    >
                      {dish.price} ₽
                    </div>
                  </div>
                ))}
              </div>
            )
          })
        )}
      </div>

      {/* ═══ ПЛАВАЮЩИЕ КНОПКИ ═══ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        <div className="p-3 bg-gradient-to-t from-black/90 to-transparent">
          <div className="grid grid-cols-2 gap-2">
            {restaurant.phone ? (
              <a
                href={`tel:${restaurant.phone.replace(/\D/g, '')}`}
                className="py-3 bg-white text-gray-900 font-bold rounded-xl text-center text-sm shadow-lg"
              >
                📞 Позвонить
              </a>
            ) : (
              <div />
            )}

            <ShareButton
              restaurantName={restaurant.name}
              slug={restaurant.slug}
              primaryColor={primaryColor}
            />
          </div>
        </div>
      </div>

      {/* ═══ ПЛАШКА QRMenu ═══ */}
      <div
        className="bg-black text-white text-center py-3 text-xs"
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        Создано в{' '}
        <Link href="/" className="font-bold" style={{ color: primaryColor }}>
          QRMenu
        </Link>{' '}
        · 990 ₽/мес
      </div>
    </div>
  )
}