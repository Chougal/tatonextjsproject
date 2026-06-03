"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Unlock } from "lucide-react";

function isExpired(): boolean {
  if (typeof window === "undefined") return false;
  const expiry = localStorage.getItem("ritech_expiry_date");
  if (!expiry) return false; // No expiry set = unlimited
  return new Date() > new Date(expiry);
}

export default function LoginScreen() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  // Check expiry on mount
  useEffect(() => {
    if (isExpired()) {
      router.replace("/maintenance");
    }
  }, [router]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Double-check expiry at login time
    if (isExpired()) {
      router.replace("/maintenance");
      return;
    }

    if (pin === "8085") {
      setError(false);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("ritech_auth", "true");
      }
      router.push("/dashboard");
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        {/* Logo */}
        <div className="w-24 h-24 bg-[#0a0f2c] rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-[var(--accent-muted)]">
          <span className="text-4xl">🧿</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          Ritesh Tattoo Studio
        </h1>
        <p className="text-[var(--foreground)] opacity-80 mb-8 text-center">
          Welcome! Please Enter PIN
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
          <div className="relative w-full max-w-[250px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(false);
              }}
              className={`w-full bg-[#1a1a2e] text-white text-center text-2xl tracking-[0.5em] py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                error
                  ? "border-[var(--error)] focus:border-[var(--error)]"
                  : "border-[var(--panel-border)] focus:border-[var(--accent)]"
              }`}
              placeholder="****"
              maxLength={4}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-[var(--error)] text-sm mt-3 font-medium">
              ❌ Incorrect PIN. Try again.
            </p>
          )}

          <button
            type="submit"
            className="mt-8 bg-gradient-to-r from-[#00FFE1] to-[#00b3ff] text-black font-bold py-3 px-8 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,255,225,0.3)]"
          >
            <Unlock className="w-5 h-5" />
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
