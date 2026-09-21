'use client'

import { useState, useMemo, useEffect } from 'react'
import { useCart } from './CartContext'

export default function MenuSearch({
  categories,
  primaryColor,
}: {
  categories: any[]
  primaryColor: string
}) {
  const [query, setQuery] = useState('')
  const [lang, setLang] = useState<'ru' | 'en'>('ru')
  const { items, addItem, updateQuantity } = useCart()

  useEffect(() => {
    const saved = (localStorage.getItem('menu_lang') as 'ru' | 'en') || 'ru'
    setLang(saved)

    function handleChange() {
      const newLang = (localStorage.getItem('menu_lang') as 'ru' | 'en') || 'ru'
      setLang(newLang)
    }

    window.addEventListener('languageChange', handleChange)
    return () => window.removeEventListener('languageChange', handleChange)
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return categories

    const q = query.toLowerCase().trim()

    return categories
      .map((cat) => ({
        ...cat,
        dishes: (cat.dishes || []).filter((d: any) => {
          const name = lang === 'en' && d.name_en ? d.name_en : d.name
          const desc =
            lang === 'en' && d.description_en
              ? d.description_en
              : d.description || ''
          return (
            d.is_available &&
            (name.toLowerCase().includes(q) || desc.toLowerCase().includes(q))
          )
        }),
      }))
      .filter((cat) => cat.dishes.length > 0)
  }, [categories, query, lang])

  const totalFound = filtered.reduce(
    (sum, cat) => sum + cat.dishes.length,
    0
  )

  const placeholder =
    lang === 'en' ? '🔍 Search menu...' : '🔍 Поиск по меню...'
  const notFoundText = lang === 'en' ? 'Nothing found' : 'Ничего не найдено'
  const emptyText = lang === 'en' ? 'Menu is empty' : 'Меню пока пустое'
  const foundText = (n: number) =>
    lang === 'en'
      ? `Found: ${n} ${n === 1 ? 'dish' : 'dishes'}`
      : `Найдено: ${n} ${n === 1 ? 'блюдо' : 'блюд'}`

  function getQuantity(dishId: string) {
    const item = items.find((i) => i.id === dishId)
    return item ? item.quantity : 0
  }

  return (
    <>
      {/* Поиск */}
      <div className="sticky top-0 z-10 bg-[#f5f5f5] pt-4 pb-2 px-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
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
            {totalFound > 0 ? foundText(totalFound) : notFoundText}
          </div>
        )}
      </div>

      {/* Меню */}
      <div className="p-4 pb-32">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            {query ? notFoundText : emptyText}
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

              {cat.dishes.map((dish: any) => {
                const displayName =
                  lang === 'en' && dish.name_en ? dish.name_en : dish.name
                const displayDesc =
                  lang === 'en' && dish.description_en
                    ? dish.description_en
                    : dish.description
                const quantity = getQuantity(dish.id)

                return (
                  <div
                    key={dish.id}
                    className="flex gap-3 p-3 bg-white rounded-xl mb-2 shadow-sm items-center"
                  >
                    <div className="w-20 h-20 rounded-lg bg-[#f0f0f0] overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
                      {dish.image_url ? (
                        <img
                          src={dish.image_url}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        '🍽'
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm mb-1 text-gray-900">
                        {displayName}
                      </div>
                      {displayDesc && (
                        <div className="text-xs text-gray-500 line-clamp-2">
                          {displayDesc}
                        </div>
                      )}
                      <div
                        className="font-black text-sm mt-2"
                        style={{ color: primaryColor }}
                      >
                        {dish.price} ₽
                      </div>
                    </div>

                    {/* Кнопка [+] или счётчик [−] N [+] */}
                    {quantity === 0 ? (
                      <button
                        onClick={() => addItem(dish)}
                        className="self-center w-11 h-11 rounded-xl text-white text-2xl font-bold transition-transform active:scale-90 shadow-md flex items-center justify-center"
                        style={{ background: primaryColor }}
                        title="Добавить в корзину"
                      >
                        +
                      </button>
                    ) : (
                      <div
                        className="self-center flex items-center rounded-xl shadow-md overflow-hidden"
                        style={{ background: primaryColor }}
                      >
                        <button
                          onClick={() => updateQuantity(dish.id, quantity - 1)}
                          className="w-10 h-11 text-white text-2xl font-bold transition-transform active:scale-90 flex items-center justify-center"
                          title="Убрать одну"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-white text-lg font-black">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(dish.id, quantity + 1)}
                          className="w-10 h-11 text-white text-2xl font-bold transition-transform active:scale-90 flex items-center justify-center"
                          title="Добавить ещё"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>
    </>
  )
}