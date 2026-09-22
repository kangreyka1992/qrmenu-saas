import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import OrderStatusButton from './OrderStatusButton'

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!restaurant) notFound()

  // Заказы за последние 7 дней
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('restaurant_id', id)
    .gte('created_at', sevenDaysAgo)
    .order('created_at', { ascending: false })

  const statusLabels: Record<string, string> = {
    new: '🆕 Новый',
    accepted: '✅ Принят',
    cooking: '👨‍🍳 Готовится',
    ready: '🎉 Готов',
    done: '✔️ Выполнен',
    cancelled: '❌ Отменён',
  }

  const statusColors: Record<string, string> = {
    new: 'bg-yellow-500/20 text-yellow-400',
    accepted: 'bg-blue-500/20 text-blue-400',
    cooking: 'bg-purple-500/20 text-purple-400',
    ready: 'bg-green-500/20 text-green-400',
    done: 'bg-gray-500/20 text-gray-400',
    cancelled: 'bg-red-500/20 text-red-400',
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/dashboard/${id}`}
          className="text-[#8a92a3] text-sm inline-block mb-4"
        >
          ← Назад к меню
        </Link>

        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/10 mb-6">
          <h1 className="text-2xl font-black text-white mb-2">📦 Заказы</h1>
          <p className="text-sm text-[#8a92a3]">
            Заказы за последние 7 дней · Всего: {orders?.length || 0}
          </p>
        </div>

        {!orders?.length ? (
          <div className="text-center py-20 bg-[#1a1d24] rounded-2xl border border-white/10">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-[#8a92a3]">Пока нет заказов</p>
            <p className="text-sm text-[#5a6373] mt-2">
              Заказы появятся здесь, когда гости оформят заказ через QR-меню
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="bg-[#1a1d24] rounded-2xl border border-white/10 p-5"
              >
                {/* Верхняя часть: номер стола, время, статус */}
                <div className="flex justify-between items-start mb-3 flex-wrap gap-3">
                  <div className="flex-1 min-w-0">
                    {/* КРУПНЫЙ НОМЕР СТОЛА */}
                    {order.table_number ? (
                      <div className="inline-block px-5 py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-black text-2xl rounded-xl mb-3 shadow-lg">
                        🪑 Стол №{order.table_number}
                      </div>
                    ) : (
                      <div className="inline-block px-4 py-2 bg-gray-600/40 text-gray-300 font-bold text-sm rounded-lg mb-3">
                        🚶 Без стола
                      </div>
                    )}

                    <div className="text-sm text-[#8a92a3]">
                      {new Date(order.created_at).toLocaleString('ru-RU')}
                    </div>

                    <div className="text-lg font-bold text-white mt-2">
                      👤 {order.customer_name}
                    </div>

                    <div className="text-sm text-[#ff9b26] font-bold">
                      📞 {order.customer_phone}
                    </div>

                    {order.customer_comment && (
                      <div className="text-sm text-[#c0c6d0] mt-2 p-2 bg-yellow-500/5 border-l-2 border-yellow-500/50 rounded italic">
                        💬 {order.customer_comment}
                      </div>
                    )}
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      statusColors[order.status] ||
                      'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </div>
                </div>

                {/* Список блюд */}
                <div className="border-t border-white/10 pt-3 mt-3">
                  {order.order_items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm py-1"
                    >
                      <span className="text-[#c0c6d0]">
                        {item.quantity}× {item.dish_name}
                      </span>
                      <span className="text-[#ff9b26] font-bold">
                        {(Number(item.price) || 0) * item.quantity} ₽
                      </span>
                    </div>
                  ))}
                </div>

                {/* Итого + кнопка смены статуса */}
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-white/10 flex-wrap gap-2">
                  <div className="text-lg font-black text-white">
                    Итого:{' '}
                    <span className="text-[#ff9b26]">
                      {order.total_amount} ₽
                    </span>
                  </div>
                  <OrderStatusButton
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}