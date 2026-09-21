'use client'

import { useState } from 'react'
import { updateCategory } from './actions'

export default function EditCategoryForm({
  category,
  restaurantId,
  slug,
}: {
  category: any
  restaurantId: string
  slug: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await updateCategory(formData)
      setOpen(false)
    } catch (e: any) {
      alert('Ошибка: ' + e.message)
    }
    setLoading(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#ff9b26] hover:underline"
      >
        ✎ Изменить
      </button>
    )
  }

  return (
    <form action={handleSubmit} className="bg-[#0a0e14] p-3 rounded-lg my-2 space-y-2 w-full">
      <input type="hidden" name="category_id" value={category.id} />
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <input type="hidden" name="slug" value={slug} />

      <div className="flex gap-2">
        <input
          name="icon"
          defaultValue={category.icon}
          maxLength={2}
          className="w-16 px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white text-center text-xl"
        />
        <input
          name="name"
          defaultValue={category.name}
          required
          className="flex-1 px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#ff9b26] text-black font-bold rounded-lg text-sm disabled:opacity-50"
        >
          {loading ? 'Сохраняем...' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}