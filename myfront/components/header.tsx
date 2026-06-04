"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { SettingsDialog } from "@/components/SettingsDialog"
import { 
  Menu, X, Linkedin, Github, MessageCircle, 
  Home, User, GraduationCap, Briefcase, Cpu, Mail 
} from "lucide-react"

const getNavItems = (t: (key: string) => string) => [
  { label: t("nav.home"), href: "/#home", icon: <Home size={22} /> },
  { label: t("nav.about"), href: "/#about", icon: <User size={22} /> },
  { label: t("nav.education"), href: "/#education", icon: <GraduationCap size={22} /> },
  { label: t("nav.projects"), href: "/#products", icon: <Briefcase size={22} /> },
  { label: t("nav.all_products"), href: "/products", icon: <Briefcase size={22} /> },
  { label: t("nav.skills"), href: "/#skills", icon: <Cpu size={22} /> },
  { label: t("nav.contact"), href: "/#contact", icon: <Mail size={22} /> },
]

import { Sidebar } from "@/components/Sidebar"

export function Header() {
  const { t } = useLanguage()
  const navItems = getNavItems(t)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [mobileMenuOpen])

  return (
    <>
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          background: scrolled
            ? "var(--glass)"
            : "transparent",
          backdropFilter: scrolled ? "blur(25px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "none",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ display: "flex", alignItems: "center", height: "70px", justifyContent: "space-between" }}>
            {/* Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "var(--glass-more)",
                border: "1px solid var(--border)",
                padding: "0.5rem 1.1rem",
                borderRadius: "16px",
                color: "var(--foreground)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.03em",
              }}
              className="hover:bg-[rgba(108,99,255,0.1)] hover:border-[#6c63ff]/50 hover:scale-105 active:scale-95"
            >
              <Menu size={18} style={{ color: "#6c63ff" }} />
              <span>{t("nav.menu")}</span>
            </button>

            {/* Quick Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginRight: "0.5rem" }} className="hidden sm:flex">
                <a href="https://linkedin.com/in/abhishek-chougale-573786268" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted-foreground)" }} className="hover:text-[#0077b5] transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted-foreground)" }} className="hover:text-[var(--foreground)] transition-colors">
                  <Github size={18} />
                </a>
              </div>
              <SettingsDialog />
              <a
                href="#contact"
                className="btn-primary"
                style={{ padding: "0.5rem 1.5rem", fontSize: "0.85rem", borderRadius: "14px" }}
              >
                {t("nav.contact")}
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
