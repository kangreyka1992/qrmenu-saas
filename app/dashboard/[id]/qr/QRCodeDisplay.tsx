'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function QRCodeDisplay({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    QRCode.toCanvas(canvasRef.current, url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
  }, [url])

  function downloadQR() {
    if (!canvasRef.current) return

    // Генерируем в высоком разрешении 1024×1024
    QRCode.toDataURL(url, {
      width: 1024,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    }).then((dataUrl) => {
      const link = document.createElement('a')
      link.download = `qr-${url.split('/').pop()}.png`
      link.href = dataUrl
      link.click()
    })
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('Не удалось скопировать')
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Canvas с QR */}
      <div className="bg-white p-4 rounded-2xl mb-6">
        <canvas ref={canvasRef} />
      </div>

      {/* Кнопки */}
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={downloadQR}
          className="px-6 py-3 bg-gradient-to-r from-[#ff9b26] to-[#e07a00] text-black font-bold rounded-xl"
        >
          📥 Скачать PNG
        </button>
        <button
          onClick={copyLink}
          className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl"
        >
          {copied ? '✅ Скопировано' : '📋 Скопировать ссылку'}
        </button>
      </div>
    </div>
  )
}