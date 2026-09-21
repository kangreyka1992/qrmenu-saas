'use client'

import { useState } from 'react'

export default function ParseMenuPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string>('')

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setLoading(true)
    setError('')
    setResult(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/ai/parse-menu', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка')

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-white mb-6">
          🤖 AI — распознать меню
        </h1>

        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/10 mb-6">
          <label className="block text-sm text-[#8a92a3] mb-3">
            Загрузи фото меню — GigaChat распознает блюда и цены
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={loading}
            className="w-full text-white"
          />

          {preview && (
            <div className="mt-4">
              <img src={preview} alt="Preview" className="max-w-sm rounded-lg" />
            </div>
          )}

          {loading && (
            <div className="mt-4 text-[#ff9b26] font-bold">
              🤖 GigaChat анализирует фото... (10-20 секунд)
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">
              ✅ Распознано: {result.restaurant_name || 'Без названия'}
            </h2>

            <div className="space-y-4">
              {result.categories?.map((cat: any, i: number) => (
                <div key={i} className="bg-[#0a0e14] p-4 rounded-lg">
                  <div className="font-bold text-white mb-2">
                    {cat.icon} {cat.name}
                  </div>
                  <div className="space-y-1">
                    {cat.dishes?.map((dish: any, j: number) => (
                      <div key={j} className="flex justify-between text-sm">
                        <span className="text-[#c0c6d0]">
                          {dish.name}
                          {dish.name_en && (
                            <span className="text-[#5a6373]"> / {dish.name_en}</span>
                          )}
                        </span>
                        <span className="text-[#ff9b26] font-bold">
                          {dish.price} ₽
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <details className="mt-6">
              <summary className="text-sm text-[#8a92a3] cursor-pointer">
                Показать JSON (для копирования)
              </summary>
              <pre className="mt-2 p-3 bg-black/40 rounded text-xs text-[#8a92a3] overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}