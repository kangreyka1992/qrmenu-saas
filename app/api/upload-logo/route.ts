import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `logos/${user.id}-${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
      .from('dish-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (error) throw new Error(error.message)

    const { data: { publicUrl } } = supabase.storage
      .from('dish-images')
      .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}