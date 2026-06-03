"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  History,
  IndianRupee,
  LineChart,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // default closed on mobile

  useEffect(() => {
    const auth = window.localStorage.getItem("ritech_auth");
    if (!auth) { router.push("/"); return; }
    // Check expiry
    const expiry = window.localStorage.getItem("ritech_expiry_date");
    if (expiry && new Date() > new Date(expiry)) {
      window.localStorage.removeItem("ritech_auth");
      router.replace("/maintenance");
    }
  }, [router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Dashboard",       href: "/dashboard",               icon: LayoutDashboard },
    { name: "Customers",       href: "/dashboard/customers",      icon: Users },
    { name: "Invoice",         href: "/dashboard/invoice",        icon: FileText },
    { name: "Invoice History", href: "/dashboard/invoice-history",icon: History },
    { name: "Expenses",        href: "/dashboard/expenses",       icon: IndianRupee },
    { name: "Expense History", href: "/dashboard/expense-history",icon: History },
    { name: "Revenue",         href: "/dashboard/revenue",        icon: LineChart },
    { name: "Investment",      href: "/dashboard/investment",     icon: TrendingUp },
    { name: "Notes & Tasks",   href: "/dashboard/notes",          icon: ClipboardList },
    { name: "Settings",        href: "/dashboard/settings",       icon: Settings },
    { name: "Admin",           href: "/dashboard/admin",          icon: ShieldCheck },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      window.localStorage.removeItem("ritech_auth");
      router.push("/");
    }
  };

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">

      {/* ── Overlay (mobile) ── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#1e1e2f] border-r border-[var(--panel-border)] flex flex-col transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="p-5 flex items-center justify-between border-b border-[var(--panel-border)]">
          <h2 className="text-lg font-bold text-[var(--accent)] flex items-center gap-2">
            <span className="text-2xl">🧿</span> Ritesh Tattoo's
          </h2>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isAdmin = item.href === "/dashboard/admin";
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 text-sm
                      ${isAdmin
                        ? isActive
                          ? "bg-purple-900/40 text-purple-300 font-semibold"
                          : "text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
                        : isActive
                          ? "bg-[var(--accent-muted)] text-[var(--accent)] font-semibold"
                          : "text-gray-400 hover:bg-[#2a2a3b] hover:text-white"}`}
                  >
                    <item.icon size={18} />
                    {item.name}
                    {isAdmin && <span className="ml-auto text-[10px] bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded-full">🔐</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[var(--panel-border)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-400 hover:bg-[#2a2a3b] hover:text-[var(--error)] rounded-xl transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--background)]">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-[var(--panel-border)] bg-[#1e1e2f]">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 rounded-lg text-[var(--accent)] hover:bg-[var(--accent-muted)]"
          >
            <Menu size={22} />
          </button>
          <span className="font-bold text-[var(--accent)]">🧿 Ritesh Tattoo&apos;s</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
