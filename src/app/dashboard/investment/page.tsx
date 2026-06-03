"use client";

import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TrendingUp, PlusCircle, Trash2 } from "lucide-react";

interface Investment {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  note: string;
}

const CATEGORIES = ["Equipment", "Supplies", "Training", "Marketing", "Infrastructure", "Personal", "Other"];

export default function InvestmentPage() {
  const [investments, setInvestments, loaded] = useLocalStorage<Investment[]>("ritech_investments", []);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const totalInvested = useMemo(() => investments.reduce((s, i) => s + i.amount, 0), [investments]);

  // Today's total
  const todayStr = new Date().toISOString().split("T")[0];
  const todayTotal = useMemo(() =>
    investments.filter(i => i.date === todayStr).reduce((s, i) => s + i.amount, 0),
    [investments, todayStr]);

  const handleAdd = () => {
    if (!description.trim()) { setError("Description is required."); return; }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) { setError("Enter a valid amount."); return; }
    const inv: Investment = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      date,
      category,
      note: note.trim(),
    };
    setInvestments([...investments, inv]);
    setDescription(""); setAmount(""); setNote(""); setDate(new Date().toISOString().split("T")[0]);
    setCategory(CATEGORIES[0]); setError("");
  };

  const deleteInvestment = (id: string) => {
    if (confirm("Delete this investment entry?")) setInvestments(investments.filter(i => i.id !== id));
  };

  const sorted = [...investments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!loaded) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-[#60a5fa] flex items-center gap-2">
        <TrendingUp /> Daily Investment Tracker
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[var(--panel)] border border-blue-900/40 rounded-2xl p-5 text-center">
          <p className="text-gray-400 text-sm mb-1">💎 Total Invested (All Time)</p>
          <p className="text-2xl font-bold text-[#60a5fa]">
            ₹ {totalInvested.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">{investments.length} entries</p>
        </div>
        <div className="bg-[var(--panel)] border border-blue-900/40 rounded-2xl p-5 text-center">
          <p className="text-gray-400 text-sm mb-1">📅 Today&apos;s Investment</p>
          <p className="text-2xl font-bold text-[#a78bfa]">
            ₹ {todayTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleDateString("en-IN")}</p>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#60a5fa]">➕ Add Investment Entry</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" placeholder="Description (e.g. Needle Set)" value={description}
            onChange={e => setDescription(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[#60a5fa]"
          />
          <input type="number" placeholder="Amount (₹)" value={amount} min="0"
            onChange={e => setAmount(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[#60a5fa]"
          />
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[#60a5fa]"
          />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[#60a5fa]">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="text" placeholder="Note (optional)" value={note}
            onChange={e => setNote(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[#60a5fa] sm:col-span-2"
          />
        </div>
        {error && <p className="text-[var(--error)] text-sm">{error}</p>}
        <button onClick={handleAdd}
          className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#2563eb] text-white font-bold py-2 px-6 rounded-xl transition-colors">
          <PlusCircle size={18} /> Add Investment
        </button>
      </div>

      {/* History Table */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl overflow-x-auto">
        <div className="px-6 py-4 border-b border-[var(--panel-border)]">
          <h2 className="font-bold text-white">Investment History</h2>
        </div>
        {sorted.length === 0 ? (
          <div className="text-center py-14 text-gray-500">No investment entries yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a2e]">
                {["S/N", "Date", "Description", "Category", "Note", "Amount ₹", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[#60a5fa] font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((inv, i) => (
                <tr key={inv.id} className="border-t border-[var(--panel-border)] hover:bg-[#2a2a3b]">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{inv.date}</td>
                  <td className="px-4 py-3 text-white font-medium">{inv.description}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-900/30 text-[#60a5fa] px-2 py-0.5 rounded-lg text-xs">{inv.category}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{inv.note || "—"}</td>
                  <td className="px-4 py-3 text-[#60a5fa] font-bold">₹ {inv.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteInvestment(inv.id)} className="text-[var(--error)] hover:opacity-80">
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
