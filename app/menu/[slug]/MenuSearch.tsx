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
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Поиск по меню..."
          className="w-full px-5 py-3 bg-white border-2 border-[#e0d5c5] rounded-full outline-none focus:border-[#c0392b] text-[#3a2a1a] shadow-sm"
        />
      </div>

      {/* ═══ ЗАГОЛОВОК ═══ */}
      <h2
        className="text-3xl font-black text-[#3a2a1a] mb-6"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Популярные категории
      </h2>

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
              className="group relative bg-white rounded-2xl overflow-hidden border-2 border-[#e0d5c5] hover:border-[#c0392b] transition-all shadow-sm hover:shadow-lg"
            >
              <div className="aspect-square bg-[#f5ede0] overflow-hidden">
                <img
                  src={coverImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <div
                  className="text-sm font-black text-[#3a2a1a] leading-tight"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {cat.icon} {cat.name}
                </div>
                <div className="text-xs text-[#8a7a6a] mt-1">
                  {cat.dishes?.length || 0} блюд
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ═══ ПУСТО ═══ */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-[#8a7a6a]">
          <div className="text-5xl mb-3">🔍</div>
          <p>Ничего не найдено</p>
        </div>
      )}
    </div>
  )
}

// ═══ Дефолтные фото для категорий ═══
function getCategoryDefaultImage(categoryName: string): string {
  const name = (categoryName || '').toLowerCase()

  if (name.includes('пицц')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
  }
  if (name.includes('ролл') || name.includes('суши')) {
    return 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'
  }
  if (name.includes('напит') || name.includes('кофе') || name.includes('чай')) {
    return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'
  }
  if (
    name.includes('десерт') ||
    name.includes('торт') ||
    name.includes('морожен')
  ) {
    return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'
  }
  if (name.includes('салат')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
  }
  if (name.includes('суп')) {
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'
  }
  if (name.includes('бургер') || name.includes('сэндвич')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  }
  if (name.includes('паста') || name.includes('макарон')) {
    return 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'
  }
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'
}