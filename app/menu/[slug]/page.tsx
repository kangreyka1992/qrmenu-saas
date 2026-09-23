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
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f10] p-6">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">⏸</div>
          <h1 className="text-2xl font-black text-white mb-3">
            Меню временно недоступно
          </h1>
          <p className="text-white/60">
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

  const primaryColor = restaurant.primary_color || '#c0392b'

  return (
    <CartProvider slug={restaurant.slug}>
      <div className="min-h-screen bg-[#0f0f10]">
        <TrackView restaurantId={restaurant.id} />

        {/* ═══ ОСНОВНОЙ КОНТЕЙНЕР — 600px ═══ */}
        <div className="max-w-[600px] mx-auto">
          {/* ═══ ПРЕМИАЛЬНАЯ ШАПКА ═══ */}
          <div className="relative overflow-hidden">
            {/* Градиент */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, ${primaryColor} 0%, ${primaryColor}dd 60%, #1a1a1a 100%)`,
              }}
            />

            {/* Декоративные круги */}
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-black/20 blur-3xl" />

            <div className="relative px-5 pt-6 pb-14 text-white">
              {/* Язык */}
              <div className="flex justify-end mb-6">
                <LanguageSwitcher />
              </div>

              {/* Логотип и название */}
              <div className="text-center">
                {restaurant.logo_url ? (
                  <img
                    src={restaurant.logo_url}
                    alt={restaurant.name}
                    className="w-32 h-32 rounded-3xl mx-auto mb-6 object-cover shadow-2xl border-4 border-white/20"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-3xl mx-auto mb-6 bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl shadow-2xl border-4 border-white/20">
                    ☕
                  </div>
                )}

                <h1 className="text-4xl font-black tracking-tight mb-3 drop-shadow-lg">
                  {restaurant.name}
                </h1>

                {/* Бейджи */}
                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {restaurant.address && (
                    <span className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-xs border border-white/20">
                      📍 {restaurant.address}
                    </span>
                  )}
                  {restaurant.phone && (
                    <a
                      href={`tel:${restaurant.phone.replace(/\D/g, '')}`}
                      className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-xs border border-white/20 hover:bg-white/25 transition"
                    >
                      📞 {restaurant.phone}
                    </a>
                  )}
                  {restaurant.work_hours && (
                    <span className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-xs border border-white/20">
                      🕐 {restaurant.work_hours}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Волна снизу */}
            <div
              className="absolute bottom-0 left-0 right-0 h-8 bg-[#0f0f10]"
              style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
            />
          </div>

          {/* ═══ МЕНЮ ═══ */}
          <div className="relative -mt-2">
            <MenuSearch
              categories={sortedCategories}
              primaryColor={primaryColor}
              slug={restaurant.slug}
            />
          </div>

          {/* ═══ КОРЗИНА ═══ */}
          <Suspense fallback={null}>
            <CartButton
              primaryColor={primaryColor}
              slug={restaurant.slug}
              restaurantName={restaurant.name}
            />
          </Suspense>
        </div>

        {/* ═══ НИЖНИЕ КНОПКИ — фиксированные ═══ */}
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <div className="max-w-[600px] mx-auto p-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
            <div className="grid grid-cols-2 gap-3">
              {restaurant.phone ? (
                <a
                  href={`tel:${restaurant.phone.replace(/\D/g, '')}`}
                  className="py-3.5 bg-white text-black font-bold rounded-2xl text-center text-sm shadow-xl active:scale-95 transition-all"
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

        {/* Отступ снизу */}
        <div className="h-24" />
      </div>
    </CartProvider>
  )
}