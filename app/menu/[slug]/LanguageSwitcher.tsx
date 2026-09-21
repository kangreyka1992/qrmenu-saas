'use client'

import { useState, useEffect } from 'react'

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<'ru' | 'en'>('ru')

  useEffect(() => {
    const saved = localStorage.getItem('menu_lang') as 'ru' | 'en' | null
    if (saved) setLang(saved)
  }, [])

  function changeLang(newLang: 'ru' | 'en') {
    setLang(newLang)
    localStorage.setItem('menu_lang', newLang)
    // Триггерим обновление страницы
    window.dispatchEvent(new Event('languageChange'))
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex bg-white rounded-full shadow-lg overflow-hidden">
      <button
        onClick={() => changeLang('ru')}
        className={`px-3 py-2 text-sm font-bold transition-colors ${
          lang === 'ru'
            ? 'bg-[#ff9b26] text-black'
            : 'bg-white text-gray-500 hover:text-gray-900'
        }`}
      >
        RU
      </button>
      <button
        onClick={() => changeLang('en')}
        className={`px-3 py-2 text-sm font-bold transition-colors ${
          lang === 'en'
            ? 'bg-[#ff9b26] text-black'
            : 'bg-white text-gray-500 hover:text-gray-900'
        }`}
      >
        EN
      </button>
    </div>
  )
}