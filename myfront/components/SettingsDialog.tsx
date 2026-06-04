"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Settings, Moon, Sun, Monitor, Languages, Check, Palette, Save } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage, type Language, accentColors } from "@/lib/language-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SettingsDialog() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, accentColor, setAccentColor, t } = useLanguage()
  
  // Local state for drafting settings
  const [tempLanguage, setTempLanguage] = useState<Language>(language)
  const [tempAccentColor, setTempAccentColor] = useState<string>(accentColor)
  const [tempTheme, setTempTheme] = useState<string>(theme || "system")
  const [isOpen, setIsOpen] = useState(false)

  // Sync temp state with current context when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTempLanguage(language)
      setTempAccentColor(accentColor)
      setTempTheme(theme || "system")
    }
  }, [isOpen, language, accentColor, theme])

  const handleSave = () => {
    setLanguage(tempLanguage)
    setAccentColor(tempAccentColor)
    setTheme(tempTheme)
    setIsOpen(false)
  }

  const languages: { label: string; value: Language }[] = [
    { label: "English", value: "en" },
    { label: "मराठी", value: "mr" },
    { label: "हिन्दी", value: "hi" },
  ]

  const themes = [
    { label: t("settings.dark"), value: "dark", icon: Moon },
    { label: t("settings.light"), value: "light", icon: Sun },
    { label: t("settings.system"), value: "system", icon: Monitor },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          style={{
            background: "var(--glass)",
            border: "1px solid var(--border)",
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--foreground)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          className="hover:scale-110 active:scale-95 bg-[var(--glass)] border-[var(--border)] hover:border-[var(--primary)]/50"
          title={t("settings.title")}
        >
          <Settings size={20} className="text-gray-400" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings className="text-[var(--primary)]" />
            {t("settings.title")}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Customize your experience and click save.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Language Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Languages size={16} /> {t("settings.language")}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setTempLanguage(lang.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                    tempLanguage === lang.value
                      ? "bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]"
                      : "bg-[var(--glass)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    {tempLanguage === lang.value && <Check size={12} className="mb-1" />}
                    {lang.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Sun size={16} /> {t("settings.theme")}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setTempTheme(item.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                    tempTheme === item.value
                      ? "bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]"
                      : "bg-[var(--glass)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <item.icon size={16} className="mb-1" />
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Palette size={16} /> {t("settings.accent")}
            </h4>
            <div className="flex flex-wrap gap-3">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setTempAccentColor(color.value)}
                  style={{ background: color.value }}
                  className={`w-10 h-10 rounded-full transition-all border-4 ${
                    tempAccentColor === color.value ? "border-white scale-110" : "border-transparent hover:scale-105"
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 mt-2 border-t border-[var(--border)]">
            <button
              onClick={handleSave}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              <Save size={18} />
              {t("settings.save")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
