'use client'

import { useState } from 'react'
import { useCart } from './CartContext'

export default function MenuSearch({
  categories,
  primaryColor,
}: {
  categories: any[]
  primaryColor: string
}) {
  const [search, setSearch] = useState('')
  const { addItem } = useCart()

  const filtered = categories.map((cat) => ({
    ...cat,
    dishes: (cat.dishes || []).filter((d: any) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    ),
  }))

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

      {/* ═══ КАТЕГОРИИ ═══ */}
      {filtered.map((cat: any) => {
        if (cat.dishes.length === 0) return null

        return (
          <div key={cat.id} className="mb-10">
            {/* Заголовок категории */}
            <div className="mb-4">
              <h2
                className="text-4xl font-black text-[#c0392b] mb-1 flex items-center gap-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </h2>
              <div className="h-1 bg-[#c0392b] w-20 rounded-full" />
            </div>

            {/* Блюда */}
            <div className="bg-white/80 rounded-2xl p-4 border-2 border-[#e0d5c5] shadow-sm">
              {cat.dishes.map((dish: any, i: number) => (
                <div
                  key={dish.id}
                  className={`flex items-center gap-4 py-4 ${
                    i !== cat.dishes.length - 1
                      ? 'border-b border-dashed border-[#d0c5b5]'
                      : ''
                  }`}
                >
                  {/* Фото */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#f5ede0] border-2 border-[#e0d5b5] shadow-sm">
                    {dish.image_url ? (
                      <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🍽
                      </div>
                    )}
                  </div>

                  {/* Название и описание */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-base font-bold text-[#c0392b] uppercase leading-tight"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {dish.name}
                    </div>
                    {dish.description && (
                      <div className="text-xs text-[#8a7a6a] mt-1 line-clamp-2 leading-snug">
                        {dish.description}
                      </div>
                    )}
                  </div>

                  {/* Цена — тёмный кружок */}
                  <button
                    onClick={() => addItem(dish)}
                    className="flex-shrink-0 transition-transform active:scale-95"
                    aria-label={`Добавить ${dish.name}`}
                  >
                    <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-lg hover:bg-[#c0392b] transition-colors">
                      <span className="text-white font-black text-sm">
                        {dish.price}₽
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* ═══ ПУСТО ═══ */}
      {filtered.every((c: any) => c.dishes.length === 0) && (
        <div className="text-center py-20 text-[#8a7a6a]">
          <div className="text-5xl mb-3">🔍</div>
          <p>Ничего не найдено</p>
        </div>
      )}
    </div>
  )
}