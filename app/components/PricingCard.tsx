'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PricingCard({
  plan,
  index,
}: {
  plan: any
  index: number
}) {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleStart = () => {
    if (!user) {
      router.push(`/signup?plan=${plan.id}`)
      return
    }
    router.push(`/tariffs?plan=${plan.id}&autoPay=1`)
  }

  const isLifetime = plan.type === 'lifetime'

  return (
    <div
      className={`relative rounded-2xl p-8 border flex flex-col h-full transition-all hover:scale-[1.02] ${
        plan.popular
          ? 'border-orange-500 bg-[#141414] shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]'
          : isLifetime
          ? 'border-purple-500/40 bg-gradient-to-b from-[#1a1324] to-[#111111] shadow-[0_0_40px_-15px_rgba(168,85,247,0.5)]'
          : 'border-gray-800 bg-[#111111] hover:border-gray-700'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-black text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
          🔥 ПОПУЛЯРНЫЙ
        </div>
      )}
      {isLifetime && plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap shadow-lg">
          {plan.badge}
        </div>
      )}

      <h3 className="text-2xl font-black text-white mb-1">{plan.name}</h3>

      {plan.subtitle && (
        <div
          className={`text-sm font-bold mb-2 ${
            isLifetime ? 'text-purple-400' : 'text-orange-400'
          }`}
        >
          {plan.subtitle}
        </div>
      )}

      {plan.description && (
        <p className="text-xs text-gray-500 mb-4">{plan.description}</p>
      )}

      <div className="mb-6">
        <div
          className={`text-5xl font-black mb-1 ${
            isLifetime
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
              : 'text-orange-500'
          }`}
        >
          {plan.price.toLocaleString('ru-RU')} ₽
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">
          {plan.period}
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f: string) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
            <span
              className={`mt-0.5 text-xs ${
                isLifetime ? 'text-purple-400' : 'text-green-500'
              }`}
            >
              ✓
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleStart}
        className={`w-full py-4 rounded-xl font-bold transition-all ${
          plan.popular
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black shadow-lg shadow-orange-500/30'
            : isLifetime
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/30'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        }`}
      >
        {isLifetime ? '🎁 Купить навсегда' : 'Начать'}
      </button>

      {isLifetime && (
        <p className="text-center text-xs text-purple-300/60 mt-3">
          Никаких скрытых платежей
        </p>
      )}
      {plan.popular && (
        <p className="text-center text-xs text-orange-300/60 mt-3">
          Самый популярный выбор
        </p>
      )}
    </div>
  )
}