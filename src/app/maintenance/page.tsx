"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PASSWORD = "abhishek3364";
const EXPIRY_KEY = "ritech_expiry_date";

function setExpiryDate(date: string) {
  localStorage.setItem(EXPIRY_KEY, date);
}

function addMonths(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

export default function MaintenancePage() {
  const router = useRouter();
  const [expiryDate, setExpiry] = useState("");
  const [daysExpired, setDaysExpired] = useState(0);

  // Secret admin popup state
  const [tapCount, setTapCount] = useState(0);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [customMonths, setCustomMonths] = useState("");
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const exp = localStorage.getItem(EXPIRY_KEY) || "";
    setExpiry(exp);
    if (exp) {
      const diff = new Date().getTime() - new Date(exp).getTime();
      setDaysExpired(Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
  }, []);

  // 5 taps on the logo area → show admin popup
  const handleLogoTap = () => {
    const next = tapCount + 1;
    setTapCount(next);
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => setTapCount(0), 3000); // reset after 3s
    if (next >= 5) {
      setTapCount(0);
      setShowAdminPopup(true);
      setAdminPassword("");
      setAdminUnlocked(false);
      setAdminError("");
      setSaveMsg("");
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setAdminError("");
    } else {
      setAdminError("❌ चुकीचा password");
      setAdminPassword("");
    }
  };

  const handleSetExpiry = (months: number) => {
    const date = addMonths(months);
    setExpiryDate(date);
    setExpiry(date);
    setSaveMsg(`✅ ${months} महिन्यांसाठी set झाले — ${date} पर्यंत`);
  };

  const handleCustomMonths = () => {
    const m = parseInt(customMonths);
    if (!m || m <= 0) { setAdminError("महिने टाका"); return; }
    handleSetExpiry(m);
    setCustomMonths("");
    setAdminError("");
  };

  const handleCustomDate = () => {
    if (!newExpiry) { setAdminError("Date निवडा"); return; }
    setExpiryDate(newExpiry);
    setExpiry(newExpiry);
    setSaveMsg(`✅ ${newExpiry} पर्यंत set झाले`);
    setAdminError("");
  };

  const handleOpenApp = () => {
    setShowAdminPopup(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1e1e2f] border border-[#3a3a4b] rounded-3xl p-8 text-center space-y-6 shadow-2xl">

          {/* Icon — 5 taps to open admin */}
          <button
            onClick={handleLogoTap}
            className="w-24 h-24 mx-auto bg-[#0a0f2c] rounded-full flex items-center justify-center border-2 border-[#3a3a4b] select-none focus:outline-none"
            aria-label="Logo"
          >
            <span className="text-5xl">🔧</span>
          </button>

          {/* Tap hint — only shows when tapping */}
          {tapCount > 0 && tapCount < 5 && (
            <p className="text-gray-700 text-xs">
              {5 - tapCount} more tap{5 - tapCount !== 1 ? "s" : ""}...
            </p>
          )}

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Application Under Maintenance</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00FFE1] to-[#00b3ff] mx-auto rounded-full" />
          </div>

          <div className="bg-[#2a2a3b] rounded-2xl p-5 space-y-3 text-left">
            <p className="text-gray-300 text-sm leading-relaxed">
              This application is currently undergoing scheduled maintenance and upgrades to serve you better.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              We apologize for any inconvenience caused. Please contact the service provider to restore access.
            </p>
          </div>

          {expiryDate && (
            <div className="bg-[#1a1a2e] border border-[#3a3a4b] rounded-xl p-4 space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Service Period Ended</p>
              <p className="text-white font-bold">{expiryDate}</p>
              {daysExpired > 0 && <p className="text-xs text-gray-500">{daysExpired} days ago</p>}
            </div>
          )}

          <div className="bg-gradient-to-br from-[#1a2e2e] to-[#1a1a2e] border border-[#2a3a3a] rounded-2xl p-5 space-y-3">
            <p className="text-[#00FFE1] font-bold text-sm">📞 Contact Service Provider</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
              <span>💬</span><span>WhatsApp / Call</span>
            </div>
            <a
              href="https://wa.me/919146406454"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#25D366] hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition-opacity"
            >
              📱 Contact on WhatsApp
            </a>
          </div>

          <p className="text-gray-600 text-xs">
            Powered by <span className="text-[#00FFE1]">RiTech Solutions</span>
          </p>
        </div>
      </div>

      {/* ── Secret Admin Popup ── */}
      {showAdminPopup && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e2f] border border-[#3a3a4b] rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">

            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-white font-bold flex items-center gap-2">
                🔐 Admin Access
              </h2>
              <button
                onClick={() => setShowAdminPopup(false)}
                className="text-gray-500 hover:text-white text-xl leading-none"
              >×</button>
            </div>

            {!adminUnlocked ? (
              /* Password Entry */
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Admin Password टाका"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
                  autoFocus
                  className="w-full bg-[#1a1a2e] text-white border border-[#3a3a4b] rounded-xl px-4 py-3 text-center tracking-widest focus:outline-none focus:border-[#00FFE1]"
                />
                {adminError && <p className="text-red-400 text-sm text-center">{adminError}</p>}
                <button
                  onClick={handleAdminLogin}
                  className="w-full bg-gradient-to-r from-[#00FFE1] to-[#00b3ff] text-black font-bold py-3 rounded-xl hover:opacity-90"
                >
                  Unlock
                </button>
              </div>
            ) : (
              /* Admin Controls */
              <div className="space-y-4">
                {saveMsg && (
                  <div className="bg-[#1a2e1a] border border-green-900/50 rounded-xl px-4 py-3">
                    <p className="text-[#00FF99] text-sm font-medium">{saveMsg}</p>
                  </div>
                )}

                {/* Quick months */}
                <div>
                  <p className="text-gray-400 text-xs mb-2">⚡ Quick Set</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { l: "1 म", m: 1 }, { l: "3 म", m: 3 },
                      { l: "6 म", m: 6 }, { l: "1 व", m: 12 },
                      { l: "2 व", m: 24 }, { l: "5 व", m: 60 },
                      { l: "10 व", m: 120 }, { l: "∞", m: 0 },
                    ].map(opt => (
                      <button
                        key={opt.m}
                        onClick={() => {
                          if (opt.m === 0) {
                            localStorage.removeItem(EXPIRY_KEY);
                            setExpiry("");
                            setSaveMsg("✅ Unlimited set झाले");
                          } else {
                            handleSetExpiry(opt.m);
                          }
                        }}
                        className="bg-[#1a1a2e] hover:bg-[#2a2a3b] border border-[#3a3a4b] hover:border-[#00FFE1] text-white text-xs font-medium py-2 rounded-xl transition-all"
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom months */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Custom महिने"
                    value={customMonths}
                    onChange={e => setCustomMonths(e.target.value)}
                    min="1"
                    className="flex-1 bg-[#1a1a2e] text-white border border-[#3a3a4b] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#00FFE1]"
                  />
                  <button
                    onClick={handleCustomMonths}
                    className="bg-[#00FFE1] text-black font-bold px-4 py-2 rounded-xl text-sm hover:opacity-90"
                  >Set</button>
                </div>

                {/* Custom date */}
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={e => setNewExpiry(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="flex-1 bg-[#1a1a2e] text-white border border-[#3a3a4b] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#00FFE1]"
                  />
                  <button
                    onClick={handleCustomDate}
                    className="bg-[#1d4ed8] text-white font-bold px-4 py-2 rounded-xl text-sm hover:opacity-90"
                  >Set</button>
                </div>

                {adminError && <p className="text-red-400 text-sm">{adminError}</p>}

                {/* Open App button */}
                <button
                  onClick={handleOpenApp}
                  className="w-full bg-[#1a2e1a] border border-green-900/50 text-[#00FF99] font-bold py-3 rounded-xl text-sm hover:opacity-90"
                >
                  🚀 App उघडा
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
