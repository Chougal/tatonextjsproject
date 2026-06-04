import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  try {
    const { name, mobile, message } = await request.json()

    if (!name || !mobile) {
      return NextResponse.json(
        { error: 'Name and mobile number are required' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('messages')
      .insert([
        { name, mobile, message: message || null }
      ])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
