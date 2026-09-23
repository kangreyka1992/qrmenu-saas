import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No image' }, { status: 400 })
    }

    // ═══ 1. Конвертируем в base64 ═══
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    // ═══ 2. Отправляем в GigaChat ═══
    const gigaRes = await fetch(
      'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GIGACHAT_TOKEN}`,
        },
        body: JSON.stringify({
          model: 'GigaChat',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Распознай меню на фото. Верни ТОЛЬКО JSON, без пояснений, строго в таком формате:
{
  "restaurant_name": "Название",
  "categories": [
    {
      "name": "Категория",
      "icon": "🍽",
      "dishes": [
        { "name": "Блюдо", "price": 100, "description": "" }
      ]
    }
  ]
}`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64}`,
                  },
                },
              ],
            },
          ],
          temperature: 0.1,
        }),
      }
    )

    if (!gigaRes.ok) {
      const errText = await gigaRes.text()
      console.error('GigaChat error:', errText)
      return NextResponse.json(
        { error: 'GigaChat не отвечает' },
        { status: 500 }
      )
    }

    const gigaData = await gigaRes.json()
    const content = gigaData.choices?.[0]?.message?.content || ''

    // ═══ 3. Парсим JSON ═══
    let parsed
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content)
    } catch (e) {
      console.error('JSON parse error:', content)
      return NextResponse.json(
        { error: 'Не удалось распознать меню' },
        { status: 500 }
      )
    }

    // ═══ 4. Подставляем фото из Unsplash ═══
    const withPhotos = await addPhotosToDishes(parsed)

    return NextResponse.json(withPhotos)
  } catch (error: any) {
    console.error('Parse error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════
// ФУНКЦИЯ ПОДСТАНОВКИ ФОТО ИЗ UNSPLASH
// ═══════════════════════════════════════════════════
async function addPhotosToDishes(menu: any) {
  const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY

  if (!UNSPLASH_KEY) {
    console.warn('UNSPLASH_ACCESS_KEY не задан — фото не подставлены')
    return menu
  }

  for (const category of menu.categories || []) {
    for (const dish of category.dishes || []) {
      try {
        // Очищаем название от лишних символов
        const cleanName = dish.name
          .replace(/[«»""]/g, '')
          .replace(/[^\wа-яА-Я\s]/g, ' ')
          .trim()
          .slice(0, 50)

        // Ищем фото по названию блюда
        const query = encodeURIComponent(cleanName)
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=squarish&content_filter=high`,
          {
            headers: {
              Authorization: `Client-ID ${UNSPLASH_KEY}`,
            },
          }
        )

        if (!res.ok) {
          console.error(`Unsplash error for "${dish.name}":`, res.status)
          dish.image_url = getDefaultImage(category.name)
          continue
        }

        const data = await res.json()
        const photo = data.results?.[0]

        if (photo) {
          // Используем маленькое фото (400px)
          dish.image_url = photo.urls.small
        } else {
          // Если не нашли — дефолтное по категории
          dish.image_url = getDefaultImage(category.name)
        }

        // Пауза, чтобы не превысить лимит (50/час)
        await new Promise((r) => setTimeout(r, 200))
      } catch (e) {
        console.error(`Photo error for "${dish.name}":`, e)
        dish.image_url = getDefaultImage(category.name)
      }
    }
  }

  return menu
}

// ═══════════════════════════════════════════════════
// ДЕФОЛТНЫЕ ФОТО ПО КАТЕГОРИЯМ
// ═══════════════════════════════════════════════════
function getDefaultImage(categoryName: string): string {
  const name = (categoryName || '').toLowerCase()

  if (name.includes('пицц')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
  }
  if (
    name.includes('напит') ||
    name.includes('кофе') ||
    name.includes('чай') ||
    name.includes('коктейл') ||
    name.includes('смузи')
  ) {
    return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'
  }
  if (
    name.includes('десерт') ||
    name.includes('торт') ||
    name.includes('морожен') ||
    name.includes('пирожн') ||
    name.includes('сладк')
  ) {
    return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'
  }
  if (name.includes('салат')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
  }
  if (name.includes('суп')) {
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'
  }
  if (name.includes('бургер') || name.includes('сэндвич') || name.includes('хот-дог')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  }
  if (name.includes('паста') || name.includes('макарон') || name.includes('спагетти')) {
    return 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'
  }
  if (name.includes('завтрак') || name.includes('омлет') || name.includes('яичниц')) {
    return 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400'
  }
  if (name.includes('мясо') || name.includes('стейк') || name.includes('куриц')) {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'
  }
  if (name.includes('рыб') || name.includes('морепродукт')) {
    return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400'
  }
  if (name.includes('блин') || name.includes('оладь') || name.includes('сырник')) {
    return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400'
  }
  if (name.includes('хлеб') || name.includes('выпечк') || name.includes('булочк')) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'
  }

  // Дефолт — общее фото еды
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'
}