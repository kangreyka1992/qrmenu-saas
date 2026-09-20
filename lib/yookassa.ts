const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID!
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY!

export interface CreatePaymentParams {
  amount: number
  description: string
  returnUrl: string
  metadata: Record<string, string>
}

export interface YookassaPayment {
  id: string
  status: string
  paid: boolean
  confirmation: {
    type: string
    confirmation_url: string
  }
  amount: {
    value: string
    currency: string
  }
  metadata: Record<string, string>
}

export async function createYookassaPayment(
  params: CreatePaymentParams
): Promise<YookassaPayment> {
  const idempotenceKey = `${Date.now()}-${Math.random().toString(36).substring(7)}`

  const auth = Buffer.from(
    `${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`
  ).toString('base64')

  const response = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotence-Key': idempotenceKey,
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: {
        value: params.amount.toFixed(2),
        currency: 'RUB',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: params.returnUrl,
      },
      description: params.description,
      metadata: params.metadata,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`YooKassa error: ${error}`)
  }

  return response.json()
}

export async function getYookassaPayment(
  paymentId: string
): Promise<YookassaPayment> {
  const auth = Buffer.from(
    `${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`
  ).toString('base64')

  const response = await fetch(
    `https://api.yookassa.ru/v3/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to get payment')
  }

  return response.json()
}