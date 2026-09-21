'use client'

import { useState } from 'react'
import { updateDish, uploadDishImage } from './actions'

export default function EditDishForm({
  dish,
  restaurantId,
  slug,
}: {
  dish: any
  restaurantId: string
  slug: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(dish.image_url || '')

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

  function handleRemoveImage() {
    if (!confirm('Удалить фото?')) return
    setImageUrl('')
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.append('image_url', imageUrl)
    try {
      await updateDish(formData)
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
        className="w-10 h-10 rounded-lg bg-[#1a1d24] hover:bg-[#232732] text-white text-lg font-bold transition-colors"
        title="Редактировать блюдо"
      >
        ✏️
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false)
      }}
    >
      <form
        action={handleSubmit}
        className="bg-[#0a0e14] p-6 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/10 space-y-4"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-black text-white">Редактировать блюдо</h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/5 text-[#8a92a3] hover:text-white"
          >
            ✕
          </button>
        </div>

        <input type="hidden" name="dish_id" value={dish.id} />
        <input type="hidden" name="restaurant_id" value={restaurantId} />
        <input type="hidden" name="slug" value={slug} />

        {/* Название RU + EN */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-[#8a92a3] mb-1">Название (RU)</label>
            <input
              name="name"
              defaultValue={dish.name}
              required
              className="w-full px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-[#8a92a3] mb-1">Name (EN)</label>
            <input
              name="name_en"
              defaultValue={dish.name_en || ''}
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
              defaultValue={dish.description || ''}
              rows={2}
              className="w-full px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-[#8a92a3] mb-1">Description (EN)</label>
            <textarea
              name="description_en"
              defaultValue={dish.description_en || ''}
              rows={2}
              className="w-full px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white resize-none"
            />
          </div>
        </div>

        {/* Цена */}
        <div>
          <label className="block text-xs text-[#8a92a3] mb-1">Цена (₽)</label>
          <input
            name="price"
            type="number"
            defaultValue={dish.price}
            required
            min="1"
            className="w-full px-3 py-2 bg-[#1a1d24] border border-white/10 rounded-lg text-white"
          />
        </div>

        {/* Фото */}
        <div>
          <label className="block text-xs text-[#8a92a3] mb-2">Фото блюда</label>

          {imageUrl ? (
            <div className="relative inline-block">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white font-bold text-sm"
                title="Удалить фото"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 bg-[#1a1d24] border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center text-3xl text-[#5a6373]">
              🍽
            </div>
          )}

          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-[#8a92a3]"
            />
            {uploading && <p className="text-xs text-[#ff9b26] mt-1">Загрузка...</p>}
            <p className="text-xs text-[#5a6373] mt-1">
              {imageUrl ? 'Выбери новое фото чтобы заменить' : 'PNG или JPG'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 py-3 bg-white/5 text-white font-bold rounded-lg"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg disabled:opacity-50"
          >
            {loading ? 'Сохраняем...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  )
}