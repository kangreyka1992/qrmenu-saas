import Link from 'next/link'
import { PLANS } from '@/lib/plans'
import AnimatedGradient from './components/AnimatedGradient'
import { FadeUp, ScaleIn } from './components/HeroAnimations'
import FAQ from './components/FAQ'
import PricingCard from './components/PricingCard'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-white relative overflow-hidden">
      <AnimatedGradient />

      {/* ═══ HERO ═══ */}
      <section className="px-5 py-24 text-center relative">
        <div className="max-w-3xl mx-auto">
          <FadeUp delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff9b26]/10 border border-[#ff9b26]/20 text-[#ff9b26] rounded-full text-xs font-bold tracking-wider mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#ff9b26] animate-pulse" />
              QR-МЕНЮ ДЛЯ КАФЕ
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6 tracking-tight">
              Меню вашего кафе{' '}
              <span className="bg-gradient-to-r from-[#ff9b26] to-[#ffb84d] bg-clip-text text-transparent">
                в телефоне гостя
              </span>{' '}
              за 3 минуты
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-lg text-[#8a92a3] max-w-xl mx-auto mb-8 leading-relaxed">
              Без интеграций с кассой. Без дизайнера. Без перепечатки.
              Обновляйте цены в 2 клика — гости видят изменения моментально.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-xl shadow-lg shadow-[#ff9b26]/30 hover:shadow-xl hover:shadow-[#ff9b26]/50 transition-all hover:scale-105"
              >
                🚀 Начать бесплатно
                <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
              >
                👀 Посмотреть демо
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="flex justify-center gap-3 mt-8 text-sm">
              <Link
                href="/login"
                className="text-[#8a92a3] hover:text-white transition-colors"
              >
                Войти
              </Link>
              <span className="text-[#5a6373]">·</span>
              <Link
                href="/signup"
                className="text-[#ff9b26] font-bold hover:underline"
              >
                Регистрация
              </Link>
            </div>
          </FadeUp>
        </div>

        {/* Stats */}
        <FadeUp delay={0.5}>
          <div className="max-w-3xl mx-auto flex justify-center gap-16 flex-wrap mt-20">
            <div className="text-center">
              <div className="text-4xl font-black text-[#ff9b26] font-mono">990 ₽</div>
              <div className="text-xs text-[#5a6373] uppercase tracking-wider mt-2">
                в месяц
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-[#ff9b26] font-mono">3 мин</div>
              <div className="text-xs text-[#5a6373] uppercase tracking-wider mt-2">
                на создание
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-[#ff9b26] font-mono">14 дней</div>
              <div className="text-xs text-[#5a6373] uppercase tracking-wider mt-2">
                бесплатно
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="px-5 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
              Почему выбирают <span className="text-[#ff9b26]">QRMenu</span>
            </h2>
            <p className="text-center text-[#8a92a3] mb-14 max-w-xl mx-auto">
              Всё, что нужно кафе для современного электронного меню
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Запуск за 3 минуты', desc: 'Регистрация → создание меню → получение QR-кода. Быстрее, чем сварить кофе.' },
              { icon: '✏️', title: 'Обновление в 2 клика', desc: 'Изменить цену, добавить блюдо, загрузить фото — всё через удобную админку.' },
              { icon: '📱', title: 'QR-код для печати', desc: 'Скачайте PNG высокого разрешения и разместите на столах, стойке, входе.' },
              { icon: '🍽', title: 'Онлайн-заказ', desc: 'Гости заказывают прямо из меню. Вы получаете уведомление в Telegram.' },
              { icon: '🌍', title: 'Мультиязычность', desc: 'Русский и английский. Идеально для курортных городов и туристов.' },
              { icon: '📊', title: 'Аналитика', desc: 'Сколько гостей открыли меню, какие блюда смотрят чаще всего.' },
            ].map((f, i) => (
              <ScaleIn key={i} delay={i * 0.05}>
                <div className="group p-6 bg-[#1a1d24] border border-white/5 rounded-2xl hover:border-[#ff9b26]/30 hover:bg-[#1a1d24]/80 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff9b26]/20 to-[#ff9b26]/5 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-[#8a92a3] leading-relaxed">{f.desc}</p>
                </div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="px-5 py-20 border-t border-white/5" id="pricing">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
              Тарифы
            </h2>
            <p className="text-center text-[#8a92a3] mb-14">
              14 дней бесплатно. Без карты.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <PricingCard key={plan.id} plan={plan} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="px-5 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
              Частые <span className="text-[#ff9b26]">вопросы</span>
            </h2>
            <p className="text-center text-[#8a92a3] mb-14">
              Отвечаем на то, что спрашивают чаще всего
            </p>
          </FadeUp>

          <FAQ />
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="px-5 py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              Готовы запустить{' '}
              <span className="bg-gradient-to-r from-[#ff9b26] to-[#ffb84d] bg-clip-text text-transparent">
                своё QR-меню?
              </span>
            </h2>
            <p className="text-lg text-[#8a92a3] mb-10 max-w-lg mx-auto">
              Регистрация за 30 секунд. Первое меню — за 3 минуты.
              14 дней бесплатно.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-xl shadow-lg shadow-[#ff9b26]/40 hover:shadow-xl hover:shadow-[#ff9b26]/60 transition-all hover:scale-105"
              >
                🚀 Создать бесплатно
              </Link>
              <a
                href="https://t.me/Welcomedse"
                target="_blank"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                💬 Написать в Telegram
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-5 py-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-4 text-sm text-[#8a92a3]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff9b26] to-[#e07a00] flex items-center justify-center text-sm">
              🎰
            </div>
            <span>© {new Date().getFullYear()} QRMenu</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/offer" className="hover:text-white transition-colors">
              Оферта
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/requisites" className="hover:text-white transition-colors">
              Реквизиты
            </Link>
            <a
              href="https://t.me/Welcomedse"
              className="hover:text-white transition-colors"
            >
              Поддержка
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}