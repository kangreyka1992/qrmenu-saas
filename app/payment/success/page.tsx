import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-black text-white mb-3">
          Оплата прошла успешно!
        </h1>
        <p className="text-[#8a92a3] mb-6">
          Осталось заполнить данные — мы свяжемся с вами в течение часа.
        </p>
        <Link
          href="/dashboard/welcome"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg"
        >
          Заполнить данные →
        </Link>
      </div>
    </div>
  )
}