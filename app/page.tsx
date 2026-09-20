import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-white">
      {/* Hero */}
      <section className="px-5 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-[#ff9b26]/15 text-[#ff9b26] rounded-full text-xs font-bold tracking-wider mb-6">
            QR-МЕНЮ ДЛЯ КАФЕ
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 max-w-3xl mx-auto">
            Меню вашего кафе{' '}
            <span className="text-[#ff9b26]">в телефоне гостя</span>{' '}
            за 3 минуты
          </h1>

          <p className="text-lg text-[#8a92a3] max-w-2xl mx-auto mb-10">
            Без интеграций с кассой. Без дизайнера. Без перепечатки. Обновляйте цены в 2 клика — гости видят изменения моментально.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <Link
              href="https://qrmenu-ru.vercel.app/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-xl shadow-lg shadow-[#ff9b26]/30 hover:scale-105 transition-transform"
            >
              👀 Посмотреть демо
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              🚀 Начать бесплатно
            </Link>
          </div>

          <div className="flex justify-center items-center gap-3 text-sm">
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
      <section className="px-5 pb-24">
        <div className="max-w-4xl mx-auto flex justify-center gap-16 flex-wrap">
          <div className="text-center">
            <div className="text-4xl font-black text-[#ff9b26]">990 ₽</div>
            <div className="text-xs text-[#5a6373] uppercase tracking-wider mt-2">
              в месяц
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-[#ff9b26]">3 мин</div>
            <div className="text-xs text-[#5a6373] uppercase tracking-wider mt-2">
              на создание
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-[#ff9b26]">14 дней</div>
            <div className="text-xs text-[#5a6373] uppercase tracking-wider mt-2">
              бесплатно
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}