import Link from 'next/link'
import { PLANS } from '@/lib/plans'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-white">
      {/* Hero */}
      <section className="px-5 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 bg-[#ff9b26]/15 text-[#ff9b26] rounded-full text-xs font-bold tracking-wider mb-5">
            QR-МЕНЮ ДЛЯ КАФЕ
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
            Меню вашего кафе{' '}
            <span className="text-[#ff9b26]">в телефоне гостя</span>{' '}
            за 3 минуты
          </h1>

          <p className="text-[#8a92a3] text-base max-w-xl mx-auto mb-8">
            Без интеграций с кассой. Без дизайнера. Без перепечатки. Обновляйте цены в 2 клика — гости видят изменения моментально.
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-xl shadow-lg shadow-[#ff9b26]/30"
            >
              🚀 Начать бесплатно
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl"
            >
              👀 Посмотреть демо
            </Link>
          </div>

          <div className="flex justify-center gap-3 mt-8 text-sm">
            <Link href="/login" className="text-[#8a92a3] hover:text-white">
              Войти
            </Link>
            <span className="text-[#5a6373]">·</span>
            <Link href="/signup" className="text-[#ff9b26] font-bold hover:underline">
              Регистрация
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-5 pb-16">
        <div className="max-w-3xl mx-auto flex justify-center gap-16 flex-wrap">
          <div className="text-center">
            <div className="text-3xl font-black text-[#ff9b26]">990 ₽</div>
            <div className="text-xs text-[#5a6373] uppercase tracking-wider mt-1">
              в месяц
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-[#ff9b26]">3 мин</div>
            <div className="text-xs text-[#5a6373] uppercase tracking-wider mt-1">
              на создание
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-[#ff9b26]">14 дней</div>
            <div className="text-xs text-[#5a6373] uppercase tracking-wider mt-1">
              бесплатно
            </div>
          </div>
        </div>
      </section>

      {/* Тарифы */}
      <section className="px-5 py-16" id="pricing">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-3">Тарифы</h2>
          <p className="text-center text-[#8a92a3] mb-10">
            14 дней бесплатно. Без карты.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-6 rounded-2xl border ${
                  plan.popular
                    ? 'border-[#ff9b26] bg-[#1a1d24] shadow-lg shadow-[#ff9b26]/20'
                    : 'border-white/10 bg-[#1a1d24]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#ff9b26] text-black text-xs font-black rounded-full">
                    ПОПУЛЯРНЫЙ
                  </div>
                )}

                <div className="text-lg font-bold text-white mb-2">{plan.name}</div>
                <div className="text-3xl font-black text-[#ff9b26] mb-1">
                  {plan.price} ₽
                </div>
                <div className="text-sm text-[#8a92a3] mb-4">в месяц</div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-sm text-[#c0c6d0] flex gap-2">
                      <span className="text-green-400">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`block w-full py-3 text-center font-bold rounded-lg ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black'
                      : 'bg-white/5 border border-white/10 text-white'
                  }`}
                >
                  Начать
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Информация об услуге */}
      <section className="px-5 py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-black mb-4">Об услуге</h2>
        <div className="text-[#8a92a3] space-y-3 text-sm leading-relaxed">
          <p>
            QRMenu — SaaS-сервис для создания электронного меню с QR-кодом для кафе и ресторанов.
          </p>
          <p>
            <strong className="text-white">Как получить услугу:</strong> после оплаты доступ к сервису открывается автоматически в личном кабинете. Услуга предоставляется в электронном виде — физическая доставка не требуется. Вы сможете создать меню, сгенерировать QR-код и разместить его в заведении в течение нескольких минут.
          </p>
          <p>
            <strong className="text-white">Оплата:</strong> ежемесячная подписка через Robokassa. 
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-4 text-sm text-[#8a92a3]">
          <div>© {new Date().getFullYear()} QRMenu</div>
          <div className="flex flex-wrap gap-4">
            <Link href="/offer" className="hover:text-white">Оферта</Link>
            <Link href="/privacy" className="hover:text-white">Политика конфиденциальности</Link>
            <Link href="/requisites" className="hover:text-white">Реквизиты</Link>
            <a href="https://t.me/Welcomedse" className="hover:text-white">Поддержка</a>
          </div>
        </div>
      </footer>
    </div>
  )
}