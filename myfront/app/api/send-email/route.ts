import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()
    console.log("Contact form submitted:", type, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Failed to process request" }, { status: 500 })
  }
}
