'use client'

import { useState } from 'react'
import { useCart } from '../CartContext'

export default function DishGrid({
  dishes,
  primaryColor,
}: {
  dishes: any[]
  primaryColor: string
}) {
  const { addItem } = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)

  function handleAdd(dish: any) {
    addItem(dish)
    setAddedId(dish.id)
    setTimeout(() => setAddedId(null), 900)
  }

  if (dishes.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 opacity-20">🍽</div>
        <p className="text-white/60 text-lg">В этой категории пока нет блюд</p>
      </div>
    )
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6">
      {/* Заголовок */}
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-2xl font-black text-white">Блюда</h2>
        <span className="text-sm text-white/40">{dishes.length} шт</span>
      </div>

      {/* Сетка */}
      <div className="grid grid-cols-2 gap-4">
        {dishes.map((dish: any) => (
          <div
            key={dish.id}
            className="bg-gradient-to-b from-[#1e1e22] to-[#16161a] rounded-3xl overflow-hidden border border-white/[0.06] flex flex-col shadow-2xl hover:border-white/20 transition-all duration-300 group"
          >
            {/* Фото */}
            <div className="aspect-[4/5] bg-[#0f0f10] overflow-hidden relative">
              {dish.image_url ? (
                <img
                  src={dish.image_url}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
                  🍽
                </div>
              )}

              {/* Градиент */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Бейдж ХИТ */}
              {dish.is_popular && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black rounded-full shadow-lg">
                  🔥 ХИТ
                </div>
              )}
            </div>

            {/* Инфо */}
            <div className="p-3.5 flex-1 flex flex-col">
              <div className="text-[15px] font-bold text-white leading-snug mb-1.5 line-clamp-2">
                {dish.name}
              </div>

              {dish.description && (
                <div className="text-xs text-white/45 line-clamp-2 mb-3 leading-snug">
                  {dish.description}
                </div>
              )}

              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-black text-white">
                    {dish.price}
                  </span>
                  <span className="text-lg font-bold text-white/60">₽</span>
                </div>

                <button
                  onClick={() => handleAdd(dish)}
                  className="w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg"
                  style={{
                    background:
                      addedId === dish.id
                        ? '#22c55e'
                        : primaryColor,
                    color: '#fff',
                  }}
                >
                  {addedId === dish.id ? '✓ Добавлено' : '+ В корзину'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}