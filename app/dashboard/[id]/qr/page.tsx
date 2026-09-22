'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import QRCode from 'qrcode'
import Link from 'next/link'

export default function QRPage() {
  const params = useParams()
  const id = params.id as string

  const [slug, setSlug] = useState('')
  const [name, setName] = useState('')
  const [tableCount, setTableCount] = useState(10)
  const [qrCodes, setQrCodes] = useState<{ table: number; dataUrl: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setSlug(data.slug)
        setName(data.name)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!slug) return

    const generate = async () => {
      const codes: { table: number; dataUrl: string }[] = []
      const baseUrl = window.location.origin

      for (let i = 1; i <= tableCount; i++) {
        const url = `${baseUrl}/menu/${slug}?table=${i}`
        const dataUrl = await QRCode.toDataURL(url, {
          width: 400,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' },
        })
        codes.push({ table: i, dataUrl })
      }

      setQrCodes(codes)
    }

    generate()
  }, [slug, tableCount])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center text-white">
        Загрузка...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6 print:bg-white print:p-0">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .qr-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
          .qr-card {
            page-break-inside: avoid;
            border: 2px solid #000 !important;
          }
          body { background: white !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="no-print">
          <Link
            href={`/dashboard/${id}`}
            className="text-[#8a92a3] text-sm inline-block mb-4"
          >
            ← Назад к меню
          </Link>

          <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/10 mb-6">
            <h1 className="text-2xl font-black text-white mb-2">
              📱 QR-коды для столов
            </h1>
            <p className="text-sm text-[#8a92a3] mb-4">
              Распечатайте и положите на каждый стол — гость отсканирует и закажет
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <label className="text-sm text-[#8a92a3]">
                Количество столов:
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={tableCount}
                onChange={(e) => setTableCount(Number(e.target.value))}
                className="w-24 px-3 py-2 bg-[#0a0e14] border border-white/10 rounded-lg text-white"
              />
              <button
                onClick={() => window.print()}
                className="px-5 py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-lg"
              >
                🖨 Печать QR-кодов
              </button>
            </div>
          </div>
        </div>

        <div className="qr-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {qrCodes.map((qr) => (
            <div
              key={qr.table}
              className="qr-card bg-white p-6 rounded-2xl text-center shadow-lg"
            >
              <div className="text-black font-black text-xl mb-3">
                {name}
              </div>
              <img
                src={qr.dataUrl}
                alt={`QR для стола ${qr.table}`}
                className="w-full aspect-square"
              />
              <div className="text-black font-black text-4xl mt-4">
                Стол {qr.table}
              </div>
              <div className="text-gray-600 text-sm mt-2">
                📷 Наведите камеру и закажите
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}