"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Eye, EyeOff, Plus, Users, FileText, IndianRupee, PieChart, CheckCircle2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [showValues, setShowValues] = useState(false);
  
  // Use Local Storage
  const [invoices, , invoicesLoaded] = useLocalStorage<any[]>("ritech_invoices", []);
  const [expenses, , expensesLoaded] = useLocalStorage<any[]>("ritech_expenses", []);
  const [notes, setNotes, notesLoaded] = useLocalStorage<any[]>("ritech_notes", []);

  // Calculate totals
  const totalRevenue = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + (Number(inv.final) || 0), 0);
  }, [invoices]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  }, [expenses]);

  const netProfit = totalRevenue - totalExpenses;

  // Chart Data preparation
  const chartData = useMemo(() => {
    const monthlyData: Record<string, { name: string; revenue: number; expenses: number }> = {};
    
    // Process Invoices
    invoices.forEach(inv => {
      if (!inv.date) return;
      const dateStr = inv.date.split(" ")[0]; // Get YYYY-MM-DD
      const monthStr = dateStr.substring(0, 7); // Get YYYY-MM
      if (!monthlyData[monthStr]) {
        monthlyData[monthStr] = { name: monthStr, revenue: 0, expenses: 0 };
      }
      monthlyData[monthStr].revenue += (Number(inv.final) || 0);
    });

    // Process Expenses
    expenses.forEach(exp => {
      if (!exp.date) return;
      const monthStr = exp.date.substring(0, 7);
      if (!monthlyData[monthStr]) {
        monthlyData[monthStr] = { name: monthStr, revenue: 0, expenses: 0 };
      }
      monthlyData[monthStr].expenses += (Number(exp.amount) || 0);
    });

    // Sort by month
    return Object.values(monthlyData)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(-6); // Last 6 months
  }, [invoices, expenses]);

  // Format currency
  const formatValue = (val: number) => {
    if (!showValues) return "₹ ***";
    return `₹ ${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  // Notes filtering
  const pendingNotes = notes.filter(n => n.status === "Pending");
  const highPriorityNotes = pendingNotes.filter(n => n.priority === "High");

  const completeNote = (id: string | number) => {
    const updated = notes.map(n => 
      n.id === id 
        ? { ...n, status: "Completed", completed_date: new Date().toISOString() } 
        : n
    );
    setNotes(updated);
  };

  if (!invoicesLoaded || !expensesLoaded || !notesLoaded) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
          📊 Dashboard Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Stats & Chart) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Cards */}
          <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 relative overflow-hidden">
            <button 
              onClick={() => setShowValues(!showValues)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              title="Toggle Values"
            >
              {showValues ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              <div className="bg-[#3a3f5c] p-5 rounded-xl text-center">
                <p className="text-gray-300 font-semibold mb-2">💰 Revenue</p>
                <p className="text-2xl font-bold text-[var(--success)]">{formatValue(totalRevenue)}</p>
              </div>
              <div className="bg-[#3a3f5c] p-5 rounded-xl text-center">
                <p className="text-gray-300 font-semibold mb-2">💸 Expenses</p>
                <p className="text-2xl font-bold text-[var(--error)]">{formatValue(totalExpenses)}</p>
              </div>
              <div className="bg-[#3a3f5c] p-5 rounded-xl text-center">
                <p className="text-gray-300 font-semibold mb-2">📈 Profit</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
                  {formatValue(netProfit)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              🚀 Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link href="/dashboard/invoice" className="flex flex-col items-center justify-center gap-2 p-4 bg-[#1f2937] hover:bg-[#374151] rounded-xl transition-colors border border-gray-700">
                <Plus className="text-[var(--accent)]" size={24} />
                <span className="text-sm font-medium">New Invoice</span>
              </Link>
              <Link href="/dashboard/customers" className="flex flex-col items-center justify-center gap-2 p-4 bg-[#1f2937] hover:bg-[#374151] rounded-xl transition-colors border border-gray-700">
                <Users className="text-[#a78bfa]" size={24} />
                <span className="text-sm font-medium">Add Customer</span>
              </Link>
              <Link href="/dashboard/expenses" className="flex flex-col items-center justify-center gap-2 p-4 bg-[#1f2937] hover:bg-[#374151] rounded-xl transition-colors border border-gray-700">
                <IndianRupee className="text-[var(--error)]" size={24} />
                <span className="text-sm font-medium">Add Expense</span>
              </Link>
              <Link href="/dashboard/revenue" className="flex flex-col items-center justify-center gap-2 p-4 bg-[#1f2937] hover:bg-[#374151] rounded-xl transition-colors border border-gray-700">
                <PieChart className="text-[var(--success)]" size={24} />
                <span className="text-sm font-medium">Reports</span>
              </Link>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 h-[350px]">
             <h2 className="text-lg font-bold text-white mb-4">Monthly Revenue vs Expenses</h2>
             {chartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                    formatter={(value) => [`₹ ${value}`, undefined]}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#00FF99" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#FF5555" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
             ) : (
               <div className="flex h-full items-center justify-center text-gray-500">
                 No data available to display chart.
               </div>
             )}
          </div>

        </div>

        {/* Right Column (Notes) */}
        <div className="space-y-6">
          <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 flex flex-col h-full min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                📝 Reminders
              </h2>
              <Link href="/dashboard/notes" className="text-xs bg-[var(--accent)] text-black px-3 py-1 rounded-full font-bold hover:opacity-80">
                + Add Note
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              
              {highPriorityNotes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[var(--error)] uppercase tracking-wider">🚨 High Priority</h3>
                  {highPriorityNotes.slice(0, 3).map(note => (
                    <div key={note.id} className="bg-[#3a1f1f] border border-red-900/50 p-4 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[#ff8888] text-sm">🔴 {note.title}</h4>
                      </div>
                      <p className="text-xs text-[#ffaaaa] mb-2 line-clamp-2">{note.content}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-gray-400">{note.due_date ? `📅 ${note.due_date}` : ""}</span>
                        <button onClick={() => completeNote(note.id)} className="text-[var(--success)] hover:text-green-300">
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 mt-4">
                <h3 className="text-sm font-bold text-[var(--accent)] uppercase tracking-wider">📋 All Tasks</h3>
                {pendingNotes.length > 0 ? (
                  pendingNotes.slice(0, 5).map(note => (
                    <div key={note.id} className="bg-[#1f2f3a] border border-[#2a3f4a] p-4 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-bold text-sm ${note.priority === 'Medium' ? 'text-[#ffaa00]' : 'text-[#00aaff]'}`}>
                          {note.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-300 mb-2 line-clamp-2">{note.content}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-gray-400">🏷️ {note.category}</span>
                        <button onClick={() => completeNote(note.id)} className="text-[var(--success)] hover:text-green-300">
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-[var(--success)]">
                    <p className="text-3xl mb-2">🎉</p>
                    <p>No pending tasks!</p>
                  </div>
                )}
              </div>
              
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--panel-border)]">
               <div className="bg-[#1f3a2f] p-4 rounded-xl border border-green-900/30">
                 <h4 className="text-[var(--success)] font-bold text-sm mb-1">💾 Backup Recommended</h4>
                 <p className="text-xs text-gray-400 mb-3">Keep your data safe by exporting it regularly.</p>
                 <Link href="/dashboard/settings" className="block text-center text-xs bg-[var(--panel)] text-white border border-[var(--panel-border)] py-2 rounded-lg hover:bg-[#3a3a4b]">
                   Go to Backup
                 </Link>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
