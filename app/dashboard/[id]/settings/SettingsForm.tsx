'use client'

import { useState } from 'react'
import { updateRestaurant } from './actions'

const COLOR_PRESETS = [
  '#d4a574', // Бежевый
  '#ff6b6b', // Красный
  '#4ecdc4', // Бирюзовый
  '#95e1d3', // Мятный
  '#f38181', // Коралловый
  '#aa96da', // Сиреневый
  '#ffd93d', // Жёлтый
  '#6bcf7f', // Зелёный
  '#4a9eff', // Синий
  '#ff8c42', // Оранжевый
  '#000000', // Чёрный
]

export default function SettingsForm({ restaurant }: { restaurant: any }) {
  const [logoUrl, setLogoUrl] = useState(restaurant.logo_url || '')
  const [color, setColor] = useState(restaurant.primary_color || '#d4a574')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) setLogoUrl(data.url)
    } catch (err: any) {
      alert('Ошибка загрузки: ' + err.message)
    }
    setUploading(false)
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true)
    formData.append('logo_url', logoUrl)
    formData.append('primary_color', color)
    try {
      await updateRestaurant(formData)
      alert('Сохранено!')
    } catch (err: any) {
      alert('Ошибка: ' + err.message)
    }
    setSaving(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={restaurant.id} />

      {/* Логотип */}
      <div>
        <label className="block text-sm text-[#8a92a3] mb-3 font-bold">
          Логотип заведения
        </label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-[#0a0e14] overflow-hidden flex items-center justify-center text-4xl border border-white/10">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              '☕'
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="text-sm text-[#8a92a3]"
            />
            {uploading && <p className="text-xs text-[#ff9b26] mt-1">Загрузка...</p>}
            <p className="text-xs text-[#5a6373] mt-1">
              PNG или JPG, рекомендуется 200×200
            </p>
          </div>
        </div>
      </div>

      {/* Цвет бренда */}
      <div>
        <label className="block text-sm text-[#8a92a3] mb-3 font-bold">
          Цвет бренда
        </label>
        <div className="grid grid-cols-6 gap-2 mb-3">
          {COLOR_PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{ background: c }}
              className={`w-full aspect-square rounded-lg border-2 transition-transform ${
                color === c
                  ? 'border-white scale-110'
                  : 'border-transparent'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 rounded cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="px-3 py-2 bg-[#0a0e14] border border-white/10 rounded-lg text-white text-sm font-mono"
          />
        </div>
      </div>

      {/* Название */}
      <div>
        <label className="block text-sm text-[#8a92a3] mb-2 font-bold">Название</label>
        <input
          name="name"
          defaultValue={restaurant.name}
          required
          className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white outline-none focus:border-[#ff9b26]"
        />
      </div>

      {/* Адрес */}
      <div>
        <label className="block text-sm text-[#8a92a3] mb-2 font-bold">Адрес</label>
        <input
          name="address"
          defaultValue={restaurant.address || ''}
          placeholder="ул. Курортная, 5"
          className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white outline-none focus:border-[#ff9b26]"
        />
      </div>

      {/* Телефон */}
      <div>
        <label className="block text-sm text-[#8a92a3] mb-2 font-bold">Телефон</label>
        <input
          name="phone"
          defaultValue={restaurant.phone || ''}
          placeholder="+7 (999) 123-45-67"
          className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white outline-none focus:border-[#ff9b26]"
        />
      </div>

      {/* Часы работы */}
      <div>
        <label className="block text-sm text-[#8a92a3] mb-2 font-bold">Часы работы</label>
        <input
          name="work_hours"
          defaultValue={restaurant.work_hours || ''}
          placeholder="08:00–23:00"
          className="w-full px-4 py-3 bg-[#0a0e14] border border-white/10 rounded-lg text-white outline-none focus:border-[#ff9b26]"
        />
      </div>

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg disabled:opacity-50"
      >
        {saving ? 'Сохраняем...' : 'Сохранить изменения'}
      </button>
    </form>
  )
}