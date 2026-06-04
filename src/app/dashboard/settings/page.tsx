"use client";

import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Save, Download, Upload, Shield, Clock, Palette, Globe, Check } from "lucide-react";

interface Settings {
  studio_name: string;
  address: string;
  phone: string;
  gstin: string;
  invoice_footer: string;
  default_discount: string;
  default_payment_mode: string;
  theme: string;
  language: string;
}

const DEFAULT_SETTINGS: Settings = {
  studio_name: "Ritesh Tattoo Studio",
  address: "Kolhapur",
  phone: "9876543210",
  gstin: "",
  invoice_footer: "Thank you for visiting!",
  default_discount: "0",
  default_payment_mode: "Cash",
  theme: "cyan",
  language: "en",
};

const ALL_KEYS = [
  "ritech_invoices",
  "ritech_expenses",
  "ritech_customers",
  "ritech_notes",
  "ritech_investments",
  "ritech_settings",
];

// Helper: collect all data from localStorage
function collectAllData() {
  const data: Record<string, unknown> = {};
  ALL_KEYS.forEach(k => {
    try { data[k] = JSON.parse(localStorage.getItem(k) || "null"); } catch { data[k] = null; }
  });
  return data;
}

// Helper: trigger file download
function downloadJSON(data: Record<string, unknown>, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Get current month key e.g. "2026-06"
function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function SettingsPage() {
  const [settings, setSettings, loaded] = useLocalStorage<Settings>("ritech_settings", DEFAULT_SETTINGS);
  const [draftSettings, setDraftSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [lastBackupMonth, setLastBackupMonth] = useLocalStorage<string>("ritech_last_backup_month", "");
  const [autoBackupEnabled, setAutoBackupEnabled] = useLocalStorage<boolean>("ritech_auto_backup", true);
  const [backupHistory, setBackupHistory] = useLocalStorage<string[]>("ritech_backup_history", []);

  useEffect(() => {
    if (loaded) setDraftSettings(settings);
  }, [loaded, settings]);

  const savedSettingsRef = useRef(settings);
  useEffect(() => {
    savedSettingsRef.current = settings;
  }, [settings]);

  // Revert preview theme/language if unmounted without saving
  useEffect(() => {
    return () => {
      document.documentElement.setAttribute("data-theme", savedSettingsRef.current.theme || "cyan");
      document.documentElement.lang = savedSettingsRef.current.language || "en";
    };
  }, []);

  // ── Auto Monthly Backup Logic ──
  useEffect(() => {
    if (!autoBackupEnabled) return;
    const thisMonth = currentMonthKey();
    // If this month's backup not done yet → auto download
    if (lastBackupMonth !== thisMonth) {
      // Small delay so page loads first
      const timer = setTimeout(() => {
        const data = collectAllData();
        const filename = `ritech_auto_backup_${thisMonth}.json`;
        downloadJSON(data, filename);
        setLastBackupMonth(thisMonth);
        setBackupHistory(prev => {
          const list = prev as string[];
          const updated = [thisMonth, ...list.filter(m => m !== thisMonth)].slice(0, 12);
          return updated;
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoBackupEnabled]);

  const handleSave = () => {
    setSettings(draftSettings);
    // Apply theme & language immediately
    document.documentElement.setAttribute("data-theme", draftSettings.theme || "cyan");
    document.documentElement.lang = draftSettings.language || "en";
    // Fire custom event so ThemeProvider picks it up across components
    window.dispatchEvent(new Event("ritech_settings_changed"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Manual export — named with date
  const handleExport = () => {
    const data = collectAllData();
    const today = new Date().toISOString().slice(0, 10);
    downloadJSON(data, `ritech_backup_${today}.json`);
    // Record manual backup
    const thisMonth = currentMonthKey();
    setLastBackupMonth(thisMonth);
    setBackupHistory(prev => {
      const list = prev as string[];
      return [thisMonth, ...list.filter(m => m !== thisMonth)].slice(0, 12);
    });
  };

  // Force this-month backup now
  const handleBackupNow = () => {
    const data = collectAllData();
    const thisMonth = currentMonthKey();
    downloadJSON(data, `ritech_backup_${thisMonth}.json`);
    setLastBackupMonth(thisMonth);
    setBackupHistory(prev => {
      const list = prev as string[];
      return [thisMonth, ...list.filter(m => m !== thisMonth)].slice(0, 12);
    });
  };

  // Import data from JSON — auto-reload after import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null) localStorage.setItem(key, JSON.stringify(value));
        });
        window.location.reload();
      } catch {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (!loaded) return <div className="flex h-full items-center justify-center">Loading...</div>;

  const thisMonth = currentMonthKey();
  const isBackedUpThisMonth = lastBackupMonth === thisMonth;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl lg:text-3xl font-bold text-white">⚙️ Settings</h1>

      {/* Auto Backup Status Banner */}
      <div className={`rounded-2xl p-4 flex items-center justify-between border ${
        isBackedUpThisMonth
          ? "bg-[#1a2e1a] border-green-900/50"
          : "bg-[#2e1a00] border-orange-900/50"
      }`}>
        <div className="flex items-center gap-3">
          <Shield size={20} className={isBackedUpThisMonth ? "text-[var(--success)]" : "text-[var(--warning)]"} />
          <div>
            <p className={`font-bold text-sm ${isBackedUpThisMonth ? "text-[var(--success)]" : "text-[var(--warning)]"}`}>
              {isBackedUpThisMonth ? `✅ ${thisMonth} चा backup झाला आहे` : `⚠️ ${thisMonth} चा backup अजून झाला नाही`}
            </p>
            <p className="text-xs text-gray-400">
              {isBackedUpThisMonth
                ? "तुमचा data safe आहे."
                : "आत्ता backup घ्या — data safe राहील."}
            </p>
          </div>
        </div>
        {!isBackedUpThisMonth && (
          <button onClick={handleBackupNow}
            className="flex items-center gap-2 bg-[var(--warning)] text-black font-bold text-xs py-2 px-4 rounded-xl hover:opacity-90">
            <Download size={14} /> Backup Now
          </button>
        )}
      </div>

      {/* Studio Settings */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--accent)]">🏪 Studio Information</h2>

        {([
          ["studio_name", "Studio Name", "text", "Ritesh Tattoo Studio"],
          ["address", "Address", "text", "City, State"],
          ["phone", "Phone Number", "tel", "10-digit number"],
          ["gstin", "GSTIN (optional)", "text", "GST number"],
          ["invoice_footer", "Invoice Footer Message", "text", "Thank you for visiting!"],
          ["default_discount", "Default Discount (₹)", "number", "0"],
        ] as [keyof Settings, string, string, string][]).map(([key, label, type, placeholder]) => (
          <div key={key} className="space-y-1">
            <label className="text-sm text-gray-400">{label}</label>
            <input type={type} placeholder={placeholder}
              value={(draftSettings as unknown as Record<string, string>)[key] || ""}
              onChange={e => setDraftSettings({ ...draftSettings, [key]: e.target.value })}
              className="w-full bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        ))}

        <div className="space-y-1">
          <label className="text-sm text-gray-400">Default Payment Mode</label>
          <select value={draftSettings.default_payment_mode || "Cash"}
            onChange={e => setDraftSettings({ ...draftSettings, default_payment_mode: e.target.value })}
            className="w-full bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]">
            {["Cash", "UPI", "Card", "Online Transfer"].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <button onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-[var(--accent)] text-black font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity">
          <Save size={18} /> {saved ? "✅ Saved!" : "Save Settings"}
        </button>
      </div>

      {/* Theme Settings */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Palette size={20} className="text-[var(--accent)]" /> Theme Customization
        </h2>
        <p className="text-sm text-gray-400">
          Select a color theme for the application. Changes will apply immediately.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { id: "cyan", name: "Cyan", color: "#00FFE1" },
            { id: "emerald", name: "Emerald", color: "#10b981" },
            { id: "rose", name: "Rose", color: "#f43f5e" },
            { id: "amber", name: "Amber", color: "#f59e0b" },
            { id: "violet", name: "Violet", color: "#8b5cf6" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                const newTheme = t.id;
                setDraftSettings({ ...draftSettings, theme: newTheme });
                document.documentElement.setAttribute("data-theme", newTheme);
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                (draftSettings.theme || "cyan") === t.id
                  ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                  : "border-[var(--panel-border)] bg-[#1a1a2e] hover:border-gray-500"
              }`}
            >
              <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: t.color }}></div>
              <span className="text-xs font-semibold text-white">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Globe size={20} className="text-[var(--accent)]" /> Language Setting
        </h2>
        <p className="text-sm text-gray-400">
          Select your preferred language.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { id: "en", name: "English" },
            { id: "mr", name: "मराठी" },
            { id: "hi", name: "हिन्दी" },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                const newLang = lang.id;
                setDraftSettings({ ...draftSettings, language: newLang });
                document.documentElement.lang = newLang;
              }}
              className={`px-3 py-3 rounded-xl text-sm font-medium transition-all border ${
                (draftSettings.language || "en") === lang.id
                  ? "bg-[var(--accent-muted)] border-[var(--accent)] text-[var(--accent)]"
                  : "bg-[#1a1a2e] border-[var(--panel-border)] text-gray-400 hover:border-gray-500"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {(draftSettings.language || "en") === lang.id && <Check size={16} />}
                {lang.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Auto Backup Settings */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock size={20} className="text-[var(--accent)]" /> Auto Monthly Backup
        </h2>
        <p className="text-sm text-gray-400">
          दर महिन्याच्या पहिल्या login ला automatically backup file download होते.
          File तुमच्या PC च्या Downloads folder मध्ये जाते.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-between bg-[#1a1a2e] rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-medium text-white">Auto Monthly Backup</p>
            <p className="text-xs text-gray-500">दर महिन्याला auto download</p>
          </div>
          <button
            onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${autoBackupEnabled ? "bg-[var(--accent)]" : "bg-gray-600"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoBackupEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>

        {/* Backup History */}
        {(backupHistory as string[]).length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Backup History</p>
            <div className="space-y-1">
              {(backupHistory as string[]).map(month => (
                <div key={month} className="flex items-center justify-between bg-[#1a2e1a] border border-green-900/30 rounded-xl px-4 py-2">
                  <span className="text-sm text-[var(--success)]">✅ {month}</span>
                  <span className="text-xs text-gray-500">Backed up</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manual Backup & Restore */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">💾 Manual Backup & Restore</h2>
        <p className="text-sm text-gray-400">
          Manual export करा किंवा जुन्या backup file वरून restore करा.
        </p>

        <div className="flex flex-wrap gap-4">
          <button onClick={handleExport}
            className="flex items-center gap-2 bg-[var(--success)] text-black font-bold py-2 px-5 rounded-xl hover:opacity-90">
            <Download size={18} /> Export Backup
          </button>

          <label className="flex items-center gap-2 bg-[#1f2937] border border-[var(--panel-border)] text-white font-bold py-2 px-5 rounded-xl hover:bg-[#374151] cursor-pointer">
            <Upload size={18} /> Import Backup
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      </div>

      {/* Danger Zone moved to Admin Panel (Settings > Admin) */}
      <div className="bg-[#1a1a2e] border border-[var(--panel-border)] rounded-2xl p-5">
        <p className="text-gray-500 text-sm text-center">
          🔐 Data delete करायचं असेल तर <strong className="text-[var(--accent)]">Admin Panel</strong> वापरा
        </p>
      </div>
    </div>
  );
}
