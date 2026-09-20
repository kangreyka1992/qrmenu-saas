import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-white">
      <div className="max-w-3xl mx-auto p-6">
        <Link href="/" className="text-[#8a92a3] text-sm inline-block mb-6">
          ← На главную
        </Link>

        <h1 className="text-3xl font-black mb-8">Политика конфиденциальности</h1>

        <div className="space-y-6 text-[#c0c6d0] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Какие данные мы собираем</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Email и пароль (для авторизации)</li>
              <li>Название заведения, адрес, телефон</li>
              <li>Информация о блюдах (название, описание, цена, фото)</li>
              <li>Платёжные данные (обрабатываются Robokassa, мы их не храним)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Как мы используем данные</h2>
            <p>
              Данные используются исключительно для предоставления услуг Сервиса:
              создания меню, генерации QR-кодов, приёма оплаты.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Передача третьим лицам</h2>
            <p>
              Мы не передаём данные третьим лицам, кроме случаев, необходимых 
              для работы Сервиса (платёжный сервис Robokassa, хостинг Vercel, БД Supabase).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Хранение данных</h2>
            <p>
              Данные хранятся в защищённой базе данных Supabase с соблюдением 
              требований безопасности. Доступ к данным имеет только владелец аккаунта.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Ваши права</h2>
            <p>
              Вы можете в любой момент удалить свой аккаунт и все связанные данные. 
              Для этого напишите на email из раздела Реквизиты.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Cookies</h2>
            <p>
              Мы используем cookies для авторизации и поддержания сессии.
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