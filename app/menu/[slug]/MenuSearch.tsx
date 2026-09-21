'use client'

import { useState, useMemo } from 'react'

export default function MenuSearch({
  categories,
  primaryColor,
}: {
  categories: any[]
  primaryColor: string
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return categories

    const q = query.toLowerCase().trim()

    return categories
      .map((cat) => ({
        ...cat,
        dishes: (cat.dishes || []).filter(
          (d: any) =>
            d.is_available &&
            (d.name.toLowerCase().includes(q) ||
              (d.description || '').toLowerCase().includes(q))
        ),
      }))
      .filter((cat) => cat.dishes.length > 0)
  }, [categories, query])

  const totalFound = filtered.reduce(
    (sum, cat) => sum + cat.dishes.length,
    0
  )

  return (
    <>
      {/* Поиск */}
      <div className="sticky top-0 z-10 bg-[#f5f5f5] pt-4 pb-2 px-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Поиск по меню..."
            className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-gray-400 text-sm text-gray-900 placeholder:text-gray-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          )}
        </div>
        {query && (
          <div className="text-xs text-gray-500 mt-2 px-1">
            {totalFound > 0
              ? `Найдено: ${totalFound} ${totalFound === 1 ? 'блюдо' : 'блюд'}`
              : 'Ничего не найдено'}
          </div>
        )}
      </div>

      {/* Меню */}
      <div className="p-4 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            {query ? 'Ничего не найдено' : 'Меню пока пустое'}
          </div>
        ) : (
          filtered.map((cat: any) => (
            <div key={cat.id} className="mb-8">
              <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-gray-900">
                <span
                  className="w-1 h-6 rounded"
                  style={{ background: primaryColor }}
                />
                {cat.icon} {cat.name}
              </h2>

              {cat.dishes.map((dish: any) => (
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
          ))
        )}
      </div>
    </>
  )
}