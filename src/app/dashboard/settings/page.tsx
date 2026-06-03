"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Save, Download, Upload, Trash2 } from "lucide-react";

interface Settings {
  studio_name: string;
  address: string;
  phone: string;
  gstin: string;
  invoice_footer: string;
  default_discount: string;
  default_payment_mode: string;
}

const DEFAULT_SETTINGS: Settings = {
  studio_name: "RiTech Tattoo Studio",
  address: "Kolhapur",
  phone: "9876543210",
  gstin: "",
  invoice_footer: "Thank you for visiting!",
  default_discount: "0",
  default_payment_mode: "Cash",
};

export default function SettingsPage() {
  const [settings, setSettings, loaded] = useLocalStorage<Settings>("ritech_settings", DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Export all data as JSON
  const handleExport = () => {
    const keys = ["ritech_invoices", "ritech_expenses", "ritech_customers", "ritech_notes", "ritech_settings"];
    const data: Record<string, unknown> = {};
    keys.forEach(k => {
      try { data[k] = JSON.parse(localStorage.getItem(k) || "null"); } catch { data[k] = null; }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ritech_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import data from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null) localStorage.setItem(key, JSON.stringify(value));
        });
        alert("Data imported successfully! Please refresh the page.");
      } catch {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Clear all data
  const handleClearAll = () => {
    if (!confirm("⚠️ This will permanently delete ALL data (invoices, expenses, customers, notes, investments). Are you sure?")) return;
    if (!confirm("Last chance — confirm permanent delete?")) return;
    [
      "ritech_invoices",
      "ritech_expenses",
      "ritech_customers",
      "ritech_notes",
      "ritech_investments"
    ].forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  if (!loaded) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl lg:text-3xl font-bold text-white">⚙️ Settings</h1>

      {/* Studio Settings */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--accent)]">🏪 Studio Information</h2>

        {([
          ["studio_name", "Studio Name", "text", "RiTech Tattoo Studio"],
          ["address", "Address", "text", "City, State"],
          ["phone", "Phone Number", "tel", "10-digit number"],
          ["gstin", "GSTIN (optional)", "text", "GST number"],
          ["invoice_footer", "Invoice Footer Message", "text", "Thank you for visiting!"],
          ["default_discount", "Default Discount (₹)", "number", "0"],
        ] as [keyof Settings, string, string, string][]).map(([key, label, type, placeholder]) => (
          <div key={key} className="space-y-1">
            <label className="text-sm text-gray-400">{label}</label>
            <input type={type} placeholder={placeholder}
              value={(settings as unknown as Record<string, string>)[key] || ""}
              onChange={e => setSettings({ ...settings, [key]: e.target.value })}
              className="w-full bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        ))}

        <div className="space-y-1">
          <label className="text-sm text-gray-400">Default Payment Mode</label>
          <select value={settings.default_payment_mode || "Cash"}
            onChange={e => setSettings({ ...settings, default_payment_mode: e.target.value })}
            className="w-full bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]">
            {["Cash", "UPI", "Card", "Online Transfer"].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <button onClick={handleSave}
          className="flex items-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[#00b3ff] text-black font-bold py-2 px-6 rounded-xl hover:opacity-90 transition-opacity">
          <Save size={18} /> {saved ? "✅ Saved!" : "Save Settings"}
        </button>
      </div>

      {/* Data Management */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">💾 Data Backup & Restore</h2>
        <p className="text-sm text-gray-400">Export your data as a JSON backup file, or restore from a previous backup.</p>

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

      {/* Danger Zone */}
      <div className="bg-[#2a1a1a] border border-red-900/50 rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-bold text-[var(--error)]">⚠️ Danger Zone</h2>
        <p className="text-sm text-gray-400">This will permanently delete all invoices, expenses, customers, notes and investments. This action cannot be undone.</p>
        <button onClick={handleClearAll}
          className="flex items-center gap-2 bg-[var(--error)] text-white font-bold py-2 px-5 rounded-xl hover:opacity-90">
          <Trash2 size={18} /> Clear All Data
        </button>
      </div>
    </div>
  );
}
