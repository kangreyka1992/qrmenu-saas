import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">Мои заведения</h1>
            <p className="text-sm text-[#8a92a3] mt-1">{user.email}</p>
          </div>
          <Link
            href="/dashboard/new"
            className="px-5 py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg"
          >
            + Создать меню
          </Link>
        </div>

        {!restaurants?.length ? (
          <div className="text-center py-20 bg-[#1a1d24] rounded-2xl border border-white/10">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-white mb-2">Пока нет меню</h2>
            <p className="text-[#8a92a3] mb-6">Создайте первое меню за 3 минуты</p>
            <Link
              href="/dashboard/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg"
            >
              Создать первое меню
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {restaurants.map((r: any) => (
              <div
                key={r.id}
                className="p-6 bg-[#1a1d24] rounded-2xl border border-white/10 flex justify-between items-center flex-wrap gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-white">{r.name}</h3>
                  <p className="text-sm text-[#8a92a3] mt-1">/menu/{r.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/menu/${r.slug}`}
                    target="_blank"
                    className="px-4 py-2 bg-white/5 text-white text-sm font-bold rounded-lg"
                  >
                    Открыть
                  </Link>
                  <Link
                    href={`/dashboard/${r.id}`}
                    className="px-4 py-2 bg-[#ff9b26] text-black text-sm font-bold rounded-lg"
                  >
                    Редактировать
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <form action="/auth/signout" method="post" className="mt-8">
          <button
            type="submit"
            className="text-[#8a92a3] text-sm hover:text-white transition-colors"
          >
            Выйти
          </button>
        </form>
      </div>
    </div>
  )
}