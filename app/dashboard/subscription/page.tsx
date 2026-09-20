import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSubscription, getTrialDaysLeft } from '@/lib/subscription'
import { PLANS } from '@/lib/plans'
import SubscribeButton from './SubscribeButton'

export default async function SubscriptionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const subscription = await getSubscription(user.id)
  const trialDaysLeft = await getTrialDaysLeft(user.id)

  const isTrial = subscription?.status === 'trial'
  const isActive = subscription?.status === 'active'

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="text-[#8a92a3] text-sm inline-block mb-4">
          ← Назад
        </Link>

        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/10 mb-8">
          <h1 className="text-2xl font-black text-white mb-4">Подписка</h1>

          {isTrial && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="text-yellow-400 font-bold">
                🎁 Бесплатный триал: {trialDaysLeft} {trialDaysLeft === 1 ? 'день' : 'дней'}
              </div>
              <div className="text-sm text-[#8a92a3] mt-2">
                После окончания триала нужно оформить подписку
              </div>
            </div>
          )}

          {isActive && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-green-400 font-bold">
                ✅ Подписка активна — тариф «{PLANS.find(p => p.id === subscription.plan)?.name}»
              </div>
              {subscription.current_period_ends_at && (
                <div className="text-sm text-[#8a92a3] mt-2">
                  Действует до: {new Date(subscription.current_period_ends_at).toLocaleDateString('ru-RU')}
                </div>
              )}
            </div>
          )}

          {!isTrial && !isActive && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="text-red-400 font-bold">
                ⚠️ Подписка не активна
              </div>
              <div className="text-sm text-[#8a92a3] mt-2">
                Оформите подписку, чтобы меню снова стало доступно
              </div>
            </div>
          )}
        </div>

        <h2 className="text-xl font-black text-white mb-6">Тарифы</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-2xl border ${
                plan.popular
                  ? 'border-[#ff9b26] bg-[#1a1d24] shadow-lg shadow-[#ff9b26]/20'
                  : 'border-white/10 bg-[#1a1d24]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#ff9b26] text-black text-xs font-black rounded-full">
                  ПОПУЛЯРНЫЙ
                </div>
              )}

              <div className="text-lg font-bold text-white mb-2">{plan.name}</div>
              <div className="text-3xl font-black text-[#ff9b26] mb-1">
                {plan.price} ₽
              </div>
              <div className="text-sm text-[#8a92a3] mb-4">в месяц</div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="text-sm text-[#c0c6d0] flex gap-2">
                    <span className="text-green-400">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <SubscribeButton
                planId={plan.id}
                planName={plan.name}
                popular={plan.popular}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}