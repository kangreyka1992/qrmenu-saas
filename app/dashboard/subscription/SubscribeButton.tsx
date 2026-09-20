'use client'

import { useState } from 'react'

export default function SubscribeButton({
  planId,
  planName,
  popular,
}: {
  planId: string
  planName: string
  popular?: boolean
}) {
  const [loading, setLoading] = useState(false)

  async function handleSubscribe() {
    setLoading(true)

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания платежа')
      }

      // Редирект на ЮKassa
      window.location.href = data.confirmationUrl
    } catch (error: any) {
      alert('Ошибка: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`w-full py-3 font-bold rounded-lg transition-colors disabled:opacity-50 ${
        popular
          ? 'bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black'
          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
      }`}
    >
      {loading ? 'Загрузка...' : `Оформить «${planName}»`}
    </button>
  )
}