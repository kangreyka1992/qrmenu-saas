'use client'

import { useState } from 'react'
import { useCart } from './CartContext'

export default function CartModal({
  onClose,
  primaryColor,
  slug,
  restaurantName,
  tableNumber,
}: {
  onClose: () => void
  primaryColor: string
  slug: string
  restaurantName: string
  tableNumber?: string | null
}) {
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart()
  const [step, setStep] = useState<'cart' | 'form' | 'done'>('cart')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'at_venue' | 'online'>(
    'at_venue'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submitOrder() {
    if (!name.trim() || !phone.trim()) {
      setError('Заполните имя и телефон')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          customer_comment: comment.trim() || null,
          table_number: tableNumber || null,
          payment_method: paymentMethod,
          items: items.map((i) => ({
            dish_id: i.id,
            dish_name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка сервера')
      }

      // Онлайн-оплата — редирект на Робокассу
      if (paymentMethod === 'online' && data.order_id) {
        const payRes = await fetch(`/api/orders/${data.order_id}/pay`, {
          method: 'POST',
        })
        const payData = await payRes.json()

        if (payData.paymentUrl) {
          clearCart()
          window.location.href = payData.paymentUrl
          return
        } else {
          throw new Error(payData.error || 'Не удалось создать оплату')
        }
      }

      // Оплата на месте — показываем "Готово"
      setStep('done')
      setLoading(false)

      setTimeout(() => {
        clearCart()
      }, 100)
    } catch (err: any) {
      console.error('Order error:', err)
      setError(err.message || 'Не удалось отправить заказ')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-black text-gray-900">
            {step === 'cart' && '🛒 Корзина'}
            {step === 'form' && '📝 Оформление'}
            {step === 'done' && '✅ Заказ принят'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* ═══ CART ═══ */}
        {step === 'cart' && (
          <div className="p-4">
            {items.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-3">🛒</div>
                <p>Корзина пуста</p>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-3 border-b"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.price} ₽
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-black text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-9 h-9 rounded-lg text-white font-bold text-lg"
                        style={{ background: primaryColor }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center py-4 text-lg font-black text-gray-900">
                  <span>Итого:</span>
                  <span style={{ color: primaryColor }}>{totalAmount} ₽</span>
                </div>

                <button
                  onClick={() => setStep('form')}
                  className="w-full py-4 rounded-xl text-white font-bold text-base"
                  style={{ background: primaryColor }}
                >
                  Оформить заказ →
                </button>
              </>
            )}
          </div>
        )}

        {/* ═══ FORM ═══ */}
        {step === 'form' && (
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Ваше имя *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Телефон *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Комментарий
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Без лука, порезать пополам..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-gray-900 resize-none"
              />
            </div>

            {/* Способ оплаты */}
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Способ оплаты
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('at_venue')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    paymentMethod === 'at_venue'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="font-bold text-gray-900">💵 На месте</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Оплатите официанту или на кассе
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    paymentMethod === 'online'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="font-bold text-gray-900">
                    💳 Онлайн (картой)
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Оплата через Робокассу
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between items-center py-2 text-lg font-black text-gray-900">
              <span>Итого:</span>
              <span style={{ color: primaryColor }}>{totalAmount} ₽</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep('cart')}
                disabled={loading}
                className="flex-1 py-4 rounded-xl bg-gray-100 text-gray-700 font-bold disabled:opacity-50"
              >
                ← Назад
              </button>
              <button
                onClick={submitOrder}
                disabled={loading}
                className="flex-1 py-4 rounded-xl text-white font-bold disabled:opacity-50"
                style={{ background: primaryColor }}
              >
                {loading
                  ? 'Отправка...'
                  : paymentMethod === 'online'
                  ? 'Оплатить →'
                  : 'Заказать ✓'}
              </button>
            </div>
          </div>
        )}

        {/* ═══ DONE ═══ */}
        {step === 'done' && (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              Заказ принят!
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {restaurantName} свяжется с вами в течение 5 минут для
              подтверждения.
            </p>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-xl text-white font-bold"
              style={{ background: primaryColor }}
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  )
}