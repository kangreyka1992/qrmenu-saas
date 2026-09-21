import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const ADMIN_ID = 'dce051f0-959b-4d49-b236-3e23a15447f2'

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== ADMIN_ID) {
    redirect('/')
  }

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const statusLabels: Record<string, string> = {
    new: '🆕 Новая',
    in_progress: '💼 В работе',
    paid: '💰 Оплачено',
    rejected: '❌ Отказ',
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-white mb-6">
          📋 Заявки клиентов
        </h1>

        {!leads?.length ? (
          <div className="text-center py-20 bg-[#1a1d24] rounded-2xl border border-white/10">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-[#8a92a3]">Пока нет заявок</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead: any) => (
              <div
                key={lead.id}
                className="bg-[#1a1d24] rounded-2xl border border-white/10 p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      🏪 {lead.restaurant_name}
                    </h3>
                    <div className="text-sm text-[#8a92a3] mt-1">
                      {new Date(lead.created_at).toLocaleString('ru-RU')}
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-bold bg-[#ff9b26]/20 text-[#ff9b26]">
                    {statusLabels[lead.status] || lead.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[#8a92a3]">👤 Имя:</span>{' '}
                    <span className="text-white">{lead.contact_name}</span>
                  </div>
                  <div>
                    <span className="text-[#8a92a3]">📞 Телефон:</span>{' '}
                    <a href={`tel:${lead.phone}`} className="text-[#ff9b26] font-bold">
                      {lead.phone}
                    </a>
                  </div>
                  {lead.telegram && (
                    <div>
                      <span className="text-[#8a92a3]">💬 Telegram:</span>{' '}
                      <a
                        href={`https://t.me/${lead.telegram.replace('@', '')}`}
                        target="_blank"
                        className="text-[#4a9eff] font-bold"
                      >
                        {lead.telegram}
                      </a>
                    </div>
                  )}
                  {lead.email && (
                    <div>
                      <span className="text-[#8a92a3]">📧 Email:</span>{' '}
                      <span className="text-white">{lead.email}</span>
                    </div>
                  )}
                </div>

                {lead.comment && (
                  <div className="mt-3 p-3 bg-[#0a0e14] rounded-lg text-sm text-[#c0c6d0]">
                    💭 {lead.comment}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}