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
  X
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Simple auth check
  useEffect(() => {
    const auth = window.localStorage.getItem("ritech_auth");
    if (!auth) {
      router.push("/");
    }
  }, [router]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Invoice", href: "/dashboard/invoice", icon: FileText },
    { name: "Invoice History", href: "/dashboard/invoice-history", icon: History },
    { name: "Expenses", href: "/dashboard/expenses", icon: IndianRupee },
    { name: "Expense History", href: "/dashboard/expense-history", icon: History },
    { name: "Revenue", href: "/dashboard/revenue", icon: LineChart },
    { name: "Notes & Tasks", href: "/dashboard/notes", icon: ClipboardList },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      window.localStorage.removeItem("ritech_auth");
      router.push("/");
    }
  };

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-[var(--panel)] rounded-lg text-[var(--accent)]"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#1e1e2f] border-r border-[var(--panel-border)] flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-center border-b border-[var(--panel-border)]">
          <h2 className="text-xl font-bold text-[var(--accent)] flex items-center gap-2">
            <span className="text-2xl">🧿</span> RiTech Tatto's
          </h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? "bg-[var(--accent-muted)] text-[var(--accent)] font-semibold" 
                        : "text-gray-400 hover:bg-[#2a2a3b] hover:text-white"
                    }`}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[var(--panel-border)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:bg-[#2a2a3b] hover:text-[var(--error)] rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--background)] relative">
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
