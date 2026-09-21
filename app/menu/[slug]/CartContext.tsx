'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  id: string
  name: string
  name_en?: string
  price: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (dish: any) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  totalAmount: number
  totalItems: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({
  children,
  slug,
}: {
  children: ReactNode
  slug: string
}) {
  const [items, setItems] = useState<CartItem[]>([])

  // Загружаем корзину при монтировании
  useEffect(() => {
    const saved = localStorage.getItem(`cart_${slug}`)
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {}
    }
  }, [slug])

  // Сохраняем при изменении
  useEffect(() => {
    localStorage.setItem(`cart_${slug}`, JSON.stringify(items))
  }, [items, slug])

  function addItem(dish: any) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === dish.id)
      if (existing) {
        return prev.map((i) =>
          i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          name_en: dish.name_en,
          price: dish.price,
          quantity: 1,
        },
      ]
    })
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateQuantity(id: string, qty: number) {
    if (qty <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    )
  }

  function clearCart() {
    setItems([])
  }

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}