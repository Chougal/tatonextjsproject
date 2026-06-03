"use client";

import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserPlus, Search, Edit2, Trash2, ChevronDown, ChevronRight } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  registered: string;
}

export default function CustomersPage() {
  const [customers, setCustomers, loaded] = useLocalStorage<Customer[]>("ritech_customers", []);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  const resetForm = () => {
    setName(""); setMobile(""); setAddress(""); setEditingId(null); setError("");
  };

  const saveCustomer = () => {
    if (!name.trim() || !mobile.trim()) { setError("Name and Mobile are required."); return; }
    if (!/^\d{10}$/.test(mobile.trim())) { setError("Mobile must be exactly 10 digits."); return; }

    if (editingId) {
      setCustomers(prev => (prev as Customer[]).map(c => c.id === editingId ? { ...c, name: name.trim(), mobile: mobile.trim(), address: address.trim() } : c));
    } else {
      if (customers.some(c => c.mobile === mobile.trim())) { setError("Mobile number already registered!"); return; }
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: name.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        registered: new Date().toISOString(),
      };
      setCustomers(prev => [...(prev as Customer[]), newCustomer]);
    }
    resetForm();
  };

  const editCustomer = (c: Customer) => {
    setEditingId(c.id); setName(c.name); setMobile(c.mobile); setAddress(c.address); setError("");
  };

  const deleteCustomer = (id: string) => {
    if (confirm("Delete this customer?")) setCustomers(prev => (prev as Customer[]).filter(c => c.id !== id));
  };

  const filtered = useMemo(() =>
    customers.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search)
    ), [customers, search]);

  // Group by month-year
  const grouped = useMemo(() => {
    const map: Record<string, Customer[]> = {};
    filtered.forEach(c => {
      const key = c.registered
        ? new Date(c.registered).toLocaleString("en-IN", { month: "long", year: "numeric" })
        : "Unknown";
      if (!map[key]) map[key] = [];
      map[key].push(c);
    });
    return Object.entries(map).sort((a, b) => {
      const da = new Date(a[1][0]?.registered || 0);
      const db = new Date(b[1][0]?.registered || 0);
      return db.getTime() - da.getTime();
    });
  }, [filtered]);

  const toggleMonth = (key: string) => {
    setCollapsedMonths(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  if (!loaded) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-white">👤 Customer Management</h1>

      {/* Form */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-[var(--accent)] mb-4">{editingId ? "✏️ Edit Customer" : "➕ Add New Customer"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text" placeholder="Full Name" value={name}
            onChange={e => setName(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]"
          />
          <input
            type="text" placeholder="Mobile (10 digits)" value={mobile}
            onChange={e => setMobile(e.target.value)} maxLength={10}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]"
          />
          <input
            type="text" placeholder="Address (optional)" value={address}
            onChange={e => setAddress(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        {error && <p className="text-[var(--error)] text-sm mt-2">{error}</p>}
        <div className="flex gap-3 mt-4">
          <button onClick={saveCustomer}
            className="bg-gradient-to-r from-[var(--accent)] to-[#00b3ff] text-black font-bold py-2 px-6 rounded-xl flex items-center gap-2 hover:opacity-90">
            <UserPlus size={18} /> {editingId ? "Update" : "Add Customer"}
          </button>
          {editingId && (
            <button onClick={resetForm}
              className="border border-[var(--panel-border)] text-gray-400 py-2 px-6 rounded-xl hover:bg-[#2a2a3b]">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text" placeholder="Search by name or mobile..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[var(--panel)] border border-[var(--panel-border)] text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      {/* Customer List */}
      <div className="space-y-4">
        {grouped.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No customers found.</div>
        ) : (
          grouped.map(([month, list]) => (
            <div key={month} className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleMonth(month)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#2a2a3b] transition-colors"
              >
                <span className="font-bold text-[var(--accent)]">📅 {month} ({list.length} customers)</span>
                {collapsedMonths.has(month) ? <ChevronRight size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </button>

              {!collapsedMonths.has(month) && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-t border-[var(--panel-border)] bg-[#1a1a2e]">
                        {["S/N", "Name", "Mobile", "Address", "Registered", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[var(--warning)] font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((c, i) => (
                        <tr key={c.id} className="border-t border-[var(--panel-border)] hover:bg-[#2a2a3b]">
                          <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                          <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                          <td className="px-4 py-3 text-gray-300">{c.mobile}</td>
                          <td className="px-4 py-3 text-gray-400">{c.address || "—"}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                            <span className="block">{new Date(c.registered).toLocaleDateString("en-IN")}</span>
                            <span className="block text-gray-500">{new Date(c.registered).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => editCustomer(c)} className="text-[var(--accent)] hover:opacity-80"><Edit2 size={16} /></button>
                              <button onClick={() => deleteCustomer(c.id)} className="text-[var(--error)] hover:opacity-80"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
