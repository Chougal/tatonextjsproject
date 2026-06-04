"use client"

import { Github, Linkedin, MessageCircle, ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"

export function FloatingSocials() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <>
      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "30px",
          left: "30px",
          width: "45px",
          height: "45px",
          background: "var(--primary)",
          display: isVisible ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          color: "white",
          border: "none",
          cursor: "pointer",
          zIndex: 90,
          boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease"
        }}
        className="hover:scale-110 active:scale-95"
      >
        <ArrowUp size={22} />
      </button>
    </>
  )
}
