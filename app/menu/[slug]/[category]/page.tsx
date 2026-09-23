import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CartProvider } from '../CartContext'
import CartButton from '../CartButton'
import DishGrid from './DishGrid'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; category: string }>
}) {
  const { slug, category } = await params
  const supabase = await createClient()

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!restaurant) notFound()

  const { data: categoryData } = await supabase
    .from('categories')
    .select('*, dishes(*)')
    .eq('id', category)
    .eq('restaurant_id', restaurant.id)
    .single()

  if (!categoryData) notFound()

  const sortedDishes = [...(categoryData.dishes || [])].sort(
    (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
  )

  const primaryColor = restaurant.primary_color || '#c0392b'

  return (
    <CartProvider slug={restaurant.slug}>
      <div className="min-h-screen bg-[#0f0f10]">
        <div className="max-w-[600px] mx-auto">
          {/* ═══ ШАПКА ═══ */}
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, ${primaryColor} 0%, ${primaryColor}dd 70%, #1a1a1a 100%)`,
              }}
            />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-black/20 blur-3xl" />

            <div className="relative px-5 pt-6 pb-8 text-white">
              <Link
                href={`/menu/${slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold opacity-90 hover:opacity-100 mb-5"
              >
                ← Назад
              </Link>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-xl">
                  {categoryData.icon || '🍽'}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-black leading-tight mb-1">
                    {categoryData.name}
                  </h1>
                  <p className="text-sm opacity-80">
                    {sortedDishes.length} блюд
                  </p>
                </div>
              </div>
            </div>

            {/* Волна */}
            <div
              className="absolute bottom-0 left-0 right-0 h-6 bg-[#0f0f10]"
              style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
            />
          </div>

          {/* Сетка блюд */}
          <DishGrid dishes={sortedDishes} primaryColor={primaryColor} />
        </div>

        {/* Корзина */}
        <CartButton
          primaryColor={primaryColor}
          slug={restaurant.slug}
          restaurantName={restaurant.name}
        />

        <div className="h-32" />
      </div>
    </CartProvider>
  )
}