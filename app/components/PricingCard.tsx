'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plan } from '@/lib/plans'

export default function PricingCard({
  plan,
  index,
}: {
  plan: Plan
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`relative p-6 rounded-2xl border ${
        plan.popular
          ? 'border-[#ff9b26] bg-[#1a1d24] shadow-2xl shadow-[#ff9b26]/30'
          : 'border-white/10 bg-[#1a1d24]'
      }`}
    >
      {plan.popular && (
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black text-xs font-black rounded-full shadow-lg shadow-[#ff9b26]/50"
        >
          ПОПУЛЯРНЫЙ
        </motion.div>
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
        className={`block w-full py-3 text-center font-bold rounded-lg transition-all hover:scale-105 ${
          plan.popular
            ? 'bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black shadow-lg shadow-[#ff9b26]/30'
            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
        }`}
      >
        Начать
      </Link>
    </motion.div>
  )
}