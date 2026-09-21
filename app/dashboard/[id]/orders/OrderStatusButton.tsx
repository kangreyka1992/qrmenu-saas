'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const STATUSES = [
  { value: 'new', label: '🆕 Новый' },
  { value: 'accepted', label: '✅ Принят' },
  { value: 'cooking', label: '👨‍🍳 Готовится' },
  { value: 'ready', label: '🎉 Готов' },
  { value: 'done', label: '✔️ Выполнен' },
  { value: 'cancelled', label: '❌ Отменён' },
]

export default function OrderStatusButton({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const [open, setOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function changeStatus(status: string) {
    setOpen(false)
    await supabase.from('orders').update({ status }).eq('id', orderId)
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white font-bold hover:bg-white/10"
      >
        Изменить статус ▾
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-[#1a1d24] border border-white/10 rounded-lg shadow-xl z-10 min-w-[180px]">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => changeStatus(s.value)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/5 ${
                currentStatus === s.value ? 'text-[#ff9b26] font-bold' : 'text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}