'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Неверный email или пароль')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e14] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-[#1a1d24] p-8 rounded-2xl border border-white/10"
      >
        <h1 className="text-2xl font-black text-white mb-6 text-center">Вход</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white mb-3 outline-none focus:border-[#ff9b26]"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white mb-4 outline-none focus:border-[#ff9b26]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg disabled:opacity-50"
        >
          {loading ? 'Входим...' : 'Войти'}
        </button>

        <p className="text-center text-[#8a92a3] text-sm mt-4">
          Нет аккаунта?{' '}
          <Link href="/signup" className="text-[#ff9b26] font-bold">
            Зарегистрироваться
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link href="/" className="text-[#8a92a3] text-xs">
            ← На главную
          </Link>
        </p>
      </form>
    </div>
  )
}