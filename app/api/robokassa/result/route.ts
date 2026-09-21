import { NextRequest, NextResponse } from 'next/server';
import RoboGate from 'robokassa-gate';
import { createClient } from '@supabase/supabase-js';

// Создаём Supabase-клиент с service_role ключом,
// чтобы обойти RLS и иметь доступ к любой таблице
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const robokassa = new RoboGate({
      merchantLogin: process.env.ROBOKASSA_MERCHANT_LOGIN!,
      hashingAlgorithm: 'md5',
      password1: process.env.ROBOKASSA_PASSWORD_1!,
      password2: process.env.ROBOKASSA_PASSWORD_2!,
      testMode: process.env.ROBOKASSA_TEST_MODE === '1',
      testPassword1: process.env.ROBOKASSA_TEST_PASSWORD_1,
      testPassword2: process.env.ROBOKASSA_TEST_PASSWORD_2,
      resultUrlRequestMethod: 'POST',
    });

    // Робокасса отправляет данные как application/x-www-form-urlencoded.
    // В Next.js App Router их нужно распарсить вручную через formData().
    const body = await req.formData();
    const params: Record<string, string> = {};
    body.forEach((value, key) => {
      params[key] = value.toString();
    });

    // Формируем объект, совместимый с validateResult из robokassa-gate
    const fakeReq = { query: params, body: params };
    const isValid = robokassa.validateResult(fakeReq as any);

    if (!isValid) {
      console.warn('Неверная подпись Robokassa', params);
      return new NextResponse('bad sign', { status: 400 });
    }

    const invId = params.InvId;
    const outSum = params.OutSum;

    if (!invId) {
      return new NextResponse('missing InvId', { status: 400 });
    }

    // Обновляем статус заказа в Supabase
    // ВАЖНО: подставьте правильные названия таблицы и колонок
    const { error } = await supabase
      .from('orders') // ← замените на название вашей таблицы заказов
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        paid_amount: outSum,
      })
      .eq('id', invId); // ← и на название колонки с ID заказа

    if (error) {
      console.error('Ошибка обновления заказа в Supabase:', error);
      return new NextResponse('DB error', { status: 500 });
    }

    // Робокасса ожидает ровно такой ответ — OK + InvId без пробелов
    return new NextResponse(`OK${invId}`);
  } catch (error) {
    console.error('Ошибка обработки вебхука Robokassa:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}