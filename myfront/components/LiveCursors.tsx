"use client"

import * as React from "react"
import { supabase } from "@/lib/supabase/client"

type Cursor = {
  x: number
  y: number
  color: string
}

const COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e",
  "#10b981", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"
]

export function LiveCursors() {
  const [cursors, setCursors] = React.useState<Record<string, Cursor>>({})
  const [myColor, setMyColor] = React.useState<string>("")
  const channel = React.useRef<any>(null)
  
  React.useEffect(() => {
    // Assign a random color to this user
    setMyColor(COLORS[Math.floor(Math.random() * COLORS.length)])
    
    // Join a public Supabase Realtime channel
    channel.current = supabase.channel('live-cursors', {
      config: {
        broadcast: { ack: false, self: false },
      },
    })
    
    channel.current
      .on('broadcast', { event: 'cursor-move' }, (payload: any) => {
        setCursors(prev => ({
          ...prev,
          [payload.payload.id]: {
            x: payload.payload.x,
            y: payload.payload.y,
            color: payload.payload.color
          }
        }))
        
        // Cleanup old cursors (simple approach: delete cursor after 5 seconds of inactivity)
        // A more robust approach would use Presence, but this is a lightweight broadcast
        setTimeout(() => {
          setCursors(prev => {
            const next = { ...prev }
            delete next[payload.payload.id]
            return next
          })
        }, 5000)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel.current)
    }
  }, [])

  React.useEffect(() => {
    if (!myColor) return
    const id = Math.random().toString(36).substring(7)
    
    let lastTime = 0
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < 50) return // Throttle to 20fps for performance
      lastTime = now
      
      const x = e.clientX
      const y = e.clientY
      
      if (channel.current) {
        channel.current.send({
          type: 'broadcast',
          event: 'cursor-move',
          payload: { id, x, y, color: myColor }
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [myColor])

  // Don't render anything if we're not on the client or no cursors
  if (Object.keys(cursors).length === 0) return null

  return (
    <>
      {Object.entries(cursors).map(([id, cursor]) => (
        <div
          key={id}
          className="pointer-events-none fixed top-0 left-0 z-[9999] transition-all duration-100 ease-out"
          style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
        >
          <svg
            width="24"
            height="36"
            viewBox="0 0 24 36"
            fill="none"
            stroke="white"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            <path
              d="M5.65376 21.1597L1.80214 3.03083C1.4925 1.57321 3.07252 0.380482 4.41724 1.05834L21.7247 9.78918C23.1091 10.4876 23.0033 12.493 21.5541 13.0483L14.0772 15.9149L10.3541 23.3619C9.79883 24.8111 7.79339 24.9169 7.09498 23.5325L5.65376 21.1597Z"
              fill={cursor.color}
            />
          </svg>
        </div>
      ))}
    </>
  )
}
