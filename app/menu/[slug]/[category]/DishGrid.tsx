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
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {dishes.map((dish: any) => (
          <div
            key={dish.id}
            className="bg-[#1a1a1c] rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Фото */}
            <div className="aspect-square bg-[#0f0f10] overflow-hidden relative">
              {dish.image_url ? (
                <img
                  src={dish.image_url}
                  alt={dish.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
                  🍽
                </div>
              )}

              {dish.is_popular && (
                <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-black rounded-full shadow-lg">
                  🔥 ХИТ
                </div>
              )}
            </div>

            {/* Инфо */}
            <div className="p-4 flex-1 flex flex-col">
              <div className="text-base font-bold text-white leading-tight mb-1 line-clamp-2">
                {dish.name}
              </div>

              {dish.description && (
                <div className="text-xs text-white/50 line-clamp-2 mb-3 leading-snug">
                  {dish.description}
                </div>
              )}

              <div className="mt-auto">
                <div className="text-2xl font-black text-white mb-3">
                  {dish.price} ₽
                </div>
                <button
                  onClick={() => handleAdd(dish)}
                  className="w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg hover:shadow-xl"
                  style={{
                    background: addedId === dish.id ? '#22c55e' : primaryColor,
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