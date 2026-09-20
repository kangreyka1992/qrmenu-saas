import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]" style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Шапка */}
      <div
        className="text-center py-10 px-5 text-white"
        style={{
          background: 'linear-gradient(135deg, #d4a574, #b8935f)',
        }}
      >
        <div className="text-5xl mb-3">☕</div>
        <h1 className="text-2xl font-black">У Фонтана</h1>
        <p className="text-sm opacity-90 mt-2">📍 ул. Курортная, 5, Ессентуки</p>
        <p className="text-sm opacity-90 mt-1">📞 +7 (999) 123-45-67</p>
        <p className="text-sm opacity-90 mt-1">🕐 08:00–23:00</p>
      </div>

      {/* Меню */}
      <div className="p-4 pb-24">

        {/* Завтраки */}
        <div className="mb-8">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-gray-900">
            <span className="w-1 h-6 rounded bg-[#d4a574]" />
            🍳 Завтраки
          </h2>

          <div className="flex gap-3 p-3 bg-white rounded-xl mb-2 shadow-sm">
            <div className="w-20 h-20 rounded-lg bg-[#f0f0f0] overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
              🥞
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-1 text-gray-900">Сырники со сметаной</div>
              <div className="text-xs text-gray-500 line-clamp-2">Домашние сырники из творога, сметана, варенье на выбор</div>
            </div>
            <div className="font-black self-center whitespace-nowrap text-[#d4a574]">320 ₽</div>
          </div>

          <div className="flex gap-3 p-3 bg-white rounded-xl mb-2 shadow-sm">
            <div className="w-20 h-20 rounded-lg bg-[#f0f0f0] overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
              🍳
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-1 text-gray-900">Омлет с томатами</div>
              <div className="text-xs text-gray-500 line-clamp-2">Три яйца, свежие томаты, зелень, тост</div>
            </div>
            <div className="font-black self-center whitespace-nowrap text-[#d4a574]">280 ₽</div>
          </div>

          <div className="flex gap-3 p-3 bg-white rounded-xl mb-2 shadow-sm">
            <div className="w-20 h-20 rounded-lg bg-[#f0f0f0] overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
              🥐
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-1 text-gray-900">Круассан с лососем</div>
              <div className="text-xs text-gray-500 line-clamp-2">Свежий круассан, сливочный сыр, слабосолёный лосось</div>
            </div>
            <div className="font-black self-center whitespace-nowrap text-[#d4a574]">420 ₽</div>
          </div>
        </div>

        {/* Салаты */}
        <div className="mb-8">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-gray-900">
            <span className="w-1 h-6 rounded bg-[#d4a574]" />
            🥗 Салаты
          </h2>

          <div className="flex gap-3 p-3 bg-white rounded-xl mb-2 shadow-sm">
            <div className="w-20 h-20 rounded-lg bg-[#f0f0f0] overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
              🥗
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-1 text-gray-900">Цезарь с курицей</div>
              <div className="text-xs text-gray-500 line-clamp-2">Романо, курица гриль, пармезан, гренки, соус цезарь</div>
            </div>
            <div className="font-black self-center whitespace-nowrap text-[#d4a574]">450 ₽</div>
          </div>

          <div className="flex gap-3 p-3 bg-white rounded-xl mb-2 shadow-sm">
            <div className="w-20 h-20 rounded-lg bg-[#f0f0f0] overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
              🥑
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-1 text-gray-900">Салат с авокадо</div>
              <div className="text-xs text-gray-500 line-clamp-2">Авокадо, томаты черри, руккола, кедровые орехи</div>
            </div>
            <div className="font-black self-center whitespace-nowrap text-[#d4a574]">490 ₽</div>
          </div>
        </div>

        {/* Горячее */}
        <div className="mb-8">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-gray-900">
            <span className="w-1 h-6 rounded bg-[#d4a574]" />
            🍝 Горячее
          </h2>

          <div className="flex gap-3 p-3 bg-white rounded-xl mb-2 shadow-sm">
            <div className="w-20 h-20 rounded-lg bg-[#f0f0f0] overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
              🍕
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-1 text-gray-900">Пицца Маргарита</div>
              <div className="text-xs text-gray-500 line-clamp-2">Томатный соус, моцарелла, базилик, орегано</div>
            </div>
            <div className="font-black self-center whitespace-nowrap text-[#d4a574]">650 ₽</div>
          </div>

          <div className="flex gap-3 p-3 bg-white rounded-xl mb-2 shadow-sm">
            <div className="w-20 h-20 rounded-lg bg-[#f0f0f0] overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
              🍝
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-1 text-gray-900">Паста Карбонара</div>
              <div className="text-xs text-gray-500 line-clamp-2">Спагетти, гуанчале, желток, пармезан, чёрный перец</div>
            </div>
            <div className="font-black self-center whitespace-nowrap text-[#d4a574]">580 ₽</div>
          </div>
        </div>

        {/* Напитки */}
        <div className="mb-8">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-gray-900">
            <span className="w-1 h-6 rounded bg-[#d4a574]" />
            ☕ Напитки
          </h2>

          <div className="flex gap-3 p-3 bg-white rounded-xl mb-2 shadow-sm">
            <div className="w-20 h-20 rounded-lg bg-[#f0f0f0] overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
              ☕
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-1 text-gray-900">Капучино</div>
              <div className="text-xs text-gray-500 line-clamp-2">Эспрессо, взбитое молоко, корица</div>
            </div>
            <div className="font-black self-center whitespace-nowrap text-[#d4a574]">220 ₽</div>
          </div>

          <div className="flex gap-3 p-3 bg-white rounded-xl mb-2 shadow-sm">
            <div className="w-20 h-20 rounded-lg bg-[#f0f0f0] overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
              🍵
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-1 text-gray-900">Чай с чабрецом</div>
              <div className="text-xs text-gray-500 line-clamp-2">Кавказский чай с горным чабрецом и мёдом</div>
            </div>
            <div className="font-black self-center whitespace-nowrap text-[#d4a574]">180 ₽</div>
          </div>
        </div>

      </div>

      {/* Плашка */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-black text-white text-center py-3 text-xs"
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        Хотите такое же меню?{' '}
        <Link href="/signup" className="text-[#ff9b26] font-bold">
          Создать бесплатно →
        </Link>
      </div>
    </div>
  )
}