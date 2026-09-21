'use client'

import { useState } from 'react'

export default function LeadForm() {
  const [name, setName] = useState('')
  const [restaurant, setRestaurant] = useState('')
  const [phone, setPhone] = useState('')
  const [telegram, setTelegram] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_name: restaurant,
          contact_name: name,
          phone,
          telegram,
          comment,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка')

      setDone(true)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-[#1a1d24] rounded-2xl border border-green-500/30">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-black text-white mb-3">Заявка принята!</h3>
        <p className="text-[#8a92a3] mb-6">
          Мы свяжемся с вами в течение <b className="text-white">1 часа</b> — 
          в Telegram или по телефону.
        </p>
        <p className="text-sm text-[#5a6373]">
          Пока можете посмотреть наше демо-меню:{' '}
          <a href="/demo" className="text-[#ff9b26] font-bold">
            /demo
          </a>
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-[#1a1d24] rounded-2xl border border-white/10 space-y-3 text-left"
    >
      <div>
        <label className="block text-xs text-[#8a92a3] mb-1">
          Название кафе *
        </label>
        <input
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          placeholder="Кафе «У Фонтана»"
          required
          className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white outline-none focus:border-[#ff9b26]"
        />
      </div>

      <div>
        <label className="block text-xs text-[#8a92a3] mb-1">Ваше имя *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Иван"
          required
          className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white outline-none focus:border-[#ff9b26]"
        />
      </div>

      <div>
        <label className="block text-xs text-[#8a92a3] mb-1">Телефон *</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (999) 123-45-67"
          required
          type="tel"
          className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white outline-none focus:border-[#ff9b26]"
        />
      </div>

      <div>
        <label className="block text-xs text-[#8a92a3] mb-1">
          Telegram (для связи)
        </label>
        <input
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          placeholder="@username"
          className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white outline-none focus:border-[#ff9b26]"
        />
      </div>

      <div>
        <label className="block text-xs text-[#8a92a3] mb-1">Комментарий</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ссылка на меню, особенности..."
          rows={2}
          className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white outline-none focus:border-[#ff9b26] resize-none"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-xl shadow-lg shadow-[#ff9b26]/30 disabled:opacity-50"
      >
        {loading ? 'Отправка...' : '🚀 Оставить заявку'}
      </button>

      <p className="text-xs text-[#5a6373] text-center">
        Свяжемся в течение 1 часа. Первые 14 дней — бесплатно.
      </p>
    </form>
  )
}