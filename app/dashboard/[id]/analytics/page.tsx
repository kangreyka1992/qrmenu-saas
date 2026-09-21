import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AnalyticsPage({
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

  // Всего просмотров
  const { count: totalViews } = await supabase
    .from('menu_views')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', id)

  // Просмотры за 7 дней
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: views7d } = await supabase
    .from('menu_views')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', id)
    .gte('viewed_at', sevenDaysAgo)

  // Просмотры за 24 часа
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count: views24h } = await supabase
    .from('menu_views')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', id)
    .gte('viewed_at', oneDayAgo)

  // Топ блюд
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data: dishViewsRaw } = await supabase
    .from('dish_views')
    .select('dish_id, dishes(name, price)')
    .eq('restaurant_id', id)
    .gte('viewed_at', thirtyDaysAgo)

  const dishCounts: Record<string, { name: string; price: number; count: number }> = {}
  ;(dishViewsRaw || []).forEach((row: any) => {
    const dishId = row.dish_id
    const name = row.dishes?.name || 'Unknown'
    const price = row.dishes?.price || 0
    if (!dishCounts[dishId]) {
      dishCounts[dishId] = { name, price, count: 0 }
    }
    dishCounts[dishId].count++
  })

  const topDishes = Object.values(dishCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // График за 7 дней
  const { data: dailyViews } = await supabase
    .from('menu_views')
    .select('viewed_at')
    .eq('restaurant_id', id)
    .gte('viewed_at', sevenDaysAgo)

  const dayCounts: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    dayCounts[key] = 0
  }

  ;(dailyViews || []).forEach((row: any) => {
    const key = new Date(row.viewed_at).toISOString().slice(0, 10)
    if (dayCounts[key] !== undefined) dayCounts[key]++
  })

  const chartData = Object.entries(dayCounts).map(([date, count]) => ({
    date,
    count,
  }))

  const maxCount = Math.max(...chartData.map((d) => d.count), 1)

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6">
      <div className="max-w-4xl mx-auto">
        <Link href={`/dashboard/${id}`} className="text-[#8a92a3] text-sm inline-block mb-4">
          ← Назад к меню
        </Link>

        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/10 mb-6">
          <h1 className="text-2xl font-black text-white mb-2">📊 Аналитика</h1>
          <p className="text-sm text-[#8a92a3]">
            Статистика просмотров меню {restaurant.name}
          </p>
        </div>

        {/* Метрики */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1a1d24] p-5 rounded-2xl border border-white/10 text-center">
            <div className="text-3xl font-black text-[#ff9b26]">{totalViews || 0}</div>
            <div className="text-xs text-[#8a92a3] uppercase tracking-wider mt-2">
              Всего просмотров
            </div>
          </div>
          <div className="bg-[#1a1d24] p-5 rounded-2xl border border-white/10 text-center">
            <div className="text-3xl font-black text-[#ff9b26]">{views7d || 0}</div>
            <div className="text-xs text-[#8a92a3] uppercase tracking-wider mt-2">
              За 7 дней
            </div>
          </div>
          <div className="bg-[#1a1d24] p-5 rounded-2xl border border-white/10 text-center">
            <div className="text-3xl font-black text-[#ff9b26]">{views24h || 0}</div>
            <div className="text-xs text-[#8a92a3] uppercase tracking-wider mt-2">
              За 24 часа
            </div>
          </div>
        </div>

        {/* График */}
        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/10 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">📈 Просмотры за 7 дней</h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {chartData.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs text-[#ff9b26] font-bold">
                  {d.count > 0 ? d.count : ''}
                </div>
                <div
                  className="w-full bg-gradient-to-t from-[#ff9b26] to-[#e07a00] rounded-t"
                  style={{
                    height: `${(d.count / maxCount) * 100}%`,
                    minHeight: d.count > 0 ? '4px' : '2px',
                    opacity: d.count > 0 ? 1 : 0.2,
                  }}
                />
                <div className="text-[10px] text-[#5a6373]">
                  {new Date(d.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Топ блюд */}
        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-bold text-white mb-4">
            🏆 Топ-5 блюд по просмотрам
          </h2>
          {topDishes.length === 0 ? (
            <div className="text-center py-8 text-[#8a92a3]">
              Пока нет данных
            </div>
          ) : (
            <div className="space-y-2">
              {topDishes.map((dish, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#0a0e14] rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1d24] flex items-center justify-center text-sm font-black text-[#ff9b26]">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{dish.name}</div>
                    <div className="text-xs text-[#8a92a3]">{dish.price} ₽</div>
                  </div>
                  <div className="text-sm font-black text-[#ff9b26]">
                    {dish.count} 👁
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}