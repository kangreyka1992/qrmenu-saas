import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ВАЖНО: await params в Next.js 15
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Order ID missing' }, { status: 400 })
    }

    // Загружаем заказ
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, total_amount, customer_name, customer_phone')
      .eq('id', id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN
    const password1 = process.env.ROBOKASSA_PASSWORD_1
    const isTest = process.env.ROBOKASSA_TEST_MODE === '1'

    if (!merchantLogin || !password1) {
      return NextResponse.json(
        { error: 'Robokassa credentials not configured' },
        { status: 500 }
      )
    }

    // InvId для Робокассы — уникальный числовой ID
    // Берём timestamp + последние цифры UUID заказа
    const invId = (
      Date.now().toString().slice(-8) +
      id.replace(/\D/g, '').slice(-2)
    ).slice(0, 10)

    // Сохраняем inv_id в заказ, чтобы вебхук мог найти заказ
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ robokassa_inv_id: invId })
      .eq('id', order.id)

    if (updateError) {
      console.error('Failed to save robokassa_inv_id:', updateError)
      return NextResponse.json(
        { error: 'Failed to prepare payment' },
        { status: 500 }
      )
    }

    // Подпись: MerchantLogin:OutSum:InvId:Пароль#1
    const signatureBase = `${merchantLogin}:${order.total_amount}:${invId}:${password1}`
    const signature = crypto
      .createHash('md5')
      .update(signatureBase)
      .digest('hex')

const baseUrl = 'https://auth.robokassa.ru/Merchant/Index.aspx'
// isTest передаётся только через параметр IsTest=1


    const urlParams = new URLSearchParams({
      MerchantLogin: merchantLogin,
      OutSum: order.total_amount.toString(),
      InvId: invId,
      Description: `Заказ №${invId}`,
      SignatureValue: signature,
      Culture: 'ru',
    })

    if (isTest) {
      urlParams.append('IsTest', '1')
    }

    const paymentUrl = `${baseUrl}?${urlParams.toString()}`

    return NextResponse.json({ paymentUrl, invId })
  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    )
  }
}