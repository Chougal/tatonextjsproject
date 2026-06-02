"use client";

import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PlusCircle, IndianRupee } from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

const CATEGORIES = ["Rent", "Supplies", "Maintenance", "Miscellaneous", "Others", "Self"];

export default function ExpensesPage() {
  const [expenses, setExpenses, loaded] = useLocalStorage<Expense[]>("ritech_expenses", []);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [error, setError] = useState("");

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  const handleAdd = () => {
    if (!description.trim()) { setError("Description is required."); return; }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) { setError("Enter a valid amount."); return; }
    if (!date) { setError("Date is required."); return; }

    const newExp: Expense = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      date,
      category,
    };
    setExpenses([...expenses, newExp]);
    setDescription(""); setAmount(""); setDate(new Date().toISOString().split("T")[0]); setCategory(CATEGORIES[0]); setError("");
  };

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  if (!loaded) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
        <IndianRupee className="text-[var(--error)]" /> Expense Manager
      </h1>

      {/* Add Expense Form */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-[var(--error)] mb-4">➕ Add Expense</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text" placeholder="Description (e.g. Rent)" value={description}
            onChange={e => setDescription(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--error)]"
          />
          <input
            type="number" placeholder="Amount (₹)" value={amount} min="0"
            onChange={e => setAmount(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--error)]"
          />
          <input
            type="date" value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--error)]"
          />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--error)]">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {error && <p className="text-[var(--error)] text-sm mt-2">{error}</p>}
        <button onClick={handleAdd}
          className="mt-4 flex items-center gap-2 bg-[var(--error)] hover:opacity-90 text-white font-bold py-2 px-6 rounded-xl transition-opacity">
          <PlusCircle size={18} /> Add Expense
        </button>
      </div>

      {/* Total */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl px-6 py-4 flex justify-between items-center">
        <span className="text-gray-400">Total Expenses (all time)</span>
        <span className="text-xl font-bold text-[var(--error)]">
          ₹ {totalExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Recent Expenses Table */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl overflow-x-auto">
        <div className="px-6 py-4 border-b border-[var(--panel-border)]">
          <h2 className="font-bold text-white">Recent Expenses</h2>
        </div>
        {recentExpenses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No expenses recorded yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a2e]">
                {["S/N", "Description", "Amount ₹", "Date", "Category"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[var(--warning)] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map((exp, i) => (
                <tr key={exp.id} className="border-t border-[var(--panel-border)] hover:bg-[#2a2a3b]">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 text-white">{exp.description}</td>
                  <td className="px-4 py-3 text-[var(--error)] font-medium">₹ {exp.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-400">{exp.date}</td>
                  <td className="px-4 py-3">
                    <span className="bg-[#2a2a3b] text-gray-300 px-2 py-1 rounded-lg text-xs">{exp.category}</span>
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
