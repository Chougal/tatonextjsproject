"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingSocials } from "@/components/FloatingSocials"
import { HeroModel } from "@/components/3d/HeroModel"
import { RevealOnScroll } from "@/components/RevealOnScroll"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Code,
  Database,
  Globe,
  Cpu,
  ArrowLeft,
  ChevronDown,
  Send,
  Github,
  Linkedin,
  Award,
  Calendar,
  BookOpen,
  Star,
  Check,
  Zap,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// ===================== DATA =====================

// Education, Skills, Stats, and Products data are now dynamically generated in HomePage using useLanguage()

// Skills data moved inside HomePage

// Stats data moved inside HomePage

// Products data moved inside HomePage
// Final closing bracket fix

// ===================== ANIMATED COUNTER =====================
function AnimatedCounter({ value }: { value: string }) {
  return <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>{value}</span>
}

// ===================== TYPING EFFECT =====================
function TypeWriter({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [text, setText] = useState("")

  useEffect(() => {
    const current = words[wordIndex]
    const timeout = deleting ? 60 : 100

    const timer = setTimeout(() => {
      if (!deleting && charIndex < current.length) {
        setText(current.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      } else if (deleting && charIndex > 0) {
        setText(current.slice(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      } else if (!deleting && charIndex === current.length) {
        setTimeout(() => setDeleting(true), 1800)
      } else if (deleting && charIndex === 0) {
        setDeleting(false)
        setWordIndex((wordIndex + 1) % words.length)
      }
    }, timeout)

    return () => clearTimeout(timer)
  }, [charIndex, deleting, wordIndex, words])

  return (
    <span>
      <span className="gradient-text">{text}</span>
      <span className="animate-blink" style={{ color: "#6c63ff", marginLeft: "2px" }}>|</span>
    </span>
  )
}

// ===================== SKILL CARD =====================
function SkillCard({ skill }: { skill: any }) {
  return (
    <div className="glass-card hover-glow" style={{ padding: "1.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: `${skill.color}20`,
            border: `1px solid ${skill.color}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: skill.color,
          }}
        >
          {skill.icon}
        </div>
        <h3 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "1.05rem", fontWeight: 700 }}>
          {skill.category}
        </h3>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {skill.techs.map((tech) => (
          <span key={tech} className="tech-tag">
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

// ===================== PRODUCT CARD =====================
function ProductCard({ product }: { product: any }) {
  const { t } = useLanguage()
  return (
    <Dialog>
      <div className="glass-card group hover-glow" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "relative", height: "200px", background: "rgba(0,0,0,0.2)" }}>
          <img 
            src={product.image} 
            alt={product.title} 
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
            className="group-hover:scale-110"
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)" }} />
          <div style={{ position: "absolute", bottom: "1rem", left: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
             {product.tech.map((techName: string) => (
                <span key={techName} style={{ 
                  fontSize: "0.65rem", 
                  padding: "2px 8px", 
                  background: "var(--glass)", 
                  borderRadius: "4px", 
                  backdropFilter: "blur(4px)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)"
                }}>{techName}</span>
             ))}
          </div>
        </div>
        <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
           <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "var(--font-space-grotesk), sans-serif" }}>{product.title}</h4>
           <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "1.5rem", flex: 1 }}>{product.description}</p>
           
            <DialogTrigger asChild>
              <button className="btn-outline" style={{ 
                width: "100%", 
                padding: "0.6rem",
                borderWidth: "2px",
                fontWeight: 700
              }}>{t("projects.viewDetails")}</button>
            </DialogTrigger>
        </div>
      </div>

      <DialogContent className="sm:max-w-[600px] bg-[var(--background)] border-[var(--border)]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6c63ff] bg-[#6c63ff]/10 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
          <DialogTitle className="text-3xl font-bold text-[var(--foreground)]">
            {product.title}
          </DialogTitle>
          <DialogDescription className="text-[var(--muted-foreground)] mt-2 line-height-relaxed">
            {product.fullDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[var(--foreground)]">{t("projects.technologies")}</h4>
              <div className="flex flex-wrap gap-2">
                {product.tech.map((t: string) => (
                  <span key={t} className="text-xs bg-[var(--glass)] border border-[var(--border)] px-2 py-1 rounded text-[var(--foreground)]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[var(--foreground)]">{t("projects.features")}</h4>
              <ul className="space-y-1">
                {product.features.map((f: string) => (
                  <li key={f} className="text-xs text-[var(--muted-foreground)] flex items-center gap-2">
                    <Check size={12} className="text-[var(--primary)]" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[var(--border)] flex gap-3">
             <a href={product.link} className="btn-primary flex-1 justify-center py-2 text-sm">
                {t("projects.liveDemo")}
             </a>
             <button className="btn-outline flex-1 justify-center py-2 text-sm">
                {t("projects.sourceCode")}
             </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ===================== EDUCATION CARD =====================
function EducationCard({ edu, index, total }: { edu: any; index: number; total: number }) {
  const { t } = useLanguage()
  return (
    <Link 
      href={`/education/${edu.id}`}
      style={{
        display: "flex",
        gap: "1.5rem",
        animation: `fadeInUp 0.6s ease ${index * 0.1}s both`,
        textDecoration: "none",
        cursor: "pointer"
      }}
      className="group"
    >
      {/* Timeline indicator */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: `${edu.color}20`,
            border: `1px solid ${edu.color}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem",
            flexShrink: 0,
            transition: "all 0.3s ease"
          }}
          className="group-hover:scale-110 group-hover:rotate-12"
        >
          {edu.icon}
        </div>
        {index < total - 1 && (
          <div
            style={{
              width: "2px",
              flex: 1,
              minHeight: "30px",
              background: `linear-gradient(to bottom, ${edu.color}60, transparent)`,
              margin: "0.5rem 0",
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        className="glass-card hover-glow"
        style={{
          padding: "1.5rem",
          flex: 1,
          marginBottom: index < total - 1 ? "1.25rem" : "0",
          borderLeft: `3px solid ${edu.color}`,
          transition: "transform 0.3s ease, border-color 0.3s ease"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                marginBottom: "0.3rem",
                color: "var(--foreground)",
              }}
              className="group-hover:text-[var(--primary)] transition-colors"
            >
              {edu.degree}
            </h3>
            <p
              style={{
                color: edu.color,
                fontSize: "0.9rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <GraduationCap size={14} />
              {edu.institution}
            </p>
          </div>
          <span
            style={{
              background: `${edu.color}20`,
              color: edu.color,
              border: `1px solid ${edu.color}40`,
              padding: "0.25rem 0.75rem",
              borderRadius: "50px",
              fontSize: "0.75rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              whiteSpace: "nowrap",
            }}
          >
            <Calendar size={12} />
            {edu.year}
          </span>
        </div>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "0.75rem", lineHeight: 1.6 }}>
          {edu.description}
        </p>
        <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: edu.color, fontSize: "0.85rem", fontWeight: 600, opacity: 0 }} className="group-hover:opacity-100 transition-opacity">
           {t("edu.seeDetails")} <ArrowLeft size={14} style={{ transform: "rotate(180deg)" }} />
        </div>
      </div>
    </Link>
  )
}

// ===================== CONTACT FORM =====================
function ContactForm() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: "", mobile: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      setSent(true)
      setForm({ name: "", mobile: "", message: "" })
    } catch (error) {
      console.error("Error submitting form:", error)
      // We could add an error state here, but for now just fail silently like the original
    } finally {
      setSending(false)
      setTimeout(() => setSent(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: 500 }}>
            {t("contact.name")} *
          </label>
          <input
            type="text"
            className="contact-input"
            placeholder="Abhishek Chougale"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: 500 }}>
            {t("contact.mobile")} *
          </label>
          <input
            type="tel"
            className="contact-input"
            placeholder="+91 9876543210"
            required
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: 500 }}>
          {t("contact.message_optional")}
        </label>
        <textarea
          className="contact-input"
          rows={5}
          placeholder="..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ resize: "vertical" }}
        />
      </div>
      <button
        type="submit"
        disabled={sending || sent}
        className="btn-primary"
        style={{
          width: "fit-content",
          opacity: sending ? 0.7 : 1,
          cursor: sending ? "not-allowed" : "pointer",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {sent ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Check size={16} />
            {t("contact.sent")}
          </div>
        ) : sending ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="animate-spin" style={{ width: "14px", height: "14px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%" }} />
            {t("contact.sending")}
          </div>
        ) : (
          <>
            <Send size={16} />
            {t("contact.send")}
          </>
        )}
      </button>

      {sent && (
        <div 
          style={{ 
            marginTop: "1rem", 
            padding: "1rem", 
            borderRadius: "12px", 
            background: "rgba(67, 217, 173, 0.1)", 
            border: "1px solid rgba(67, 217, 173, 0.3)",
            color: "#43d9ad",
            fontWeight: 600,
            fontSize: "0.95rem"
          }}
        >
          <TypeWriter words={["Thank you for reaching out to Abhishek!"]} />
        </div>
      )}
    </form>
  )
}

// ===================== MAIN PAGE =====================
export default function HomePage() {
  const { t, language } = useLanguage()

  const educationData = (t("data.education") as any[]).map((edu, index) => ({
    ...edu,
    icon: index < 2 ? "🎓" : index === 2 ? "📚" : index === 3 ? "📖" : "🏫",
    color: index === 0 ? "#6c63ff" : index === 1 ? "#ff6584" : index === 2 ? "#43d9ad" : index === 3 ? "#ffa500" : "#ff4757"
  }))

  const productsData = (t("data.products") as any[]).map((prod, index) => ({
    ...prod,
    image: index === 0 ? "/modern-office-dashboard.png" : index === 1 ? "/modern-dairy-farm.png" : "/jewelry-store-system.png",
    link: "#"
  }))

  const skillsData = [
    { category: t("skills.frontend"), icon: <Globe size={22} />, color: "#6c63ff", techs: ["HTML5", "CSS3", "JavaScript", "React.js", "Next.js", "TypeScript"] },
    { category: t("skills.backend"), icon: <Code size={22} />, color: "#ff6584", techs: ["Node.js", "Express.js", "REST API", "Python", "Java"] },
    { category: t("skills.database"), icon: <Database size={22} />, color: "#43d9ad", techs: ["MySQL", "MongoDB", "PostgreSQL", "Firebase"] },
    { category: t("skills.tools"), icon: <Cpu size={22} />, color: "#ffa500", techs: ["Git", "GitHub", "VS Code", "Postman", "Linux", "Docker"] },
  ]

  const statsData = [
    { label: t("stats.years"), value: "7+", icon: <BookOpen size={20} />, color: "#6c63ff" },
    { label: t("stats.degrees"), value: "2", icon: <Award size={20} />, color: "#ff6584" },
    { label: t("stats.projects"), value: "15+", icon: <Zap size={20} />, color: "#43d9ad" },
    { label: t("stats.tech"), value: "20+", icon: <Star size={20} />, color: "#ffa500" },
  ]

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <Header />

      {/* ===== HERO SECTION ===== */}
      <section
        id="home"
        className="bg-mesh gradient-move"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "clamp(120px, 20vh, 160px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Orbs */}
        <div
          className="orb orb-purple animate-float"
          style={{ width: "min(600px, 90vw)", height: "min(600px, 90vw)", top: "-150px", right: "-100px", opacity: 0.2 }}
        />
        <div
          className="orb orb-pink animate-float"
          style={{ width: "min(400px, 70vw)", height: "min(400px, 70vw)", bottom: "-50px", left: "-100px", animationDelay: "2s" }}
        />
        <div
          className="orb orb-cyan animate-pulse-glow"
          style={{ width: "min(350px, 60vw)", height: "min(350px, 60vw)", top: "40%", left: "35%", opacity: 0.1 }}
        />
        <div
          className="orb orb-purple animate-float"
          style={{ width: "200px", height: "200px", bottom: "10%", right: "20%", animationDuration: "6s" }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem 1.5rem",
            position: "relative",
            zIndex: 1,
            display: "grid",
            gap: "3rem",
            alignItems: "center",
          }}
          className="md:grid-cols-[1fr_auto] grid-cols-1"
        >
          {/* Left Content */}
          <div className="animate-fade-in-up md:order-1 order-2 text-center md:text-left">
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(108,99,255,0.12)",
                border: "1px solid rgba(108,99,255,0.3)",
                borderRadius: "50px",
                padding: "0.4rem 1rem",
                marginBottom: "1.5rem",
                color: "#8b85ff",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: "0.7rem" }}>🟢</span>
              {t("hero.available")}
            </div>

            {/* Name */}
            <h1
              style={{
                fontSize: "clamp(1.75rem, 8vw, 4.5rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: "1rem",
                letterSpacing: "-0.02em",
              }}
            >
              {t("hero.hi")}{" "}
              <span className="gradient-text">Abhishek</span>
              <br />
              <span style={{ color: "var(--foreground)" }}>Vishnu Chougale</span>
            </h1>

            {/* Typing Effect */}
            <div
              style={{
                fontSize: "clamp(1.1rem, 4vw, 1.8rem)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 600,
                marginBottom: "1.5rem",
                color: "var(--muted-foreground)",
                minHeight: "2.5rem",
              }}
            >
              <TypeWriter
                key={language}
                words={t("hero.typewriter")}
              />
            </div>

            {/* Description */}
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                lineHeight: 1.8,
                maxWidth: "580px",
                marginBottom: "2.5rem",
                marginLeft: "auto",
                marginRight: "auto"
              }}
              className="md:ml-0 md:mr-0"
            >
              {t("hero.description")}
            </p>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }} className="md:justify-start">
              <a href="#contact" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Mail size={18} /> {t("hero.getInTouch")}
              </a>
              <a href="#products" className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Zap size={18} /> {t("hero.viewProducts")}
              </a>
            </div>

            {/* Social Links */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", alignItems: "center", justifyContent: "center" }} className="md:justify-start">
              <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>{t("hero.findMe")}</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "var(--muted-foreground)",
                  textDecoration: "none",
                  fontSize: "0.91rem",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#6c63ff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)")}
              >
                <Github size={18} /> {t("hero.github")}
              </a>
              <a
                href="https://www.linkedin.com/in/abhishek-chougale-573786268"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "var(--muted-foreground)",
                  textDecoration: "none",
                  fontSize: "0.91rem",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#0077b5")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)")}
              >
                <Linkedin size={18} /> {t("hero.linkedin")}
              </a>
            </div>
          </div>

          <FloatingSocials />

          {/* Right - 3D Model */}
          <div
            className="md:order-2 order-1"
            style={{ position: "relative", flexShrink: 0, margin: "0 auto", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <HeroModel />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
          className="animate-float"
        >
          <span style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>SCROLL</span>
          <ChevronDown size={20} style={{ color: "var(--primary)" }} />
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section style={{ padding: "5rem 1.5rem", background: "rgba(12,12,20,0.6)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealOnScroll>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
              {statsData.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card hover-glow"
                  style={{ padding: "2rem", textAlign: "center" }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "14px",
                      background: `${stat.color}20`,
                      border: `1px solid ${stat.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: stat.color,
                      margin: "0 auto 1rem",
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      color: stat.color,
                      lineHeight: 1,
                      marginBottom: "0.5rem",
                    }}
                  >
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", fontWeight: 500 }}>
                    {stat.label === "Years of Study" ? t("stats.years") : 
                    stat.label === "Degrees Earned" ? t("stats.degrees") :
                    stat.label === "Projects Built" ? t("stats.projects") :
                    stat.label === "Technologies" ? t("stats.tech") : stat.label}
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== PRODUCTS SECTION ===== */}
      <section id="products" style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealOnScroll>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <p style={{ color: "#6c63ff", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.75rem" }}>
                My Offerings
              </p>
              <h2 className="section-title">{t("projects.title")}</h2>
              <div className="section-line" />
              <p className="section-subtitle">{t("projects.subtitle")}</p>
            </div>
          </RevealOnScroll>

          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
              gap: "2.5rem" 
            }}
          >
            {productsData.map((prod, idx) => (
                <RevealOnScroll key={idx} delay={idx * 100}>
                   <ProductCard product={prod} />
                </RevealOnScroll>
             ))}
          </div>
        </div>
      </section>

      {/* ===== EDUCATION SECTION ===== */}
      <section id="education" style={{ padding: "6rem 1.5rem", background: "rgba(10,10,18,0.8)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealOnScroll>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <p style={{ color: "#ff6584", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.75rem" }}>
                Academic Journey
              </p>
              <h2 className="section-title">{t("education.title")}</h2>
              <div className="section-line" style={{ background: "linear-gradient(135deg, #ff6584 0%, #6c63ff 100%)" }} />
              <p className="section-subtitle">
                {t("education.subtitle")}
              </p>
            </div>
          </RevealOnScroll>

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0" }}>
            {educationData.map((edu, index) => (
              <RevealOnScroll key={edu.id} delay={index * 150}>
                <EducationCard edu={edu} index={index} total={educationData.length} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SKILLS SECTION ===== */}
      <section id="skills" style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ color: "#43d9ad", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.75rem" }}>
              What I Know
            </p>
            <h2 className="section-title">{t("skills.title")}</h2>
            <div className="section-line" style={{ background: "linear-gradient(135deg, #43d9ad 0%, #6c63ff 100%)" }} />
            <p className="section-subtitle">
              {t("skills.subtitle")}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {skillsData.map((skill) => (
              <SkillCard key={skill.category} skill={skill} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section id="testimonials" style={{ padding: "6rem 1.5rem", background: "rgba(10,10,18,0.4)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealOnScroll>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <p style={{ color: "#ff6584", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.75rem" }}>
                Client Stories
              </p>
              <h2 className="section-title">What My Clients Say</h2>
              <div className="section-line" style={{ background: "linear-gradient(135deg, #ff6584 0%, #6c63ff 100%)" }} />
            </div>
          </RevealOnScroll>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {[
              { name: "Sagar Patil", role: "Dairy Owner", text: "The Smart Dairy Analytics system transformed my business. Accurate records and easy quality monitoring. Highly recommend Abhishek!", rating: 5 },
              { name: "Pooja Deshmukh", role: "Retailer", text: "Jewellery Management Pro is exactly what I needed for my shop. The billing is super fast and inventory management is seamless.", rating: 5 },
              { name: "Rahul More", role: "Student", text: "I bought a project for my final year, and the code quality was top-notch. Abhishek also helped me with the setup. Great support!", rating: 5 },
            ].map((t, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <div className="glass-card hover-glow" style={{ padding: "2rem", position: "relative" }}>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "1rem" }}>
                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="#FFD700" color="#FFD700" />)}
                  </div>
                  <p style={{ fontStyle: "italic", color: "var(--muted-foreground)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>&quot;{t.text}&quot;</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary-glow)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--primary)" }}>{t.name[0]}</div>
                    <div>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>{t.name}</h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section id="faq" style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <RevealOnScroll>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <p style={{ color: "#43d9ad", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.75rem" }}>
                Questions?
              </p>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <div className="section-line" style={{ background: "linear-gradient(135deg, #43d9ad 0%, #6c63ff 100%)" }} />
            </div>
          </RevealOnScroll>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { q: "How will I receive the project after purchase?", a: "Once the payment is confirmed via WhatsApp, I will send you a secure link to download the source code, database, and documentation." },
              { q: "Do you provide support for project setup?", a: "Yes! Every purchase includes basic setup support via WhatsApp or AnyDesk to ensure the project runs smoothly on your system." },
              { q: "Can I request custom changes to a project?", a: "Absolutely. I can customize any project to fit your specific requirements. We can discuss the details and additional costs on WhatsApp." },
              { q: "Is the code well-documented?", a: "Yes, all my projects come with clean, commented code and a setup guide to help you understand the architecture." }
            ].map((faq, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <div className="glass-card" style={{ padding: "1.5rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <Check size={18} className="text-[var(--primary)]" /> {faq.q}
                  </h4>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem", paddingLeft: "1.8rem" }}>{faq.a}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" style={{ padding: "6rem 1.5rem", background: "rgba(10,10,18,0.8)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ color: "#ffa500", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.75rem" }}>
              Let&apos;s Connect
            </p>
            <h2 className="section-title">{t("contact.title")}</h2>
            <div className="section-line" style={{ background: "linear-gradient(135deg, #ffa500 0%, #ff6584 100%)" }} />
            <p className="section-subtitle">
              Have a project in mind? Reach out to me!
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Contact Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                Contact Information
              </h3>

              {[
                {
                  icon: <Mail size={20} />,
                  label: t("contact.email_label"),
                  value: "abhishekchougale038@gmail.com",
                  color: "#ff6584",
                  href: "mailto:abhishekchougale038@gmail.com",
                },
                {
                  icon: <Phone size={20} />,
                  label: t("contact.phone"),
                  value: "+91 9325519485",
                  color: "#6c63ff",
                  href: "tel:+919325519485",
                },
                {
                  icon: <MapPin size={20} />,
                  label: t("contact.location"),
                  value: "Tisangi, Maharashtra",
                  color: "#43d9ad",
                  href: null,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass-card"
                  style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: `${item.color}20`,
                      border: `1px solid ${item.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", fontWeight: 500, marginBottom: "0.15rem" }}>
                      {item.label}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--foreground)",
                          textDecoration: "none",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = item.color)}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--foreground)")}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div style={{ color: "var(--foreground)", fontSize: "0.9rem", fontWeight: 600 }}>
                        {item.value}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="glass-card" style={{ padding: "2.5rem" }}>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                {t("contact.sendMessage")}
              </h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
