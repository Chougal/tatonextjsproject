import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

import { LanguageProvider } from "@/lib/language-context"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp"
import { VoiceAssistant } from "@/components/VoiceAssistant"
import { CommandPalette } from "@/components/CommandPalette"
import { LiveCursors } from "@/components/LiveCursors"
import { AIChatbot } from "@/components/AIChatbot"

export const metadata: Metadata = {
  title: "Abhishek Chougale | Full Stack Developer",
  description:
    "Personal portfolio of Abhishek Vishnu Chougale — MCA student, passionate full-stack developer from Maharashtra. Explore my education, skills, and projects.",
  keywords: ["Abhishek Chougale", "MCA", "Full Stack Developer", "Portfolio", "React", "Next.js"],
  authors: [{ name: "Abhishek Vishnu Chougale" }],
  openGraph: {
    title: "Abhishek Chougale | Full Stack Developer",
    description: "MCA Student | Full Stack Developer | Maharashtra",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LanguageProvider>
            {children}
            <VoiceAssistant />
            <FloatingWhatsApp />
            <CommandPalette />
            <LiveCursors />
            <AIChatbot />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
