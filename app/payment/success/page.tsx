import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>
}) {
  const { order_id } = await searchParams

  let isPaid = false

  if (order_id) {
    // Ищем платёж в БД по order_id
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('status, payment_id')
      .eq('order_id', order_id)
      .single()

    // Если в БД уже помечен как succeeded — точно оплачен
    if (payment?.status === 'succeeded') {
      isPaid = true
    } else if (payment?.payment_id) {
      // Иначе проверяем в ЮKassa
      const shopId = process.env.YOKASSA_SHOP_ID
      const secretKey = process.env.YOKASSA_SECRET_KEY

      if (shopId && secretKey) {
        const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64')

        const res = await fetch(
          `https://api.yookassa.ru/v3/payments/${payment.payment_id}`,
          {
            headers: { Authorization: `Basic ${auth}` },
            cache: 'no-store',
          }
        )

        const data = await res.json()
        isPaid = data.status === 'succeeded'
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {isPaid ? (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-black text-white mb-3">
              Оплата прошла успешно!
            </h1>
            <p className="text-[#8a92a3] mb-6">
              Осталось заполнить данные — мы свяжемся с вами в течение часа.
            </p>
            <Link
              href="/dashboard/welcome"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg"
            >
              Заполнить данные →
            </Link>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-black text-white mb-3">
              Оплата не завершена
            </h1>
            <p className="text-[#8a92a3] mb-6">
              Мы не видим подтверждения оплаты. Если вы уже оплатили —
              подождите 1–2 минуты и обновите страницу. Если нет — попробуйте
              снова.
            </p>
            <div className="space-y-2">
              <Link
                href="/tariffs"
                className="block w-full px-6 py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg text-center"
              >
                Вернуться к тарифам
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}