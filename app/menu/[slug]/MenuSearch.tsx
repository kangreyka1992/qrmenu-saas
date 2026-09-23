'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MenuSearch({
  categories,
  primaryColor,
  slug,
}: {
  categories: any[]
  primaryColor: string
  slug: string
}) {
  const [search, setSearch] = useState('')

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-4 pb-8 max-w-[600px] mx-auto">
      {/* ═══ ПОИСК ═══ */}
      <div className="mb-6 relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по меню..."
          className="w-full px-5 py-4 pl-14 bg-[#1a1a1c] border border-white/10 rounded-2xl outline-none focus:border-white/30 text-white placeholder-white/40 shadow-lg transition-all"
        />
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-60">
          🔍
        </span>
      </div>

      {/* ═══ ЗАГОЛОВОК ═══ */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Меню</h2>
        <span className="text-sm text-white/40">
          {filtered.length} категорий
        </span>
      </div>

      {/* ═══ ПЛИТКИ КАТЕГОРИЙ ═══ */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((cat: any) => {
          const firstDish = cat.dishes?.[0]
          const coverImage =
            firstDish?.image_url || getCategoryDefaultImage(cat.name)

          return (
            <Link
              key={cat.id}
              href={`/menu/${slug}/${cat.id}`}
              className="group relative rounded-3xl overflow-hidden bg-[#1a1a1c] border border-white/5 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 block"
            >
              {/* Фото */}
              <div className="aspect-[4/5] bg-[#0f0f10] overflow-hidden relative">
                <img
                  src={coverImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Иконка */}
                <div className="absolute top-3 right-3 w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shadow-lg">
                  {cat.icon || '🍽'}
                </div>

                {/* Название */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-xl font-black text-white leading-tight mb-1 drop-shadow-lg">
                    {cat.name}
                  </div>
                  <div className="text-xs text-white/70 font-medium">
                    {cat.dishes?.length || 0} блюд
                  </div>
                </div>

                {/* Стрелка при hover */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-lg">
                  →
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ═══ ПУСТО ═══ */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-20">🔍</div>
          <p className="text-white/60 text-lg">Ничего не найдено</p>
          <p className="text-sm text-white/40 mt-2">
            Попробуйте другое название
          </p>
        </div>
      )}
    </div>
  )
}

// ═══ Дефолтные фото для категорий ═══
function getCategoryDefaultImage(categoryName: string): string {
  const name = (categoryName || '').toLowerCase()

  if (name.includes('пицц'))
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80'
  if (name.includes('ролл'))
    return 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&q=80'
  if (name.includes('суши'))
    return 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80'
  if (name.includes('сет'))
    return 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=800&q=80'
  if (name.includes('напит') || name.includes('кофе') || name.includes('чай'))
    return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80'
  if (
    name.includes('десерт') ||
    name.includes('торт') ||
    name.includes('морожен')
  )
    return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80'
  if (name.includes('салат'))
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80'
  if (name.includes('суп'))
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80'
  if (name.includes('бургер') || name.includes('сэндвич'))
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80'
  if (name.includes('паста') || name.includes('макарон'))
    return 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80'
  if (name.includes('стейк') || name.includes('мясо'))
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80'

  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80'
}