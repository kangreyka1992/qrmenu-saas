'use client'

import { useState } from 'react'
import {
  createCategory,
  deleteCategory,
  createDish,
  deleteDish,
  uploadDishImage,
} from './actions'

// ═══ ФОРМА СОЗДАНИЯ КАТЕГОРИИ ═══
export function CategoryForm({ restaurantId, slug }: { restaurantId: string; slug: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await createCategory(formData)
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
        className="px-5 py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg"
      >
        + Добавить категорию
      </button>
    )
  }

  return (
    <form action={handleSubmit} className="bg-[#0a0e14] p-4 rounded-lg space-y-3">
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <input type="hidden" name="slug" value={slug} />

      <div className="flex gap-2">
        <input
          name="icon"
          placeholder="🍽"
          maxLength={2}
          defaultValue="🍽"
          className="w-16 px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white text-center text-xl"
        />
        <input
          name="name"
          placeholder="Название категории (Завтраки)"
          required
          className="flex-1 px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-[#ff9b26] text-black font-bold rounded-lg disabled:opacity-50"
        >
          {loading ? 'Сохраняем...' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-5 py-2 bg-white/5 text-white rounded-lg"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}

// ═══ ФОРМА СОЗДАНИЯ БЛЮДА (с EN-полями) ═══
export function DishForm({
  categoryId,
  restaurantId,
  slug,
}: {
  categoryId: string
  restaurantId: string
  slug: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const url = await uploadDishImage(formData)
      setImageUrl(url)
    } catch (err: any) {
      alert('Ошибка загрузки: ' + err.message)
    }
    setUploading(false)
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.append('image_url', imageUrl)
    try {
      await createDish(formData)
      setOpen(false)
      setImageUrl('')
    } catch (err: any) {
      alert('Ошибка: ' + err.message)
    }
    setLoading(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-[#ff9b26] font-bold hover:underline"
      >
        + Добавить блюдо
      </button>
    )
  }

  return (
    <form action={handleSubmit} className="bg-[#0a0e14] p-4 rounded-lg space-y-3 mt-3">
      <input type="hidden" name="category_id" value={categoryId} />
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <input type="hidden" name="slug" value={slug} />

      {/* Название RU + EN */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-[#8a92a3] mb-1">Название (RU)</label>
          <input
            name="name"
            placeholder="Филадельфия"
            required
            className="w-full px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-[#8a92a3] mb-1">Name (EN)</label>
          <input
            name="name_en"
            placeholder="Philadelphia"
            className="w-full px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Описание RU + EN */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-[#8a92a3] mb-1">Описание (RU)</label>
          <textarea
            name="description"
            placeholder="Лосось, сливочный сыр"
            rows={2}
            className="w-full px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white resize-none"
          />
        </div>
        <div>
          <label className="block text-xs text-[#8a92a3] mb-1">Description (EN)</label>
          <textarea
            name="description_en"
            placeholder="Salmon, cream cheese"
            rows={2}
            className="w-full px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white resize-none"
          />
        </div>
      </div>

      {/* Цена */}
      <input
        name="price"
        type="number"
        placeholder="Цена (₽)"
        required
        min="1"
        className="w-full px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white"
      />

      {/* Фото */}
      <div>
        <label className="block text-xs text-[#8a92a3] mb-2">Фото блюда</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full text-sm text-[#8a92a3]"
        />
        {uploading && <p className="text-xs text-[#ff9b26] mt-1">Загрузка...</p>}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg mt-2"
          />
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-5 py-2 bg-[#ff9b26] text-black font-bold rounded-lg disabled:opacity-50"
        >
          {loading ? 'Сохраняем...' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-5 py-2 bg-white/5 text-white rounded-lg"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}

// ═══ КНОПКА УДАЛЕНИЯ ═══
export function DeleteButton({
  action,
  hiddenFields,
  confirmText,
}: {
  action: (fd: FormData) => Promise<void>
  hiddenFields: Record<string, string>
  confirmText: string
}) {
  const [loading, setLoading] = useState(false)

  async function handleDelete(formData: FormData) {
    if (!confirm(confirmText)) return
    setLoading(true)
    try {
      await action(formData)
    } catch (e: any) {
      alert('Ошибка: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <form action={handleDelete}>
      {Object.entries(hiddenFields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button
        type="submit"
        disabled={loading}
        className="text-xs text-red-400 hover:text-red-300"
      >
        {loading ? '...' : 'Удалить'}
      </button>
    </form>
  )
}