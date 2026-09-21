import { NextRequest, NextResponse } from 'next/server'
import { parseMenuWithGigaChat } from '@/lib/gigachat'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'Нет файла' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString('base64')

    // Передаём имя файла для GigaChat
    const result = await parseMenuWithGigaChat(base64, file.name)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('GigaChat parse error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}