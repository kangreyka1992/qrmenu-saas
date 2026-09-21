import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import SettingsForm from './SettingsForm'

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!restaurant) notFound()

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6">
      <div className="max-w-2xl mx-auto">
        <Link href={`/dashboard/${id}`} className="text-[#8a92a3] text-sm inline-block mb-4">
          ← Назад к меню
        </Link>

        <div className="bg-[#1a1d24] p-8 rounded-2xl border border-white/10">
          <h1 className="text-2xl font-black text-white mb-2">Настройки заведения</h1>
          <p className="text-sm text-[#8a92a3] mb-8">
            Измените информацию о заведении, логотип и цвет бренда
          </p>

          <SettingsForm restaurant={restaurant} />
        </div>
      </div>
    </div>
  )
}