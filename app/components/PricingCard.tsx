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

  return (
    <div
      className={`relative rounded-2xl p-8 border ${
        plan.popular
          ? 'border-orange-500 bg-[#141414] shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]'
          : 'border-gray-800 bg-[#111111]'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-black text-xs font-bold px-4 py-1 rounded-full">
          ПОПУЛЯРНЫЙ
        </div>
      )}

      <h2 className="text-2xl font-bold mb-2 text-white">{plan.name}</h2>
      <div className="text-4xl font-bold text-orange-500 mb-1">
        {plan.price.toLocaleString('ru-RU')} ₽
      </div>
      <div className="text-sm text-gray-500 mb-6">{plan.period}</div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((f: string) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleStart}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          plan.popular
            ? 'bg-orange-500 hover:bg-orange-600 text-black'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        }`}
      >
        Начать
      </button>
    </div>
  )
}