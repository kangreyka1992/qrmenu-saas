import { NextRequest, NextResponse } from 'next/server';
import RoboGate from 'robokassa-gate';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, orderId, description, email } = body;

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'amount и orderId обязательны' },
        { status: 400 }
      );
    }

    const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN;
    const password1 = process.env.ROBOKASSA_PASSWORD_1;
    const password2 = process.env.ROBOKASSA_PASSWORD_2;
    const isTest = process.env.ROBOKASSA_TEST_MODE === '1';

    if (!merchantLogin || !password1 || !password2) {
      return NextResponse.json(
        { error: 'Не заданы переменные окружения Робокассы' },
        { status: 500 }
      );
    }

    const robokassa = new RoboGate({
      merchantLogin,
      hashingAlgorithm: 'md5',
      password1,
      password2,
      testMode: isTest,
      testPassword1: process.env.ROBOKASSA_TEST_PASSWORD_1,
      testPassword2: process.env.ROBOKASSA_TEST_PASSWORD_2,
    });

    const paymentUrl = robokassa.generatePaymentURL({
      invId: orderId,
      invSumm: amount,
      invDescr: description || `Заказ №${orderId}`,
      email: email || undefined,
    });

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error('Ошибка создания платежа:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}