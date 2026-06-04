"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Lock, Calendar, AlertTriangle, CheckCircle2, Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "abhishek3364";
const EXPIRY_KEY = "ritech_expiry_date";

function getExpiryDate(): string {
  return typeof window !== "undefined" ? localStorage.getItem(EXPIRY_KEY) || "" : "";
}

function setExpiryDateLS(date: string) {
  localStorage.setItem(EXPIRY_KEY, date);
}

function getDaysLeft(expiryDate: string): number {
  if (!expiryDate) return -1;
  const diff = new Date(expiryDate).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AdminPage() {
  // ✅ Always starts LOCKED — no sessionStorage, no persistence
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [expiryInput, setExpiryInput] = useState("");
  const [currentExpiry, setCurrentExpiry] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [customMonths, setCustomMonths] = useState("");

  useEffect(() => {
    // Load current expiry — but page always starts LOCKED
    setCurrentExpiry(getExpiryDate());
  }, []);

  // Lock when navigating away and coming back
  useEffect(() => {
    return () => {
      // On unmount → lock again
      setIsUnlocked(false);
      setPassword("");
    };
  }, []);

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      setCurrentExpiry(getExpiryDate());
      setError("");
    } else {
      setError("❌ चुकीचा password");
      setPassword("");
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPassword("");
    setError("");
    setSaveMsg("");
    setCustomMonths("");
  };

  const applyExpiry = (iso: string, label: string) => {
    setExpiryDateLS(iso);
    setCurrentExpiry(iso);
    setSaveMsg(`✅ ${label} — ${iso} पर्यंत set झाले`);
    setTimeout(() => setSaveMsg(""), 4000);
  };

  const handleSetMonths = (months: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    applyExpiry(d.toISOString().split("T")[0], `${months} महिने`);
  };

  const handleCustomMonths = () => {
    const m = parseInt(customMonths);
    if (!m || m <= 0 || m > 1200) { setError("1 ते 1200 महिने टाका"); return; }
    handleSetMonths(m);
    setCustomMonths("");
    setError("");
  };

  const handleCustomDate = () => {
    if (!expiryInput) { setError("कृपया date निवडा"); return; }
    applyExpiry(expiryInput, "Custom date");
    setError("");
  };

  const handleRemoveExpiry = () => {
    if (!confirm("Expiry date पूर्णपणे काढायची का? App कायमचं चालेल.")) return;
    localStorage.removeItem(EXPIRY_KEY);
    setCurrentExpiry("");
    setSaveMsg("✅ Expiry काढली — App unlimited चालेल");
    setTimeout(() => setSaveMsg(""), 4000);
  };

  const daysLeft = getDaysLeft(currentExpiry);

  // ── Lock Screen — ALWAYS shown on page open ──
  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-8 w-full max-w-sm space-y-5 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#1a1a2e] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[var(--accent)]">
              <Lock size={28} className="text-[var(--accent)]" />
            </div>
            <h2 className="text-xl font-bold text-white">🔐 Admin Panel</h2>
            <p className="text-gray-400 text-sm mt-1">Admin password टाका</p>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Admin Password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleUnlock()}
              className="w-full bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[var(--accent)] text-center tracking-widest"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-[var(--error)] text-sm text-center">{error}</p>}

          <button
            onClick={handleUnlock}
            className="w-full bg-gradient-to-r from-[var(--accent)] to-[#00b3ff] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Unlock Admin
          </button>
        </div>
      </div>
    );
  }

  // ── Admin Panel (unlocked) ──
  return (
    <div className="space-y-6 max-w-xl">

      {/* Header with Lock button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck size={26} className="text-[var(--accent)]" />
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        </div>
        <button
          onClick={handleLock}
          className="flex items-center gap-2 border border-[var(--panel-border)] text-gray-400 hover:text-[var(--error)] hover:border-[var(--error)] px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Lock size={14} /> Lock करा
        </button>
      </div>

      {/* Current Status */}
      <div className={`rounded-2xl p-5 border ${
        !currentExpiry
          ? "bg-[#1a1a2e] border-blue-900/50"
          : daysLeft > 30 ? "bg-[#1a2e1a] border-green-900/50"
          : daysLeft > 7  ? "bg-[#2e2a00] border-yellow-900/50"
          : daysLeft > 0  ? "bg-[#2e1a00] border-orange-900/50"
          : "bg-[#2e1a1a] border-red-900/50"
      }`}>
        <div className="flex items-start gap-3">
          {!currentExpiry || daysLeft > 7
            ? <CheckCircle2 size={22} className={!currentExpiry ? "text-[#60a5fa] mt-0.5" : "text-[var(--success)] mt-0.5"} />
            : <AlertTriangle size={22} className="text-[var(--warning)] mt-0.5" />
          }
          <div>
            <p className="font-bold text-white text-sm">App Status</p>
            {!currentExpiry
              ? <p className="text-[#60a5fa] text-sm mt-1">♾️ Unlimited — Expiry नाही</p>
              : daysLeft > 0
                ? <>
                    <p className={`text-sm mt-1 font-semibold ${daysLeft > 30 ? "text-[var(--success)]" : "text-[var(--warning)]"}`}>
                      ✅ {daysLeft} दिवस बाकी
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">Expiry: {currentExpiry}</p>
                  </>
                : <p className="text-[var(--error)] text-sm mt-1">❌ Expired — {currentExpiry} ला संपले</p>
            }
          </div>
        </div>
      </div>

      {/* Expiry Set */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-[var(--accent)] flex items-center gap-2">
          <Calendar size={18} /> Expiry Date Set करा
        </h2>

        {/* Quick buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "1 म",   months: 1   },
            { label: "3 म",   months: 3   },
            { label: "6 म",   months: 6   },
            { label: "1 व",   months: 12  },
            { label: "2 व",   months: 24  },
            { label: "5 व",   months: 60  },
            { label: "10 व",  months: 120 },
            { label: "20 व",  months: 240 },
          ].map(opt => (
            <button
              key={opt.months}
              onClick={() => handleSetMonths(opt.months)}
              className="bg-[#1a1a2e] hover:bg-[var(--accent-muted)] border border-[var(--panel-border)] hover:border-[var(--accent)] text-white text-sm font-medium py-2.5 rounded-xl transition-all"
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom months */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Custom महिने (e.g. 18)"
            value={customMonths}
            onChange={e => setCustomMonths(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCustomMonths()}
            min="1" max="1200"
            className="flex-1 bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
          />
          <button onClick={handleCustomMonths}
            className="bg-[var(--accent)] text-black font-bold px-4 py-2 rounded-xl text-sm hover:opacity-90">
            Set
          </button>
        </div>

        {/* Custom date */}
        <div className="border-t border-[var(--panel-border)] pt-4 space-y-2">
          <p className="text-xs text-gray-400">किंवा specific date निवडा:</p>
          <div className="flex gap-2">
            <input
              type="date"
              value={expiryInput}
              onChange={e => setExpiryInput(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="flex-1 bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
            />
            <button onClick={handleCustomDate}
              className="bg-[#1d4ed8] hover:bg-[#2563eb] text-white font-bold px-4 py-2 rounded-xl text-sm">
              Set Date
            </button>
          </div>
        </div>

        {error   && <p className="text-[var(--error)]   text-sm">{error}</p>}
        {saveMsg && <p className="text-[var(--success)] text-sm font-medium">{saveMsg}</p>}
      </div>

      {/* Remove expiry */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-white font-medium text-sm">Expiry काढा (Unlimited)</p>
          <p className="text-gray-500 text-xs mt-0.5">App कायमचं चालेल</p>
        </div>
        <button onClick={handleRemoveExpiry}
          className="border border-[var(--panel-border)] text-gray-400 hover:text-white hover:border-white px-4 py-2 rounded-xl text-sm transition-colors">
          Remove
        </button>
      </div>

      {/* ── Danger Zone ── */}
      <div className="bg-[#2a1a1a] border border-red-900/60 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-[var(--error)]">⚠️ Danger Zone</h2>
          <p className="text-gray-400 text-sm mt-1">
            हे सगळे invoices, expenses, customers, notes आणि investments <strong>कायमचे delete</strong> करेल.
            हे action undo होत नाही.
          </p>
        </div>
        <button
          onClick={() => {
            if (!confirm("⚠️ सगळा data permanently delete होईल.\nInvoices, Customers, Expenses, Notes, Investments — सगळं जाईल.\n\nSure आहात का?")) return;
            if (!confirm("Last chance — खरंच delete करायचं आहे का?\nHe undo होणार नाही.")) return;
            [
              "ritech_invoices",
              "ritech_expenses",
              "ritech_customers",
              "ritech_notes",
              "ritech_investments",
            ].forEach(k => localStorage.removeItem(k));
            window.location.reload();
          }}
          className="flex items-center gap-2 bg-[var(--error)] hover:opacity-90 text-white font-bold py-2.5 px-6 rounded-xl transition-opacity"
        >
          🗑️ Clear All Data
        </button>
      </div>

    </div>
  );
}
