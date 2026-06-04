"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useTheme } from "next-themes"
import { 
  Home, User, GraduationCap, Briefcase, Cpu, Mail, 
  Settings, LogOut, ChevronRight, Moon, Sun, 
  LayoutDashboard, ShoppingBag, MessageSquare
} from "lucide-react"

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, language } = useLanguage()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid rendering theme-dependent UI until mounted to prevent hydration errors
  const currentTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : "dark"

  const navItems = [
    { label: t("nav.home"), href: "/#home", icon: <Home size={22} /> },
    { label: t("nav.all_products"), href: "/products", icon: <ShoppingBag size={22} />, badge: 24 },
    { label: t("nav.about"), href: "/#about", icon: <User size={22} /> },
    { label: t("nav.education"), href: "/#education", icon: <GraduationCap size={22} /> },
    { label: t("nav.skills"), href: "/#skills", icon: <Cpu size={22} /> },
    { label: t("nav.contact"), href: "/#contact", icon: <Mail size={22} />, badge: "!" },
  ]

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          zIndex: 9999,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "opacity 0.4s ease"
        }}
      />

      <aside
        style={{
          position: "fixed",
          top: "0.5rem",
          left: "0.5rem",
          bottom: "0.5rem",
          width: "calc(100% - 1rem)",
          maxWidth: "320px",
          background: "var(--card)",
          backdropFilter: "blur(25px)",
          border: "1px solid var(--border)",
          borderRadius: "28px",
          zIndex: 10000,
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: isOpen ? "translate3d(0,0,0)" : "translate3d(-105%,0,0)",
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        {/* Profile Section */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
          padding: "0.75rem",
          background: "var(--glass-more)",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          position: "relative"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            overflow: "hidden",
            flexShrink: 0,
            background: "var(--primary-glow)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: "var(--primary)"
          }}>
            <span style={{ fontSize: "1.3rem" }}>A</span>
          </div>
          
          <div>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Abhishek Chougale</h4>
            <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", margin: 0 }}>Full Stack Developer</p>
          </div>

          <button 
            onClick={onClose}
            style={{
              position: "absolute",
              right: "-10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "var(--primary)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 0 10px var(--primary-glow)"
            }}
          >
            <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.9rem",
                borderRadius: "18px",
                color: "var(--muted-foreground)",
                textDecoration: "none",
                transition: "all 0.3s ease",
                position: "relative"
              }}
              className="hover:bg-[rgba(108,99,255,0.1)] hover:text-[#6c63ff] group"
            >
              <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.icon}
              </div>
              
              <span style={{ fontSize: "1rem", fontWeight: 600 }}>
                {item.label}
              </span>

              {item.badge && (
                <div style={{
                  marginLeft: "auto",
                  background: "var(--primary)",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "50px",
                  minWidth: "20px",
                  textAlign: "center"
                }}>
                  {item.badge}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div style={{ 
          marginTop: "auto", 
          display: "flex", 
          flexDirection: "column", 
          gap: "0.5rem",
          borderTop: "1px solid var(--border)",
          paddingTop: "1.5rem"
        }}>
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.9rem",
              borderRadius: "18px",
              background: "var(--glass-more)",
              border: "1px solid var(--border)",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              width: "100%",
              transition: "all 0.3s ease"
            }}
            className="hover:bg-white/5"
          >
            <div style={{ flexShrink: 0 }}>
              {currentTheme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 600 }}>
              {currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
            <div style={{ 
               marginLeft: "auto", 
               width: "36px", 
               height: "20px", 
               background: currentTheme === "dark" ? "var(--primary)" : "rgba(0,0,0,0.1)", 
               borderRadius: "50px", 
               position: "relative",
               transition: "background 0.3s ease"
             }}>
                <div style={{ 
                  width: "14px", 
                  height: "14px", 
                  background: "white", 
                  borderRadius: "50%", 
                  position: "absolute", 
                  top: "3px", 
                  left: currentTheme === "dark" ? "19px" : "3px",
                  transition: "all 0.3s ease"
                }} />
             </div>
          </button>

          <Link
            href="/settings"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.9rem",
              borderRadius: "18px",
              color: "var(--muted-foreground)",
              textDecoration: "none",
              transition: "all 0.3s ease"
            }}
            className="hover:bg-white/5"
          >
            <Settings size={22} />
            <span style={{ fontSize: "1rem", fontWeight: 600 }}>Settings</span>
          </Link>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.9rem",
              borderRadius: "18px",
              color: "#ff6584",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: "100%",
              transition: "all 0.3s ease"
            }}
            className="hover:bg-[#ff658410]"
          >
            <LogOut size={22} />
            <span style={{ fontSize: "1rem", fontWeight: 600 }}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
