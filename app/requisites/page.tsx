import Link from 'next/link'

export default function RequisitesPage() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-white">
      <div className="max-w-3xl mx-auto p-6">
        <Link href="/" className="text-[#8a92a3] text-sm inline-block mb-6">
          ← На главную
        </Link>

        <h1 className="text-3xl font-black mb-8">Реквизиты</h1>

        <div className="space-y-6 text-[#c0c6d0] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">Исполнитель</h2>
            <div className="space-y-2">
              <p>
                <span className="text-[#8a92a3]">ФИО:</span>{' '}
                <span className="text-white font-bold">Заргаров Андрей Серргеевич</span>
              </p>
              <p>
                <span className="text-[#8a92a3]">Статус:</span>{' '}
                <span className="text-white font-bold">Самозанятый (НПД)</span>
              </p>
              <p>
                <span className="text-[#8a92a3]">ИНН:</span>{' '}
                <span className="text-white font-bold">231123156491</span>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Контакты</h2>
            <div className="space-y-2">
              <p>
                <span className="text-[#8a92a3]">Email:</span>{' '}
                <a href="mailto:kandreyka1992@gmail.com" className="text-[#ff9b26] font-bold">
                  kandreyka1992@gmail.com
                </a>
              </p>
              <p>
                <span className="text-[#8a92a3]">Telegram:</span>{' '}
                <a href="https://t.me/Welcomedse" className="text-[#ff9b26] font-bold">
                  @Welcomedse
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Оплата</h2>
            <p>
              Оплата услуг производится через платёжный сервис ЮKassa 
              (ЮMoney). Все платежи защищены и соответствуют требованиям 
              безопасности PCI DSS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Документы</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/offer" className="text-[#ff9b26] font-bold hover:underline">
                  Публичная оферта →
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#ff9b26] font-bold hover:underline">
                  Политика конфиденциальности →
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}