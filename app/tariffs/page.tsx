'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLANS } from '@/lib/plans'

function TariffsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [loading, setLoading] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user?.email) setEmail(user.email)
      setCheckingAuth(false)

      const planId = searchParams.get('plan')
      const autoPay = searchParams.get('autoPay')

      if (user && planId && autoPay === '1') {
        const plan = PLANS.find((p) => p.id === planId)
        if (plan) {
          router.replace('/tariffs')
          handlePayment(plan, user.email)
        }
      }
    }
    check()
  }, [searchParams])

  const handlePayment = async (plan: any, userEmail?: string) => {
    const finalEmail = userEmail || email

    if (!finalEmail || !finalEmail.includes('@')) {
      alert('Введите корректный email')
      return
    }

    setLoading(plan.id)
    const orderId = Date.now().toString()

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plan.price,
          orderId,
          description: `Тариф «${plan.name}»`,
          email: finalEmail,
          plan_id: plan.id,
          plan_name: plan.name,
          plan_type: plan.type,
        }),
      })

      const data = await res.json()
      setLoading(null)

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        alert('Ошибка: ' + (data.error || 'неизвестная'))
      }
    } catch (e) {
      setLoading(null)
      alert('Ошибка сети: ' + e)
    }
  }

  const handleStart = (plan: any) => {
    if (!user) {
      router.push(`/signup?plan=${plan.id}`)
      return
    }
    handlePayment(plan)
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    )
  }

  const monthlyPlans = PLANS.filter((p) => p.type === 'subscription')
  const lifetimePlans = PLANS.filter((p) => p.type === 'lifetime')

  return (
    <section
      id="tariffs"
      className="min-h-screen bg-[#0a0a0a] text-white px-4 py-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* ═══ ЗАГОЛОВОК ═══ */}
        <h1 className="text-5xl font-bold text-center mb-4">Тарифы</h1>
        <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto">
          Выберите подписку или оплатите один раз — и пользуйтесь навсегда.
          Все тарифы включают 14 дней бесплатно.
        </p>

        {/* ═══ ПОЧЕМУ ВЫГОДНО НАВСЕГДА ═══ */}
        <div className="max-w-3xl mx-auto mb-16 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
          <h3 className="text-xl font-black text-white mb-4 text-center">
            💡 Почему выгодно купить «Навсегда»?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-2xl">💰</span>
              <div>
                <b className="text-white">Экономия до 90%</b>
                <p className="text-xs text-gray-400 mt-1">
                  За 5 лет подписка обойдётся в 149 400 ₽, а «Навсегда» — от 10 000 ₽
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-2xl">🔒</span>
              <div>
                <b className="text-white">Защита от роста цен</b>
                <p className="text-xs text-gray-400 mt-1">
                  Платите один раз — цена не изменится никогда
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-2xl">♾️</span>
              <div>
                <b className="text-white">Все обновления бесплатно</b>
                <p className="text-xs text-gray-400 mt-1">
                  Новые функции получаете автоматически, без доплат
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ EMAIL ═══ */}
        <div className="max-w-md mx-auto mb-16">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email для чека"
            className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 focus:border-orange-500 outline-none text-white"
          />
        </div>

        {/* ═══ ПОДПИСКА ═══ */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2">
              📅 <span className="text-orange-500">Подписка</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Гибкий вариант — платите ежемесячно, отмените в любой момент.
              Идеально для тех, кто хочет попробовать без больших вложений.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {monthlyPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                loading={loading}
                onStart={handleStart}
              />
            ))}
          </div>
        </div>

        {/* ═══ НАВСЕГДА ═══ */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2">
              ♾️ <span className="text-purple-400">Навсегда</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Один раз заплатили — пользуетесь пожизненно. Идеально для тех,
              кто уверен в долгосрочной работе. Экономия до 90%!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lifetimePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                loading={loading}
                onStart={handleStart}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PlanCard({
  plan,
  loading,
  onStart,
}: {
  plan: any
  loading: string | null
  onStart: (plan: any) => void
}) {
  const isLifetime = plan.type === 'lifetime'

  return (
    <div
      className={`relative rounded-2xl p-8 border flex flex-col ${
        plan.popular
          ? 'border-orange-500 bg-[#141414] shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]'
          : isLifetime
          ? 'border-purple-500/40 bg-gradient-to-b from-[#1a1324] to-[#111111] shadow-[0_0_40px_-15px_rgba(168,85,247,0.5)]'
          : 'border-gray-800 bg-[#111111]'
      }`}
    >
      {/* Бейджи */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-black text-xs font-bold px-4 py-1 rounded-full">
          ПОПУЛЯРНЫЙ
        </div>
      )}
      {isLifetime && plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
          {plan.badge}
        </div>
      )}

      {/* Название */}
      <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>

      {/* Подзаголовок — кому подходит */}
      {plan.subtitle && (
        <div
          className={`text-sm font-bold mb-3 ${
            isLifetime ? 'text-purple-400' : 'text-orange-400'
          }`}
        >
          {plan.subtitle}
        </div>
      )}

      {/* Описание */}
      {plan.description && (
        <p className="text-sm text-gray-400 mb-4 leading-relaxed">
          {plan.description}
        </p>
      )}

      {/* Цена */}
      <div
        className={`text-4xl font-bold mb-1 ${
          isLifetime ? 'text-purple-400' : 'text-orange-500'
        }`}
      >
        {plan.price.toLocaleString('ru-RU')} ₽
      </div>
      <div className="text-sm text-gray-500 mb-4">{plan.period}</div>

      {/* Список фич */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f: string) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Кнопка */}
      <button
        onClick={() => onStart(plan)}
        disabled={loading === plan.id}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          plan.popular
            ? 'bg-orange-500 hover:bg-orange-600 text-black'
            : isLifetime
            ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        } disabled:opacity-50`}
      >
        {loading === plan.id
          ? 'Создаём платёж...'
          : isLifetime
          ? '🎁 Оплатить один раз'
          : 'Начать'}
      </button>

      {/* Подпись для lifetime */}
      {isLifetime && (
        <p className="text-center text-xs text-purple-300/70 mt-3">
          Никаких скрытых платежей. Доступ навсегда.
        </p>
      )}
    </div>
  )
}

export default function TariffsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <TariffsContent />
    </Suspense>
  )
}