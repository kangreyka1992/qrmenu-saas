'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQ_ITEMS = [
  {
    q: 'Нужна ли интеграция с кассой?',
    a: 'Нет. QRMenu работает автономно — вы просто загружаете меню через админку. Никаких договоров с iiko, никаких сложных настроек.',
  },
  {
    q: 'Как быстро я смогу запустить меню?',
    a: 'От регистрации до работающего QR-меню — 3 минуты. Мы помогаем с загрузкой первого меню бесплатно.',
  },
  {
    q: 'Что если гости не пользуются QR?',
    a: 'Работает вместе с обычным меню. Вы можете оставить печатное меню для тех, кто предпочитает, и добавить QR для удобства.',
  },
  {
    q: 'Можно ли обновлять цены самостоятельно?',
    a: 'Да, в любое время через админку. Изменения появляются у гостей моментально — не нужно перепечатывать или ждать дизайнера.',
  },
  {
    q: 'Есть ли бесплатный тест?',
    a: 'Да, 14 дней бесплатно. Никаких карт, никаких обязательств. Если не понравится — просто не продлевайте.',
  },
  {
    q: 'Работает ли меню на английском?',
    a: 'Да. Вы можете добавить переводы на английский — гости смогут переключаться между языками одной кнопкой.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="max-w-3xl mx-auto">
      {FAQ_ITEMS.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="mb-3"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left bg-[#1a1d24] hover:bg-[#232732] transition-colors rounded-xl px-5 py-4 flex items-center justify-between"
          >
            <span className="font-bold text-white pr-4">{item.q}</span>
            <motion.span
              animate={{ rotate: openIndex === i ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-[#ff9b26] text-2xl font-bold flex-shrink-0"
            >
              +
            </motion.span>
          </button>

          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="overflow-hidden"
              >
                <div className="px-5 py-4 text-[#8a92a3] text-sm leading-relaxed">
                  {item.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}