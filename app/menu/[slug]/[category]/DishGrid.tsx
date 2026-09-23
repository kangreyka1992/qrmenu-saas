'use client'

import { useCart } from '../CartContext'

export default function DishGrid({
  dishes,
  primaryColor,
}: {
  dishes: any[]
  primaryColor: string
}) {
  const { addItem } = useCart()

  if (dishes.length === 0) {
    return (
      <div className="text-center py-20 text-[#8a7a6a]">
        <div className="text-5xl mb-3">🍽</div>
        <p>В этой категории пока нет блюд</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {dishes.map((dish: any) => (
          <div
            key={dish.id}
            className="bg-white rounded-2xl overflow-hidden border-2 border-[#e0d5c5] shadow-sm flex flex-col"
          >
            {/* Фото */}
            <div className="aspect-square bg-[#f5ede0] overflow-hidden">
              {dish.image_url ? (
                <img
                  src={dish.image_url}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🍽
                </div>
              )}
            </div>

            {/* Инфо */}
            <div className="p-3 flex-1 flex flex-col">
              <div
                className="text-sm font-bold text-[#3a2a1a] leading-tight mb-1"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {dish.name}
              </div>

              {dish.description && (
                <div className="text-xs text-[#8a7a6a] line-clamp-2 mb-2">
                  {dish.description}
                </div>
              )}

              <div className="mt-auto">
                <div className="text-base font-black text-[#3a2a1a] mb-2">
                  {dish.price} ₽
                </div>
                <button
                  onClick={() => addItem(dish)}
                  className="w-full py-2 rounded-xl text-white font-bold text-sm transition-transform active:scale-95"
                  style={{ background: primaryColor }}
                >
                  В корзину
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}