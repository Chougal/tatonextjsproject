"use client";

import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Search, Trash2, History } from "lucide-react";

interface Invoice {
  id: string;
  invoice_no: string;
  customer: string;
  mobile: string;
  service: string;
  price: number;
  discount: number;
  final: number;
  payment_mode: string;
  date: string;
  notes: string;
}

export default function InvoiceHistoryPage() {
  const [invoices, setInvoices, loaded] = useLocalStorage<Invoice[]>("ritech_invoices", []);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  const services = useMemo(() => ["All", ...Array.from(new Set(invoices.map(i => i.service)))], [invoices]);
  const payments = useMemo(() => ["All", ...Array.from(new Set(invoices.map(i => i.payment_mode)))], [invoices]);

  const filtered = useMemo(() => {
    return invoices
      .filter(inv => {
        const searchMatch = !search ||
          inv.customer.toLowerCase().includes(search.toLowerCase()) ||
          inv.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
          (inv.mobile || "").includes(search);
        const serviceMatch = serviceFilter === "All" || inv.service === serviceFilter;
        const paymentMatch = paymentFilter === "All" || inv.payment_mode === paymentFilter;
        const invDate = inv.date ? inv.date.split("T")[0] : "";
        const fromMatch = !fromDate || invDate >= fromDate;
        const toMatch = !toDate || invDate <= toDate;
        return searchMatch && serviceMatch && paymentMatch && fromMatch && toMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [invoices, search, serviceFilter, paymentFilter, fromDate, toDate]);

  const totalFiltered = filtered.reduce((s, i) => s + (i.final || 0), 0);

  const deleteInvoice = (id: string) => {
    if (confirm("Delete this invoice?")) setInvoices(prev => (prev as Invoice[]).filter(i => i.id !== id));
  };

  if (!loaded) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
        <History className="text-[var(--accent)]" /> Invoice History
      </h1>

      {/* Filters */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search customer / invoice..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
          className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
        />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
          className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
        />
        <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}
          className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]">
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}
          className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]">
          {payments.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl px-6 py-4">
        <span className="text-gray-400">{filtered.length} invoice{filtered.length !== 1 ? "s" : ""} found</span>
        <span className="text-lg font-bold text-[var(--success)]">
          Total: ₹ {totalFiltered.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Table */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No invoices found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a2e]">
                {["S/N", "Invoice #", "Date", "Customer", "Mobile", "Service", "Price", "Discount", "Final ₹", "Payment", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[var(--warning)] font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => (
                <tr key={inv.id} className="border-t border-[var(--panel-border)] hover:bg-[#2a2a3b]">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 text-[var(--accent)] font-mono text-xs">{inv.invoice_no}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{new Date(inv.date).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3 text-white font-medium">{inv.customer}</td>
                  <td className="px-4 py-3 text-gray-400">{inv.mobile || "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{inv.service}</td>
                  <td className="px-4 py-3 text-gray-300">₹{inv.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-[var(--error)]">{inv.discount > 0 ? `₹${inv.discount.toFixed(2)}` : "—"}</td>
                  <td className="px-4 py-3 text-[var(--success)] font-bold">₹{inv.final.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-400">{inv.payment_mode}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteInvoice(inv.id)} className="text-[var(--error)] hover:opacity-80">
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
