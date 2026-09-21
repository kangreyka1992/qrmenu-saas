'use client'

import { motion } from 'framer-motion'

export default function HeroStats() {
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-20">
      {[
        {
          icon: '💰',
          value: '2 490 ₽',
          label: 'в месяц',
          color: '#ff9b26',
          gradient: 'from-[#ff9b26] to-[#ffb84d]',
        },
        {
          icon: '⚡',
          value: '3 мин',
          label: 'на создание',
          color: '#3dd68c',
          gradient: 'from-[#3dd68c] to-[#00d68f]',
        },
        {
          icon: '🎁',
          value: '14 дней',
          label: 'бесплатно',
          color: '#4a9eff',
          gradient: 'from-[#4a9eff] to-[#7c5cff]',
        },
      ].map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className="group relative p-6 bg-gradient-to-br from-[#1a1d24] to-[#0f1218] border border-white/5 rounded-2xl overflow-hidden text-left"
        >
          {/* Свечение в углу */}
          <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"
            style={{ background: stat.color }}
          />

          {/* Иконка */}
          <div className="text-3xl mb-3 relative z-10">{stat.icon}</div>

          {/* Значение */}
          <div
            className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent font-mono relative z-10`}
            style={{
              filter: `drop-shadow(0 0 20px ${stat.color}60)`,
            }}
          >
            {stat.value}
          </div>

          {/* Подпись */}
          <div className="text-xs text-[#5a6373] uppercase tracking-wider mt-2 relative z-10">
            {stat.label}
          </div>

          {/* Верхняя градиентная полоска */}
          <div
            className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stat.gradient} opacity-40 group-hover:opacity-100 transition-opacity`}
          />
        </motion.div>
      ))}
    </div>
  )
}