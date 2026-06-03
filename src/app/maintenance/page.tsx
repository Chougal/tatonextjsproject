"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MaintenancePage() {
  const router = useRouter();
  const [expiryDate, setExpiryDate] = useState("");
  const [daysExpired, setDaysExpired] = useState(0);

  useEffect(() => {
    const exp = localStorage.getItem("ritech_expiry_date") || "";
    setExpiryDate(exp);
    if (exp) {
      const diff = new Date().getTime() - new Date(exp).getTime();
      setDaysExpired(Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-[#1e1e2f] border border-[#3a3a4b] rounded-3xl p-8 text-center space-y-6 shadow-2xl">

          {/* Icon */}
          <div className="w-24 h-24 mx-auto bg-[#0a0f2c] rounded-full flex items-center justify-center border-2 border-[#3a3a4b]">
            <span className="text-5xl">🔧</span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">
              Application Under Maintenance
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00FFE1] to-[#00b3ff] mx-auto rounded-full" />
          </div>

          {/* Message */}
          <div className="bg-[#2a2a3b] rounded-2xl p-5 space-y-3 text-left">
            <p className="text-gray-300 text-sm leading-relaxed">
              This application is currently undergoing scheduled maintenance and upgrades
              to serve you better.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              We apologize for any inconvenience caused. Please contact the service
              provider to restore access.
            </p>
          </div>

          {/* Expiry Info */}
          {expiryDate && (
            <div className="bg-[#1a1a2e] border border-[#3a3a4b] rounded-xl p-4 space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Service Period Ended</p>
              <p className="text-white font-bold">{expiryDate}</p>
              {daysExpired > 0 && (
                <p className="text-xs text-gray-500">{daysExpired} days ago</p>
              )}
            </div>
          )}

          {/* Contact */}
          <div className="bg-gradient-to-br from-[#1a2e2e] to-[#1a1a2e] border border-[#2a3a3a] rounded-2xl p-5 space-y-3">
            <p className="text-[#00FFE1] font-bold text-sm">📞 Contact Service Provider</p>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                <span>💬</span>
                <span>WhatsApp / Call</span>
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
          </div>

          {/* Footer */}
          <p className="text-gray-600 text-xs">
            Powered by <span className="text-[#00FFE1]">RiTech Solutions</span>
          </p>
        </div>

        {/* Admin back door — hidden, only accessible via URL */}
        <button
          onClick={() => router.push("/")}
          className="mt-4 w-full text-center text-gray-800 text-xs py-2 hover:text-gray-600 transition-colors select-none"
          aria-hidden="true"
        >
          · · ·
        </button>
      </div>
    </div>
  );
}
