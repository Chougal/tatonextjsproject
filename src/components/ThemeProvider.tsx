"use client";

import { useEffect } from "react";

function applyTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme || "cyan");
}

function applyLang(lang: string) {
  document.documentElement.lang = lang || "en";
}

function loadAndApply() {
  try {
    const settingsStr = localStorage.getItem("ritech_settings");
    if (settingsStr) {
      const s = JSON.parse(settingsStr);
      if (s.theme) applyTheme(s.theme);
      if (s.language) applyLang(s.language);
    }
  } catch { /* ignore */ }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply on mount
    loadAndApply();

    // React to changes from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "ritech_settings" && e.newValue) {
        try {
          const s = JSON.parse(e.newValue);
          if (s.theme) applyTheme(s.theme);
          if (s.language) applyLang(s.language);
        } catch { /* ignore */ }
      }
    };
    window.addEventListener("storage", handleStorage);

    // React to same-tab localStorage writes via custom event
    const handleCustom = () => loadAndApply();
    window.addEventListener("ritech_settings_changed", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("ritech_settings_changed", handleCustom);
    };
  }, []);

  return <>{children}</>;
}
