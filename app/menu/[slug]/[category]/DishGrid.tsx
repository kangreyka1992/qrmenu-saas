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
    setTimeout(() => setAddedId(null), 800)
  }

  if (dishes.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 opacity-30">🍽</div>
        <p className="text-[#8a7a6a] text-lg">В этой категории пока нет блюд</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {dishes.map((dish: any) => (
          <div
            key={dish.id}
            className="bg-white rounded-3xl overflow-hidden border-2 border-[#e0d5c5] shadow-md hover:shadow-xl transition-all flex flex-col hover:-translate-y-1"
          >
            {/* Фото */}
            <div className="aspect-square bg-[#f5ede0] overflow-hidden relative">
              {dish.image_url ? (
                <img
                  src={dish.image_url}
                  alt={dish.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
                  🍽
                </div>
              )}

              {/* Бейдж «Хит» */}
              {dish.is_popular && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-black rounded-full">
                  🔥 ХИТ
                </div>
              )}
            </div>

            {/* Инфо */}
            <div className="p-3 flex-1 flex flex-col">
              <div
                className="text-sm font-bold text-[#3a2a1a] leading-tight mb-1 line-clamp-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {dish.name}
              </div>

              {dish.description && (
                <div className="text-xs text-[#8a7a6a] line-clamp-2 mb-2 leading-snug">
                  {dish.description}
                </div>
              )}

              <div className="mt-auto">
                <div
                  className="text-xl font-black mb-2"
                  style={{ color: primaryColor }}
                >
                  {dish.price} ₽
                </div>
                <button
                  onClick={() => handleAdd(dish)}
                  className="w-full py-3 rounded-2xl text-white font-bold text-sm transition-all active:scale-95 shadow-md hover:shadow-lg"
                  style={{
                    background:
                      addedId === dish.id ? '#22c55e' : primaryColor,
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