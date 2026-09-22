import Link from 'next/link'

export default function FailPage() {
  return (
    <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-black text-white mb-3">
          Оплата не прошла
        </h1>
        <p className="text-[#8a92a3] mb-6">
          Что-то пошло не так при оплате. Попробуйте ещё раз или выберите
          оплату на месте.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg text-center"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}