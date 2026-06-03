"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Eye, EyeOff, Plus, Users, FileText, IndianRupee, PieChart, CheckCircle2, TrendingUp } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Investment { id: string; description: string; amount: number; date: string; }

export default function Dashboard() {
  const [showValues, setShowValues] = useState(false);

  const [invoices, , invoicesLoaded]     = useLocalStorage<any[]>("ritech_invoices", []);
  const [expenses, , expensesLoaded]     = useLocalStorage<any[]>("ritech_expenses", []);
  const [notes, setNotes, notesLoaded]   = useLocalStorage<any[]>("ritech_notes", []);
  const [investments, , investLoaded]    = useLocalStorage<Investment[]>("ritech_investments", []);

  const totalRevenue   = useMemo(() => invoices.reduce((s, i) => s + (Number(i.final) || 0), 0), [invoices]);
  const totalExpenses  = useMemo(() => expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0), [expenses]);
  const totalInvested  = useMemo(() => investments.reduce((s, i) => s + (Number(i.amount) || 0), 0), [investments]);
  const netProfit      = totalRevenue - totalExpenses;

  const chartData = useMemo(() => {
    const map: Record<string, { name: string; revenue: number; expenses: number }> = {};
    invoices.forEach(inv => {
      if (!inv.date) return;
      const key = (inv.date.split("T")[0] || inv.date.split(" ")[0]).substring(0, 7);
      if (!map[key]) map[key] = { name: key, revenue: 0, expenses: 0 };
      map[key].revenue += Number(inv.final) || 0;
    });
    expenses.forEach(exp => {
      if (!exp.date) return;
      const key = exp.date.substring(0, 7);
      if (!map[key]) map[key] = { name: key, revenue: 0, expenses: 0 };
      map[key].expenses += Number(exp.amount) || 0;
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name)).slice(-6);
  }, [invoices, expenses]);

  const fmt = (v: number) => showValues ? `₹ ${v.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹ ***";

  const pendingNotes      = notes.filter(n => n.status === "Pending");
  const highPriorityNotes = pendingNotes.filter(n => n.priority === "High");

  const completeNote = (id: string | number) =>
    setNotes(notes.map(n => n.id === id ? { ...n, status: "Completed", completed_date: new Date().toISOString() } : n));

  if (!invoicesLoaded || !expensesLoaded || !notesLoaded || !investLoaded) {
    return <div className="flex h-full items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">📊 Dashboard Overview</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left col ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* 4 Stat Cards */}
          <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-5 relative">
            <button
              onClick={() => setShowValues(!showValues)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              title="Toggle values"
            >
              {showValues ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
              <div className="bg-[#1a2e1a] border border-green-900/40 p-4 rounded-xl text-center">
                <p className="text-xs text-gray-400 mb-1">💰 Revenue</p>
                <p className="text-lg font-bold text-[var(--success)]">{fmt(totalRevenue)}</p>
              </div>
              <div className="bg-[#2e1a1a] border border-red-900/40 p-4 rounded-xl text-center">
                <p className="text-xs text-gray-400 mb-1">💸 Expenses</p>
                <p className="text-lg font-bold text-[var(--error)]">{fmt(totalExpenses)}</p>
              </div>
              <div className={`p-4 rounded-xl text-center border ${netProfit >= 0 ? "bg-[#1a2e1a] border-green-900/40" : "bg-[#2e1a1a] border-red-900/40"}`}>
                <p className="text-xs text-gray-400 mb-1">📈 Profit</p>
                <p className={`text-lg font-bold ${netProfit >= 0 ? "text-[var(--success)]" : "text-[var(--error)]"}`}>{fmt(netProfit)}</p>
              </div>
              <div className="bg-[#1a1a2e] border border-blue-900/40 p-4 rounded-xl text-center">
                <p className="text-xs text-gray-400 mb-1">💎 Investment</p>
                <p className="text-lg font-bold text-[#60a5fa]">{fmt(totalInvested)}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3">🚀 Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { href: "/dashboard/invoice",    icon: <Plus size={20} className="text-[var(--accent)]" />,    label: "New Invoice" },
                { href: "/dashboard/customers",  icon: <Users size={20} className="text-[#a78bfa]" />,         label: "Add Customer" },
                { href: "/dashboard/expenses",   icon: <IndianRupee size={20} className="text-[var(--error)]"/>,label: "Add Expense" },
                { href: "/dashboard/investment", icon: <TrendingUp size={20} className="text-[#60a5fa]" />,    label: "Investment" },
                { href: "/dashboard/revenue",    icon: <PieChart size={20} className="text-[var(--success)]"/>, label: "Reports" },
              ].map(a => (
                <Link key={a.href} href={a.href}
                  className="flex flex-col items-center gap-2 p-3 bg-[#1f2937] hover:bg-[#374151] rounded-xl border border-gray-700 transition-colors">
                  {a.icon}
                  <span className="text-xs font-medium text-center">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-5 h-[300px]">
            <h2 className="text-sm font-bold text-white mb-3">Monthly Revenue vs Expenses</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={chartData} margin={{ top: 5, right: 15, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#fff" }}
                    formatter={v => [`₹ ${Number(v).toLocaleString("en-IN")}`, undefined]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="revenue"  name="Revenue"  stroke="#00FF99" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#FF5555" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500 text-sm">No data yet.</div>
            )}
          </div>
        </div>

        {/* ── Right col: Notes ── */}
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-5 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-white">📝 Reminders</h2>
            <Link href="/dashboard/notes"
              className="text-xs bg-[var(--accent)] text-black px-3 py-1 rounded-full font-bold hover:opacity-80">
              + Add
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {highPriorityNotes.length > 0 && (
              <div>
                <p className="text-xs font-bold text-[var(--error)] mb-2 uppercase tracking-wider">🚨 High Priority</p>
                {highPriorityNotes.slice(0, 3).map(n => (
                  <div key={n.id} className="bg-[#3a1f1f] border border-red-900/40 p-3 rounded-xl mb-2">
                    <div className="flex justify-between">
                      <p className="font-bold text-[#ff8888] text-xs">🔴 {n.title}</p>
                      <button onClick={() => completeNote(n.id)} className="text-[var(--success)]"><CheckCircle2 size={14} /></button>
                    </div>
                    <p className="text-[10px] text-[#ffaaaa] mt-1 line-clamp-2">{n.content}</p>
                    {n.due_date && <p className="text-[10px] text-gray-500 mt-1">📅 {n.due_date}</p>}
                  </div>
                ))}
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-[var(--accent)] mb-2 uppercase tracking-wider">📋 Pending Tasks</p>
              {pendingNotes.length > 0 ? pendingNotes.slice(0, 6).map(n => (
                <div key={n.id} className="bg-[#1f2f3a] border border-[#2a3f4a] p-3 rounded-xl mb-2">
                  <div className="flex justify-between">
                    <p className={`font-bold text-xs ${n.priority === "High" ? "text-[var(--error)]" : n.priority === "Medium" ? "text-[var(--warning)]" : "text-[#60a5fa]"}`}>
                      {n.title}
                    </p>
                    <button onClick={() => completeNote(n.id)} className="text-[var(--success)]"><CheckCircle2 size={14} /></button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{n.content}</p>
                  <p className="text-[10px] text-gray-500 mt-1">🏷️ {n.category}</p>
                </div>
              )) : (
                <div className="text-center py-8 text-[var(--success)]">
                  <p className="text-2xl mb-1">🎉</p>
                  <p className="text-xs">No pending tasks!</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--panel-border)]">
            <div className="bg-[#1f3a2f] p-3 rounded-xl border border-green-900/30">
              <p className="text-[var(--success)] font-bold text-xs mb-1">💾 Backup</p>
              <p className="text-[10px] text-gray-400 mb-2">Export data regularly to keep it safe.</p>
              <Link href="/dashboard/settings"
                className="block text-center text-xs bg-[var(--panel)] text-white border border-[var(--panel-border)] py-1.5 rounded-lg hover:bg-[#3a3a4b]">
                Go to Backup
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
