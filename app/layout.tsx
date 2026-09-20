import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'QRMenu — QR-меню для кафе',
  description: 'Создайте красивое QR-меню для кафе за 3 минуты.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        {children}

        <footer className="bg-[#0a0e14] border-t border-white/10 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4 text-sm text-[#8a92a3]">
            <div>
              © {new Date().getFullYear()} QRMenu. Все права защищены.
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/offer" className="hover:text-white">
                Оферта
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Политика конфиденциальности
              </Link>
              <Link href="/requisites" className="hover:text-white">
                Реквизиты
              </Link>
              <a href="https://t.me/Welcomedse" className="hover:text-white">
                Поддержка
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}