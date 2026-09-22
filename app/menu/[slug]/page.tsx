import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { isSubscriptionActive } from '@/lib/subscription'
import ShareButton from './ShareButton'
import MenuSearch from './MenuSearch'
import TrackView from './TrackView'
import LanguageSwitcher from './LanguageSwitcher'
import { CartProvider } from './CartContext'
import CartButton from './CartButton'

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

  const sortedCategories = (categories || []).map((cat: any) => ({
    ...cat,
    dishes: [...(cat.dishes || [])].sort(
      (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
    ),
  }))

  const primaryColor = restaurant.primary_color || '#d4a574'

  return (
    <CartProvider slug={restaurant.slug}>
      <div
        className="min-h-screen bg-[#f5f5f5]"
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        <TrackView restaurantId={restaurant.id} />
        <LanguageSwitcher />

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

        <MenuSearch categories={sortedCategories} primaryColor={primaryColor} />

        <Suspense fallback={null}>
          <CartButton
            primaryColor={primaryColor}
            slug={restaurant.slug}
            restaurantName={restaurant.name}
          />
        </Suspense>

        <div
          className="fixed bottom-0 left-0 right-0 z-30"
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
    </CartProvider>
  )
}