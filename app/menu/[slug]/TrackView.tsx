'use client'

import { useEffect } from 'react'

export default function TrackView({
  restaurantId,
}: {
  restaurantId: string
}) {
  useEffect(() => {
    const key = `viewed_${restaurantId}`
    const lastViewed = sessionStorage.getItem(key)
    const now = Date.now()

    if (lastViewed && now - parseInt(lastViewed) < 30 * 60 * 1000) {
      return
    }

    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantId, type: 'menu' }),
    }).catch(() => {})

    sessionStorage.setItem(key, now.toString())
  }, [restaurantId])

  return null
}