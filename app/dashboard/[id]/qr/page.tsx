import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import QRCodeDisplay from './QRCodeDisplay'

export default async function QRPage({
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

  // Формируем URL меню
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const menuUrl = `${baseUrl}/menu/${restaurant.slug}`

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/dashboard/${restaurant.id}`}
          className="text-[#8a92a3] text-sm inline-block mb-4"
        >
          ← Назад к меню
        </Link>

        <div className="bg-[#1a1d24] p-8 rounded-2xl border border-white/10">
          <h1 className="text-2xl font-black text-white mb-2 text-center">
            QR-код для меню
          </h1>
          <p className="text-center text-[#8a92a3] text-sm mb-8">
            {restaurant.name}
          </p>

          <QRCodeDisplay url={menuUrl} />

          <div className="mt-8 p-4 bg-[#0a0e14] rounded-lg border border-white/5">
            <div className="text-sm text-[#8a92a3] mb-2">Ссылка на меню:</div>
            <div className="font-mono text-sm text-[#ff9b26] break-all">
              {menuUrl}
            </div>
          </div>

          <div className="mt-6 p-5 bg-[#0a0e14] rounded-lg border border-white/5">
            <h3 className="text-sm font-bold text-white mb-3">
              📄 Как использовать:
            </h3>
            <ol className="text-sm text-[#8a92a3] space-y-2">
              <li>1. Скачайте PNG-файл с QR-кодом</li>
              <li>2. Распечатайте на принтере (рекомендуем 10×10 см)</li>
              <li>3. Разместите на столах, стойке, входе</li>
              <li>4. Гости сканируют телефоном → открывается ваше меню</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}