'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function WelcomeContent() {
  const router = useRouter()
  const supabase = createClient()

  const [restaurantName, setRestaurantName] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [telegram, setTelegram] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
        return
      }
      if (data.user?.email) {
        setName(data.user.email.split('@')[0])
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!restaurantName.trim() || !name.trim() || !phone.trim()) {
      setError('Заполните обязательные поля')
      return
    }

    setLoading(true)
    setError('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Не авторизован')
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_name: restaurantName,
          name,
          phone,
          telegram,
          comment,
          email: user.email,
          user_id: user.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка отправки')
      }

      router.push('/dashboard')
    } catch (err: any) {
      console.error('Lead error:', err)
      setError(err.message || 'Не удалось отправить')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-black text-white mb-3">
            Оплата прошла!
          </h1>
          <p className="text-[#8a92a3]">
            Заполните данные — мы свяжемся с вами в течение часа и настроим меню
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1d24] p-6 rounded-2xl border border-white/10 space-y-4"
        >
          <div>
            <label className="block text-sm text-[#8a92a3] mb-2">
              Название кафе *
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Кафе «У Фонтана»"
              required
              className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-xl outline-none focus:border-[#ff9b26] text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-[#8a92a3] mb-2">
              Ваше имя *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван"
              required
              className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-xl outline-none focus:border-[#ff9b26] text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-[#8a92a3] mb-2">
              Телефон *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              required
              className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-xl outline-none focus:border-[#ff9b26] text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-[#8a92a3] mb-2">
              Telegram (для связи)
            </label>
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@username"
              className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-xl outline-none focus:border-[#ff9b26] text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-[#8a92a3] mb-2">
              Комментарий
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ссылка на меню, особенности..."
              rows={3}
              className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-xl outline-none focus:border-[#ff9b26] text-white resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-xl disabled:opacity-50 hover:scale-[1.02] transition-transform"
          >
            {loading ? 'Отправляем...' : '✈️ Отправить заявку'}
          </button>

          <p className="text-center text-xs text-[#5a6373]">
            Свяжемся в течение 1 часа
          </p>
        </form>
      </div>
    </div>
  )
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0e14]" />}>
      <WelcomeContent />
    </Suspense>
  )
}