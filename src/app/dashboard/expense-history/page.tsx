"use client";

import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Search, Trash2 } from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export default function ExpenseHistoryPage() {
  const [expenses, setExpenses, loaded] = useLocalStorage<Expense[]>("ritech_expenses", []);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmt, setMinAmt] = useState("");
  const [maxAmt, setMaxAmt] = useState("");

  const categories = useMemo(() => ["All", ...Array.from(new Set(expenses.map(e => e.category)))], [expenses]);

  const filtered = useMemo(() => {
    return expenses
      .filter(exp => {
        const searchMatch = !search ||
          exp.description.toLowerCase().includes(search.toLowerCase()) ||
          exp.category.toLowerCase().includes(search.toLowerCase());
        const catMatch = categoryFilter === "All" || exp.category === categoryFilter;
        const fromMatch = !fromDate || exp.date >= fromDate;
        const toMatch = !toDate || exp.date <= toDate;
        const minMatch = !minAmt || exp.amount >= parseFloat(minAmt);
        const maxMatch = !maxAmt || exp.amount <= parseFloat(maxAmt);
        return searchMatch && catMatch && fromMatch && toMatch && minMatch && maxMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, search, categoryFilter, fromDate, toDate, minAmt, maxAmt]);

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  const deleteExpense = (id: string) => {
    if (confirm("Delete this expense?")) setExpenses(prev => (prev as Expense[]).filter(e => e.id !== id));
  };

  if (!loaded) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-white">📜 Expense History</h1>

      {/* Filters */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} placeholder="From Date"
          className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
        />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} placeholder="To Date"
          className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
        />
        <input type="number" placeholder="Min ₹" value={minAmt} onChange={e => setMinAmt(e.target.value)} min="0"
          className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
        />
        <input type="number" placeholder="Max ₹" value={maxAmt} onChange={e => setMaxAmt(e.target.value)} min="0"
          className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl px-6 py-4">
        <span className="text-gray-400">{filtered.length} expense{filtered.length !== 1 ? "s" : ""} found</span>
        <span className="text-lg font-bold text-[var(--error)]">
          Total: ₹ {totalFiltered.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Table */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No expenses found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a2e]">
                {["S/N", "Description", "Amount ₹", "Date", "Category", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[var(--warning)] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp, i) => (
                <tr key={exp.id} className="border-t border-[var(--panel-border)] hover:bg-[#2a2a3b]">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 text-white">{exp.description}</td>
                  <td className="px-4 py-3 text-[var(--error)] font-medium">₹ {exp.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-400">{exp.date}</td>
                  <td className="px-4 py-3">
                    <span className="bg-[#2a2a3b] text-gray-300 px-2 py-1 rounded-lg text-xs">{exp.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteExpense(exp.id)} className="text-[var(--error)] hover:opacity-80">
                      <Trash2 size={16} />
                    </button>
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
