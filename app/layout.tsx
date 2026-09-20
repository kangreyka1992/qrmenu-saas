import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QRMenu — QR-меню для кафе',
  description: 'Создайте красивое QR-меню для кафе за 3 минуты. Без интеграций с кассой.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}