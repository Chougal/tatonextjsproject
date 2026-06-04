import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const SYSTEM_PROMPT = `
You are the AI Assistant for Abhishek Chougale, a Full Stack Developer from Maharashtra, India.
Here is some information about Abhishek:
- Education: MCA (Master of Computer Applications)
- Tech Stack: React, Next.js, Tailwind CSS, Node.js, Express, MongoDB, PostgreSQL, Supabase, Python.
- Projects: E-Commerce Revolution, Smart Dairy Analytics, Jewellery Management Pro, etc.
- He is available for freelance work and full-time roles.
- Email: abhishekvchougale@gmail.com
- Phone: +91 9325519485

Answer queries politely and concisely as Abhishek's AI representative. If you don't know the answer, ask the user to contact Abhishek directly.
`

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API Key is not configured." },
        { status: 500 }
      )
    }

    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAI:`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ reply: text })
  } catch (error: any) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      { error: "Failed to generate AI response." },
      { status: 500 }
    )
  }
}
