"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Lock, Calendar, AlertTriangle, CheckCircle2, Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "abhishek3364";
const EXPIRY_KEY = "ritech_expiry_date";
const ADMIN_AUTH_KEY = "ritech_admin_session";

function getExpiryDate(): string {
  return typeof window !== "undefined" ? localStorage.getItem(EXPIRY_KEY) || "" : "";
}

function setExpiryDate(date: string) {
  localStorage.setItem(EXPIRY_KEY, date);
}

function getDaysLeft(expiryDate: string): number {
  if (!expiryDate) return -1;
  const now = new Date();
  const exp = new Date(expiryDate);
  const diff = exp.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AdminPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [expiryDate, setExpiry] = useState("");
  const [currentExpiry, setCurrentExpiry] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [customMonths, setCustomMonths] = useState("");

  useEffect(() => {
    // Check if admin already unlocked this session
    const session = sessionStorage.getItem(ADMIN_AUTH_KEY);
    if (session === "true") setIsUnlocked(true);
    setCurrentExpiry(getExpiryDate());
  }, []);

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      setCurrentExpiry(getExpiryDate());
      setError("");
    } else {
      setError("❌ चुकीचा password");
      setPassword("");
    }
  };

  const handleSetExpiry = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    const iso = date.toISOString().split("T")[0];
    setExpiryDate(iso);
    setCurrentExpiry(iso);
    setSaveMsg(`✅ ${months} महिन्यांसाठी set झाले (${iso} पर्यंत)`);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleCustomExpiry = () => {
    if (!expiryDate) { setError("कृपया date निवडा"); return; }
    setExpiryDate(expiryDate);
    setCurrentExpiry(expiryDate);
    setSaveMsg(`✅ ${expiryDate} पर्यंत set झाले`);
    setTimeout(() => setSaveMsg(""), 3000);
    setError("");
  };

  const handleCustomMonths = () => {
    const m = parseInt(customMonths);
    if (!m || m <= 0 || m > 600) { setError("1 ते 600 महिने टाका"); return; }
    handleSetExpiry(m);
    setCustomMonths("");
    setError("");
  };

  const handleRemoveExpiry = () => {
    if (!confirm("Expiry date पूर्णपणे काढायची का? App कायमचं चालेल.")) return;
    localStorage.removeItem(EXPIRY_KEY);
    setCurrentExpiry("");
    setSaveMsg("✅ Expiry date काढली — app unlimited चालेल");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const daysLeft = getDaysLeft(currentExpiry);

  // ── Lock Screen ──
  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-8 w-full max-w-sm space-y-5">
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
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleUnlock()}
              className="w-full bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[var(--accent)] text-center tracking-widest"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-[var(--error)] text-sm text-center">{error}</p>}

          <button
            onClick={handleUnlock}
            className="w-full bg-gradient-to-r from-[var(--accent)] to-[#00b3ff] text-black font-bold py-3 rounded-xl hover:opacity-90"
          >
            Unlock Admin
          </button>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ──
  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <ShieldCheck size={28} className="text-[var(--accent)]" />
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
      </div>

      {/* Current Status */}
      <div className={`rounded-2xl p-5 border ${
        !currentExpiry
          ? "bg-[#1a1a2e] border-blue-900/50"
          : daysLeft > 30
          ? "bg-[#1a2e1a] border-green-900/50"
          : daysLeft > 7
          ? "bg-[#2e2a00] border-yellow-900/50"
          : daysLeft > 0
          ? "bg-[#2e1a00] border-orange-900/50"
          : "bg-[#2e1a1a] border-red-900/50"
      }`}>
        <div className="flex items-start gap-3">
          {!currentExpiry ? (
            <CheckCircle2 size={22} className="text-[#60a5fa] mt-0.5" />
          ) : daysLeft > 7 ? (
            <CheckCircle2 size={22} className="text-[var(--success)] mt-0.5" />
          ) : (
            <AlertTriangle size={22} className="text-[var(--warning)] mt-0.5" />
          )}
          <div>
            <p className="font-bold text-white text-sm">App Status</p>
            {!currentExpiry ? (
              <p className="text-[#60a5fa] text-sm mt-1">♾️ Unlimited — Expiry नाही</p>
            ) : daysLeft > 0 ? (
              <>
                <p className="text-sm mt-1">
                  <span className={daysLeft > 30 ? "text-[var(--success)]" : "text-[var(--warning)]"}>
                    ✅ {daysLeft} दिवस बाकी
                  </span>
                </p>
                <p className="text-gray-400 text-xs mt-0.5">Expiry: {currentExpiry}</p>
              </>
            ) : (
              <p className="text-[var(--error)] text-sm mt-1">❌ Expired — {currentExpiry} ला संपले</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Set Buttons */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-[var(--accent)] flex items-center gap-2">
          <Calendar size={18} /> Expiry Date Set करा
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "1 महिना", months: 1 },
            { label: "3 महिने", months: 3 },
            { label: "6 महिने", months: 6 },
            { label: "1 वर्ष", months: 12 },
            { label: "2 वर्षे", months: 24 },
            { label: "5 वर्षे", months: 60 },
            { label: "10 वर्षे", months: 120 },
          ].map(opt => (
            <button
              key={opt.months}
              onClick={() => handleSetExpiry(opt.months)}
              className="bg-[#1a1a2e] hover:bg-[var(--accent-muted)] border border-[var(--panel-border)] hover:border-[var(--accent)] text-white text-sm font-medium py-2.5 rounded-xl transition-all"
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom Months */}
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Custom महिने (e.g. 18)"
            value={customMonths}
            onChange={e => setCustomMonths(e.target.value)}
            min="1" max="600"
            className="flex-1 bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
          />
          <button
            onClick={handleCustomMonths}
            className="bg-[var(--accent)] text-black font-bold px-4 py-2 rounded-xl text-sm hover:opacity-90"
          >
            Set
          </button>
        </div>

        {/* Custom Date Picker */}
        <div className="border-t border-[var(--panel-border)] pt-4 space-y-2">
          <p className="text-xs text-gray-400">किंवा specific date निवडा:</p>
          <div className="flex gap-2">
            <input
              type="date"
              value={expiryDate}
              onChange={e => setExpiry(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="flex-1 bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              onClick={handleCustomExpiry}
              className="bg-[#1d4ed8] hover:bg-[#2563eb] text-white font-bold px-4 py-2 rounded-xl text-sm"
            >
              Set Date
            </button>
          </div>
        </div>

        {error && <p className="text-[var(--error)] text-sm">{error}</p>}
        {saveMsg && <p className="text-[var(--success)] text-sm font-medium">{saveMsg}</p>}
      </div>

      {/* Remove Expiry */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-white font-medium text-sm">Expiry काढा (Unlimited)</p>
          <p className="text-gray-500 text-xs mt-0.5">App कायमचं चालेल, कोणतीही expiry नाही</p>
        </div>
        <button
          onClick={handleRemoveExpiry}
          className="border border-[var(--panel-border)] text-gray-400 hover:text-white hover:border-white px-4 py-2 rounded-xl text-sm transition-colors"
        >
          Remove Expiry
        </button>
      </div>

      {/* Lock Admin */}
      <button
        onClick={() => { sessionStorage.removeItem(ADMIN_AUTH_KEY); setIsUnlocked(false); setPassword(""); }}
        className="w-full flex items-center justify-center gap-2 border border-[var(--panel-border)] text-gray-400 hover:text-[var(--error)] hover:border-[var(--error)] py-3 rounded-2xl transition-colors text-sm"
      >
        <Lock size={16} /> Admin Lock करा
      </button>
    </div>
  );
}
