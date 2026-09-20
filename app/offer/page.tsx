import Link from 'next/link'

export default function OfferPage() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-white">
      <div className="max-w-3xl mx-auto p-6">
        <Link href="/" className="text-[#8a92a3] text-sm inline-block mb-6">
          ← На главную
        </Link>

        <h1 className="text-3xl font-black mb-8">Публичная оферта</h1>

        <div className="space-y-6 text-[#c0c6d0] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Общие положения</h2>
            <p>
              Настоящий документ является публичной офертой (далее — «Оферта») 
              и определяет условия использования сервиса QRMenu (далее — «Сервис»), 
              доступного по адресу https://qrmenu-saas-six.vercel.app.
            </p>
            <p className="mt-3">
              Используя Сервис, вы соглашаетесь с условиями настоящей Оферты.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Предмет оферты</h2>
            <p>
              Исполнитель предоставляет Пользователю доступ к функционалу Сервиса 
              для создания и управления электронным меню с QR-кодом для заведений 
              общественного питания.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Стоимость услуг</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Тариф «Старт» — 990 ₽ в месяц</li>
              <li>Тариф «Бизнес» — 2 490 ₽ в месяц</li>
              <li>Тариф «Сеть» — 4 990 ₽ в месяц</li>
            </ul>
            <p className="mt-3">
              Первые 14 дней — бесплатно (пробный период).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Порядок оплаты</h2>
            <p>
              Оплата производится через платёжный сервис ЮKassa. Оплата взимается 
              ежемесячно. При отмене подписки доступ сохраняется до конца оплаченного периода.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Возврат средств</h2>
            <p>
              Возврат средств возможен в течение 14 дней с момента оплаты при 
              условии, что услуга не была использована. Для возврата напишите на 
              email, указанный в реквизитах.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Контакты</h2>
            <p>
              По всем вопросам: см. страницу{' '}
              <Link href="/requisites" className="text-[#ff9b26] font-bold">
                Реквизиты
              </Link>
            </p>
          </section>

          <p className="text-sm text-[#5a6373] mt-8">
            Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>
      </div>
    </div>
  )
}