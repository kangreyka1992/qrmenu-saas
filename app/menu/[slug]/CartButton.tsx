'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from './CartContext'
import CartModal from './CartModal'

export default function CartButton({
  primaryColor,
  slug,
  restaurantName,
}: {
  primaryColor: string
  slug: string
  restaurantName: string
}) {
  const { totalItems, totalAmount } = useCart()
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const tableNumber = searchParams.get('table')

  function closeModal() {
    setOpen(false)
  }

  return (
    <>
      {/* Плавающая кнопка корзины */}
      {totalItems > 0 && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 left-4 right-4 z-40 py-4 px-6 rounded-xl shadow-2xl flex items-center justify-between text-white font-bold transition-transform active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          <span className="flex items-center gap-2">
            🛒 <span>Корзина ({totalItems})</span>
          </span>
          <span>{totalAmount} ₽</span>
        </button>
      )}

      {/* Модалка */}
      {open && (
        <CartModal
          onClose={closeModal}
          primaryColor={primaryColor}
          slug={slug}
          restaurantName={restaurantName}
          tableNumber={tableNumber}
        />
      )}
    </>
  )
}