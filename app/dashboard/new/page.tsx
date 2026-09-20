'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function NewRestaurantPage() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleNameChange = (value: string) => {
    setName(value)
    const generated = value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    setSlug(generated || '')
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('restaurants')
      .insert({
        name,
        slug,
        phone: phone || null,
        address: address || null,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        setError('Этот адрес уже занят. Попробуйте другой.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    router.push(`/dashboard/${data.id}`)
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-[#8a92a3] text-sm inline-block mb-4">
          ← Назад
        </Link>

        <form
          onSubmit={handleCreate}
          className="bg-[#1a1d24] p-8 rounded-2xl border border-white/10"
        >
          <h1 className="text-2xl font-black text-white mb-6">Новое заведение</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <label className="block text-sm text-[#8a92a3] mb-2 font-bold">
            Название заведения
          </label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder="Кафе «У Фонтана»"
            className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white mb-4 outline-none focus:border-[#ff9b26]"
          />

          <label className="block text-sm text-[#8a92a3] mb-2 font-bold">
            Адрес меню
          </label>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#8a92a3] text-sm whitespace-nowrap">/menu/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              pattern="[a-z0-9\-]+"
              className="flex-1 px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white outline-none focus:border-[#ff9b26]"
            />
          </div>
          <p className="text-xs text-[#5a6373] mb-4">
            Только английские буквы, цифры и дефис
          </p>

          <label className="block text-sm text-[#8a92a3] mb-2 font-bold">Адрес</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="ул. Курортная, 5"
            className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white mb-4 outline-none focus:border-[#ff9b26]"
          />

          <label className="block text-sm text-[#8a92a3] mb-2 font-bold">Телефон</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (999) 123-45-67"
            className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white mb-6 outline-none focus:border-[#ff9b26]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg disabled:opacity-50"
          >
            {loading ? 'Создаём...' : 'Создать меню'}
          </button>
        </form>
      </div>
    </div>
  )
}