const GIGACHAT_AUTH_KEY = process.env.GIGACHAT_AUTH_KEY || ''
const GIGACHAT_API_URL = 'https://gigachat.devices.sberbank.ru/api/v1'
const GIGACHAT_OAUTH_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth'

// Отключаем проверку SSL для сертификата Минцифры
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.value
  }

  const rquid = crypto.randomUUID()

  const response = await fetch(GIGACHAT_OAUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      RqUID: rquid,
      Authorization: `Basic ${GIGACHAT_AUTH_KEY}`,
    },
    body: 'scope=GIGACHAT_API_PERS',
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`GigaChat auth error: ${response.status} — ${text}`)
  }

  const data = await response.json()
  cachedToken = {
    value: data.access_token,
    expiresAt: data.expires_at,
  }
  return data.access_token
}

// Шаг 1: Загрузка файла в GigaChat
async function uploadImageToGigaChat(
  imageBase64: string,
  fileName: string
): Promise<string> {
  const token = await getAccessToken()

  // Конвертируем base64 в Blob
  const buffer = Buffer.from(imageBase64, 'base64')
  const blob = new Blob([buffer], { type: 'image/jpeg' })

  const formData = new FormData()
  formData.append('file', blob, fileName)
  formData.append('purpose', 'general')

  const response = await fetch(`${GIGACHAT_API_URL}/files`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`GigaChat upload error: ${response.status} — ${text}`)
  }

  const data = await response.json()
  return data.id
}

// Шаг 2: Отправка чата с файлом
export async function parseMenuWithGigaChat(
  imageBase64: string,
  fileName: string = 'menu.jpg'
): Promise<any> {
  // Загружаем файл
  const fileId = await uploadImageToGigaChat(imageBase64, fileName)

  const token = await getAccessToken()

  const prompt = `Распознай меню на фото. Верни ТОЛЬКО JSON без markdown.

Схема:
{
  "restaurant_name": "название (если видно)",
  "categories": [{
    "name": "категория",
    "icon": "🍽",
    "dishes": [{
      "name": "блюдо",
      "price": 450,
      "description": "описание (если есть)"
    }]
  }]
}

Правила:
- prices — числа без ₽
- Не добавляй name_en — только русский
- Не добавляй лишние поля
- Только JSON, без текста`

  const response = await fetch(`${GIGACHAT_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model: 'GigaChat-2-Max',
      messages: [
        {
          role: 'user',
          content: prompt,
          attachments: [fileId],
        },
      ],
      temperature: 0.1,
      
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`GigaChat API error: ${response.status} — ${text}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Пустой ответ от GigaChat')

  const clean = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  return JSON.parse(clean)
}