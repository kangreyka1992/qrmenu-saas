import Link from 'next/link'
import { PLANS } from '@/lib/plans'
import AnimatedGradient from './components/AnimatedGradient'
import { FadeUp, ScaleIn } from './components/HeroAnimations'
import FAQ from './components/FAQ'
import PricingCard from './components/PricingCard'
import HeroStats from './components/HeroStats'
import LeadForm from './components/LeadForm'

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
              <a
                href="#contact"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-xl shadow-lg shadow-[#ff9b26]/30 hover:shadow-xl hover:shadow-[#ff9b26]/50 transition-all hover:scale-105"
              >
                🚀 Оставить заявку
                <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              </a>
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

        <FadeUp delay={0.5}>
          <HeroStats />
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
              {
                icon: '⚡',
                title: 'Запуск за 3 минуты',
                desc: 'Регистрация → создание меню → получение QR-кода. Быстрее, чем сварить кофе.',
              },
              {
                icon: '✏️',
                title: 'Обновление в 2 клика',
                desc: 'Изменить цену, добавить блюдо, загрузить фото — всё через удобную админку.',
              },
              {
                icon: '📱',
                title: 'QR-код для печати',
                desc: 'Скачайте PNG высокого разрешения и разместите на столах, стойке, входе.',
              },
              {
                icon: '🍽',
                title: 'Онлайн-заказ',
                desc: 'Гости заказывают прямо из меню. Вы получаете уведомление в Telegram.',
              },
              {
                icon: '🌍',
                title: 'Мультиязычность',
                desc: 'Русский и английский. Идеально для курортных городов и туристов.',
              },
              {
                icon: '📊',
                title: 'Аналитика',
                desc: 'Сколько гостей открыли меню, какие блюда смотрят чаще всего.',
              },
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
      <section className="px-5 py-24 border-t border-white/5" id="pricing">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-black text-center mb-4">
              Тарифы
            </h2>
            <p className="text-center text-[#8a92a3] mb-4 max-w-2xl mx-auto">
              Выберите подписку или оплатите один раз — и пользуйтесь навсегда
            </p>
            <p className="text-center text-[#ff9b26] font-bold mb-16">
              🎁 14 дней бесплатно · Без карты
            </p>
          </FadeUp>

          {/* Блок «Почему выгодно» */}
          <FadeUp>
            <div className="max-w-3xl mx-auto mb-16 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
              <h3 className="text-xl font-black text-white mb-4 text-center">
                💡 Почему выгодно купить «Навсегда»?
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 text-2xl">💰</span>
                  <div>
                    <b className="text-white">Экономия до 90%</b>
                    <p className="text-xs text-gray-400 mt-1">
                      За 5 лет подписка — 149 400 ₽, а «Навсегда» — от 10 000 ₽
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 text-2xl">🔒</span>
                  <div>
                    <b className="text-white">Защита от роста цен</b>
                    <p className="text-xs text-gray-400 mt-1">
                      Платите один раз — цена не изменится
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 text-2xl">♾️</span>
                  <div>
                    <b className="text-white">Все обновления бесплатно</b>
                    <p className="text-xs text-gray-400 mt-1">
                      Новые функции — автоматически
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* ПОДПИСКА */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-black mb-2">
                📅 <span className="text-[#ff9b26]">Подписка</span>
              </h3>
              <p className="text-[#8a92a3] text-sm max-w-xl mx-auto">
                Гибкий вариант — платите ежемесячно, отмените в любой момент
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.filter((p) => p.type === 'subscription').map((plan, i) => (
                <ScaleIn key={plan.id} delay={i * 0.1}>
                  <PricingCard plan={plan} index={i} />
                </ScaleIn>
              ))}
            </div>
          </div>

          {/* НАВСЕГДА */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-black mb-2">
                ♾️ <span className="text-purple-400">Навсегда</span>
              </h3>
              <p className="text-[#8a92a3] text-sm max-w-xl mx-auto">
                Один раз заплатили — пользуетесь пожизненно. Экономия до 90%!
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.filter((p) => p.type === 'lifetime').map((plan, i) => (
                <ScaleIn key={plan.id} delay={i * 0.1}>
                  <PricingCard plan={plan} index={i} />
                </ScaleIn>
              ))}
            </div>
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

      {/* ═══ CTA + LEAD FORM ═══ */}
      <section className="px-5 py-24 border-t border-white/5" id="contact">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-center">
              Получите готовое{' '}
              <span className="bg-gradient-to-r from-[#ff9b26] to-[#ffb84d] bg-clip-text text-transparent">
                QR-меню за 1 день
              </span>
            </h2>
            <p className="text-lg text-[#8a92a3] mb-10 max-w-lg mx-auto text-center">
              Оставьте заявку — мы создадим меню, настроим QR-код 
              и покажем демо. Вам останется только оплатить.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <LeadForm />
          </FadeUp>
        </div>
      </section>
    </div>
  )
}