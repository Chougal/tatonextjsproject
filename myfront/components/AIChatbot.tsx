"use client"

import * as React from "react"
import { Bot, X, Send, User, Sparkles } from "lucide-react"

type Message = {
  role: "user" | "ai"
  content: string
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([
    { role: "ai", content: "Hi! I'm Abhishek's AI assistant. How can I help you today?" }
  ])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      })
      
      const data = await res.json()
      
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: "ai", content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "Sorry, I am facing some issues connecting to my brain. Please try again later." }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Network error occurred." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-4">
        {isOpen && (
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl w-80 h-96 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="bg-[var(--primary)] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold">
                <Bot size={20} /> AI Abhishek
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-md transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[var(--background)]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-[var(--primary)] text-white" : "bg-[var(--glass)] border border-[var(--border)] text-[var(--foreground)]"}`}>
                    {msg.role === "user" ? <User size={14} /> : <Sparkles size={14} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-[var(--primary)] text-white rounded-tr-none" : "bg-[var(--glass)] border border-[var(--border)] text-[var(--foreground)] rounded-tl-none"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="self-start flex gap-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-[var(--glass)] border border-[var(--border)] flex items-center justify-center shrink-0">
                    <Sparkles size={14} />
                  </div>
                  <div className="p-3 rounded-2xl text-sm bg-[var(--glass)] border border-[var(--border)] rounded-tl-none flex items-center gap-1">
                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-[var(--border)] bg-[var(--background)] flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-[var(--glass)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--primary)] text-[var(--foreground)]"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-[var(--primary)] text-white w-10 h-10 flex items-center justify-center rounded-xl disabled:opacity-50 hover:bg-[var(--primary)]/90 transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
        
        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform shadow-purple-500/30 self-start"
          >
            <Bot size={28} />
          </button>
        )}
      </div>
    </>
  )
}
