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
    <div className="p-4 pb-32">
      {/* ═══ ПОИСК ═══ */}
      <div className="mb-8 relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по меню..."
          className="w-full px-5 py-4 pl-12 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-2xl outline-none focus:border-[#c0392b] text-[#3a2a1a] shadow-lg transition-all"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
          🔍
        </span>
      </div>

      {/* ═══ ЗАГОЛОВОК ═══ */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className="w-1 h-8 rounded-full"
          style={{ background: primaryColor }}
        />
        <h2
          className="text-3xl font-black text-[#3a2a1a]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Меню
        </h2>
      </div>

      {/* ═══ ПЛИТКИ КАТЕГОРИЙ ═══ */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((cat: any, i: number) => {
          const firstDish = cat.dishes?.[0]
          const coverImage =
            firstDish?.image_url || getCategoryDefaultImage(cat.name)

          return (
            <Link
              key={cat.id}
              href={`/menu/${slug}/${cat.id}`}
              className="group relative bg-white rounded-3xl overflow-hidden border-2 border-[#e0d5c5] hover:border-[#c0392b] transition-all shadow-md hover:shadow-2xl hover:-translate-y-1"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Фото */}
              <div className="aspect-square bg-[#f5ede0] overflow-hidden relative">
                <img
                  src={coverImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Градиент снизу */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Иконка категории */}
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xl shadow-lg">
                  {cat.icon || '🍽'}
                </div>

                {/* Название поверх фото */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <div
                    className="text-lg font-black leading-tight drop-shadow-lg"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {cat.name}
                  </div>
                  <div className="text-xs opacity-90 mt-0.5">
                    {cat.dishes?.length || 0} блюд
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ═══ ПУСТО ═══ */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-30">🔍</div>
          <p className="text-[#8a7a6a] text-lg">Ничего не найдено</p>
          <p className="text-sm text-[#8a7a6a] mt-2">
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

  if (name.includes('пицц')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'
  }
  if (name.includes('ролл') || name.includes('суши')) {
    return 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600'
  }
  if (name.includes('напит') || name.includes('кофе') || name.includes('чай')) {
    return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600'
  }
  if (
    name.includes('десерт') ||
    name.includes('торт') ||
    name.includes('морожен')
  ) {
    return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600'
  }
  if (name.includes('салат')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600'
  }
  if (name.includes('суп')) {
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600'
  }
  if (name.includes('бургер') || name.includes('сэндвич')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'
  }
  if (name.includes('паста') || name.includes('макарон')) {
    return 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600'
  }
  if (name.includes('стейк') || name.includes('мясо')) {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600'
  }
  if (name.includes('роллы')) {
    return 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600'
  }
  if (name.includes('сет')) {
    return 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=600'
  }
  if (name.includes('бургер')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'
  }
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'
}