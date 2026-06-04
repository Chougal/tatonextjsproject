"use client"

import { MessageCircle } from "lucide-react"

export function FloatingWhatsApp() {
  const phoneNumber = "9325519485"
  const message = "Hi Abhishek, I saw your portfolio and would like to chat!"
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "60px",
        height: "60px",
        backgroundColor: "#25D366",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)",
        zIndex: 9999,
        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        cursor: "pointer",
        border: "none",
      }}
      className="hover:scale-110 hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] animate-float"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={32} color="white" fill="white" />
      
      {/* Tooltip-like badge */}
      <span style={{
        position: "absolute",
        right: "100%",
        marginRight: "1rem",
        backgroundColor: "var(--card)",
        color: "var(--foreground)",
        padding: "0.5rem 1rem",
        borderRadius: "12px",
        fontSize: "0.85rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        border: "1px solid var(--border)",
        pointerEvents: "none",
        opacity: 0,
        transform: "translateX(10px)",
        transition: "all 0.3s ease"
      }} className="hidden md:block group-hover:opacity-100 group-hover:transform-none">
        Chat with me!
      </span>
      
      {/* Pulse effect */}
      <div style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        backgroundColor: "#25D366",
        opacity: 0.4,
        zIndex: -1,
      }} className="animate-ping" />
    </a>
  )
}
