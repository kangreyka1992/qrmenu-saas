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
      <div
        className="min-h-screen"
        style={{
          maxWidth: 600,
          margin: '0 auto',
          background: '#f5ede0',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
      >
        {/* ═══ ШАПКА КАТЕГОРИИ ═══ */}
        <div
          className="text-white p-5 sticky top-0 z-20 shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
          }}
        >
          <Link
            href={`/menu/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold opacity-90 hover:opacity-100 transition-opacity"
          >
            ← Назад
          </Link>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-4xl">{categoryData.icon || '🍽'}</span>
            <div>
              <h1
                className="text-2xl font-black leading-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {categoryData.name}
              </h1>
              <p className="text-xs opacity-80 mt-0.5">
                {sortedDishes.length} блюд
              </p>
            </div>
          </div>
        </div>

        {/* ═══ СЕТКА БЛЮД ═══ */}
        <DishGrid dishes={sortedDishes} primaryColor={primaryColor} />

        {/* ═══ КОРЗИНА ═══ */}
        <CartButton
          primaryColor={primaryColor}
          slug={restaurant.slug}
          restaurantName={restaurant.name}
        />

        {/* ═══ НИЖНИЙ ОТСТУП ═══ */}
        <div className="h-32" />
      </div>
    </CartProvider>
  )
}