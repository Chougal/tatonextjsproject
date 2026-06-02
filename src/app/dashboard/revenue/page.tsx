"use client";

import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, BarChart, Bar
} from "recharts";

interface Invoice { id: string; customer: string; service: string; final: number; date: string; }
interface Expense { id: string; description: string; amount: number; date: string; category: string; }

function getMonthKey(dateStr: string) {
  return dateStr ? dateStr.substring(0, 7) : "";
}

export default function RevenuePage() {
  const [invoices, , invoicesLoaded] = useLocalStorage<Invoice[]>("ritech_invoices", []);
  const [expenses, , expensesLoaded] = useLocalStorage<Expense[]>("ritech_expenses", []);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Monthly chart data (last 12 months always shown)
  const monthlyData = useMemo(() => {
    const map: Record<string, { name: string; revenue: number; expenses: number }> = {};
    invoices.forEach(inv => {
      const key = getMonthKey(inv.date?.split("T")[0] || "");
      if (!key) return;
      if (!map[key]) map[key] = { name: key, revenue: 0, expenses: 0 };
      map[key].revenue += inv.final || 0;
    });
    expenses.forEach(exp => {
      const key = getMonthKey(exp.date || "");
      if (!key) return;
      if (!map[key]) map[key] = { name: key, revenue: 0, expenses: 0 };
      map[key].expenses += exp.amount || 0;
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name)).slice(-12);
  }, [invoices, expenses]);

  // Filtered report
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const d = inv.date?.split("T")[0] || "";
      return (!fromDate || d >= fromDate) && (!toDate || d <= toDate);
    });
  }, [invoices, fromDate, toDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const d = exp.date || "";
      return (!fromDate || d >= fromDate) && (!toDate || d <= toDate);
    });
  }, [expenses, fromDate, toDate]);

  const totalIncome = filteredInvoices.reduce((s, i) => s + (i.final || 0), 0);
  const totalExp = filteredExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const profit = totalIncome - totalExp;

  // Monthly history (all months with data)
  const monthlyHistory = useMemo(() => {
    return [...monthlyData].map(m => ({
      ...m,
      profit: m.revenue - m.expenses,
    })).reverse();
  }, [monthlyData]);

  // Service breakdown
  const serviceBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredInvoices.forEach(inv => {
      if (!map[inv.service]) map[inv.service] = 0;
      map[inv.service] += inv.final || 0;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredInvoices]);

  if (!invoicesLoaded || !expensesLoaded) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-[var(--success)]">📈 Revenue & Profit Report</h1>

      {/* Date Filter */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-5 flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <label className="text-xs text-gray-400">From Date</label>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">To Date</label>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <button onClick={() => { setFromDate(""); setToDate(""); }}
          className="border border-[var(--panel-border)] text-gray-400 px-4 py-2 rounded-xl hover:bg-[#2a2a3b] text-sm">
          Clear Filters
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-5 text-center">
          <p className="text-gray-400 mb-2">💰 Total Revenue</p>
          <p className="text-2xl font-bold text-[var(--success)]">₹ {totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-500 mt-1">{filteredInvoices.length} invoices</p>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-5 text-center">
          <p className="text-gray-400 mb-2">💸 Total Expenses</p>
          <p className="text-2xl font-bold text-[var(--error)]">₹ {totalExp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-500 mt-1">{filteredExpenses.length} expenses</p>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-5 text-center">
          <p className="text-gray-400 mb-2">📈 Net Profit</p>
          <p className={`text-2xl font-bold ${profit >= 0 ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
            ₹ {Math.abs(profit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            {profit < 0 && " (Loss)"}
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4">Monthly Revenue vs Expenses (Last 12 Months)</h2>
        {monthlyData.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9ca3af" tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#fff" }}
                  formatter={(v) => [`₹ ${Number(v).toLocaleString("en-IN")}`, undefined]}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#00FF99" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#FF5555" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center text-gray-500">No data available.</div>
        )}
      </div>

      {/* Service Breakdown Bar Chart */}
      {serviceBreakdown.length > 0 && (
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4">Revenue by Service</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceBreakdown} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9ca3af" tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#fff" }}
                  formatter={(v) => [`₹ ${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Bar dataKey="value" name="Revenue" fill="#00b3ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Monthly History Table */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl overflow-x-auto">
        <div className="px-6 py-4 border-b border-[var(--panel-border)]">
          <h2 className="font-bold text-white">📅 Monthly Profit / Loss History</h2>
        </div>
        {monthlyHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No data found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a2e]">
                {["Month", "Revenue", "Expenses", "Profit / Loss"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[var(--warning)] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyHistory.map(m => (
                <tr key={m.name} className="border-t border-[var(--panel-border)] hover:bg-[#2a2a3b]">
                  <td className="px-4 py-3 text-white font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-[var(--success)]">₹ {m.revenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-[var(--error)]">₹ {m.expenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className={`px-4 py-3 font-bold ${m.profit >= 0 ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
                    ₹ {m.profit.toLocaleString("en-IN", { minimumFractionDigits: 2 })} {m.profit < 0 ? "(Loss)" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
