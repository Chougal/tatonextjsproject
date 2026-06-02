"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FileText, Printer } from "lucide-react";

interface Customer { id: string; name: string; mobile: string; address: string; }
export interface Invoice {
  id: string;
  invoice_no: string;
  customer: string;
  mobile: string;
  gender: string;
  service: string;
  tattoo_type: string;
  price: number;
  discount: number;
  final: number;
  payment_mode: string;
  payment_status: string;
  ointment: string;
  date: string;
  notes: string;
}

const SERVICES = [
  "Tattoo", "Touchup", "Second", "Multiple", "Painting", "Blood Painting",
  "Sketching", "Freming", "Sclupture", "DIY Art", "Coverup Tattos", "Laser Removel"
];
const TATTOO_TYPES = ["2D", "3D"];
const PAYMENT_MODES = ["Cash", "UPI", "Online"];
const PAYMENT_STATUSES = ["Paid", "Pending"];
const GENDERS = ["Male", "Female", "Other"];

export default function InvoicePage() {
  const [customers, , customersLoaded] = useLocalStorage<Customer[]>("ritech_customers", []);
  const [invoices, setInvoices, invoicesLoaded] = useLocalStorage<Invoice[]>("ritech_invoices", []);
  const [settings, , settingsLoaded] = useLocalStorage<Record<string, string>>("ritech_settings", {});

  const [customer, setCustomer] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState(GENDERS[0]);
  const [service, setService] = useState(SERVICES[0]);
  const [tattooType, setTattooType] = useState(TATTOO_TYPES[0]);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [paymentMode, setPaymentMode] = useState(PAYMENT_MODES[0]);
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUSES[0]);
  const [ointment, setOintment] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState<Invoice | null>(null);
  const [error, setError] = useState("");

  const priceNum = parseFloat(price) || 0;
  const discountNum = parseFloat(discount) || 0;
  const finalAmount = Math.max(0, priceNum - discountNum);

  // Auto-fill mobile when customer name matches
  useEffect(() => {
    const found = customers.find(c => c.name.toLowerCase() === customer.toLowerCase());
    if (found) setMobile(found.mobile);
  }, [customer, customers]);

  // Warn if discount > price
  useEffect(() => {
    if (discountNum > priceNum && priceNum > 0) setError("Discount cannot be more than MRP!");
    else if (error === "Discount cannot be more than MRP!") setError("");
  }, [discountNum, priceNum]);

  const generateInvoiceNo = () => {
    const now = new Date();
    const ts = now.getFullYear().toString().slice(-2) +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");
    return `RT${ts}${String(Math.floor(Math.random() * 900) + 100)}`;
  };

  const resetForm = () => {
    setCustomer(""); setMobile(""); setGender(GENDERS[0]); setService(SERVICES[0]);
    setTattooType(TATTOO_TYPES[0]); setPrice(""); setDiscount("0");
    setPaymentMode(PAYMENT_MODES[0]); setPaymentStatus(PAYMENT_STATUSES[0]);
    setOintment(""); setNotes(""); setError("");
  };

  const handleSubmit = () => {
    if (!customer.trim()) { setError("Customer name is required."); return; }
    if (!price || isNaN(priceNum) || priceNum <= 0) { setError("Enter a valid MRP."); return; }
    if (discountNum > priceNum) { setError("Discount cannot be more than MRP!"); return; }

    const inv: Invoice = {
      id: Date.now().toString(),
      invoice_no: generateInvoiceNo(),
      customer: customer.trim(),
      mobile: mobile.trim(),
      gender,
      service,
      tattoo_type: tattooType,
      price: priceNum,
      discount: discountNum,
      final: finalAmount,
      payment_mode: paymentMode,
      payment_status: paymentStatus,
      ointment: ointment.trim(),
      date: new Date().toISOString(),
      notes: notes.trim(),
    };

    setInvoices([...invoices, inv]);
    setSaved(inv);
    resetForm();
  };

  if (!customersLoaded || !invoicesLoaded || !settingsLoaded) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  const studioName = settings?.studio_name || "RiTech Tattoo Studio";
  const studioPhone = settings?.phone || "";
  const studioAddress = settings?.address || "";
  const invoiceFooter = settings?.invoice_footer || "Thank you for visiting!";

  const inputCls = "w-full bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]";
  const selectCls = inputCls;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
        <FileText className="text-[var(--accent)]" /> New Invoice
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Form ── */}
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-[var(--accent)]">Invoice Details</h2>

          {/* Customer */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Customer Name *</label>
            <input list="customer-list" type="text" placeholder="Type or select customer"
              value={customer} onChange={e => setCustomer(e.target.value)} className={inputCls} />
            <datalist id="customer-list">
              {[...customers].reverse().map(c => <option key={c.id} value={c.name} />)}
            </datalist>
          </div>

          {/* Mobile + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Mobile</label>
              <input type="text" placeholder="Mobile number" value={mobile} maxLength={10}
                onChange={e => setMobile(e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className={selectCls}>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Service + Tattoo Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Service *</label>
              <select value={service} onChange={e => setService(e.target.value)} className={selectCls}>
                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Tattoo Type</label>
              <select value={tattooType} onChange={e => setTattooType(e.target.value)} className={selectCls}>
                {TATTOO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* MRP + Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">MRP (₹) *</label>
              <input type="number" placeholder="e.g. 2000" value={price} min="0"
                onChange={e => setPrice(e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Discount (₹)</label>
              <input type="number" placeholder="e.g. 200" value={discount} min="0"
                onChange={e => setDiscount(e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Payment Mode + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Payment Mode</label>
              <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className={selectCls}>
                {PAYMENT_MODES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Payment Status</label>
              <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className={selectCls}>
                {PAYMENT_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ointment */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Ointment</label>
            <input type="text" placeholder="e.g. Vitamin A,D, Himalaya, Vaslin etc."
              value={ointment} onChange={e => setOintment(e.target.value)} className={inputCls} />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Notes (optional)</label>
            <textarea placeholder="Any additional notes..." value={notes} rows={2}
              onChange={e => setNotes(e.target.value)}
              className={`${inputCls} resize-none`} />
          </div>

          {/* Final Amount Display */}
          <div className={`rounded-xl p-4 flex justify-between items-center border ${
            paymentStatus === "Pending" ? "border-[var(--warning)] bg-[#2a2000]" : "border-[var(--accent)] bg-[#1a1a2e]"
          }`}>
            <div>
              <span className="text-gray-300 font-medium">Final Amount</span>
              {paymentStatus === "Pending" && (
                <span className="ml-2 text-xs text-[var(--warning)] font-bold">⏳ PENDING</span>
              )}
            </div>
            <span className="text-2xl font-bold text-[var(--accent)]">
              ₹ {finalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {error && <p className="text-[var(--error)] text-sm">{error}</p>}

          <button onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-[var(--accent)] to-[#00b3ff] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
            💾 Save Invoice
          </button>
        </div>

        {/* ── Receipt Preview ── */}
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">🧾 Receipt Preview</h2>
            {saved && (
              <button onClick={() => window.print()}
                className="flex items-center gap-2 text-sm bg-[#1a1a2e] border border-[var(--panel-border)] text-white px-4 py-2 rounded-xl hover:bg-[#2a2a3b]">
                <Printer size={16} /> Print
              </button>
            )}
          </div>

          {saved ? (
            <div id="receipt" className="bg-[#0d0d1a] border border-[var(--panel-border)] rounded-xl p-6 space-y-3 text-sm print:bg-white print:text-black print:border-black">
              {/* Header */}
              <div className="text-center border-b border-[var(--panel-border)] pb-4">
                <p className="text-xl font-bold text-[var(--accent)] print:text-black">🧿 {studioName}</p>
                {studioAddress && <p className="text-gray-400 text-xs print:text-gray-600">{studioAddress}</p>}
                {studioPhone && <p className="text-gray-400 text-xs print:text-gray-600">📞 {studioPhone}</p>}
                <p className="text-gray-400 text-xs mt-1">Invoice #{saved.invoice_no}</p>
                <p className="text-gray-400 text-xs">{new Date(saved.date).toLocaleString("en-IN")}</p>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-y-1 text-gray-300">
                <span className="text-gray-500">Customer</span><span className="text-white font-medium">{saved.customer}</span>
                {saved.mobile && <><span className="text-gray-500">Mobile</span><span>{saved.mobile}</span></>}
                <span className="text-gray-500">Gender</span><span>{saved.gender}</span>
                <span className="text-gray-500">Service</span><span>{saved.service}</span>
                <span className="text-gray-500">Tattoo Type</span><span>{saved.tattoo_type}</span>
                <span className="text-gray-500">Payment Mode</span><span>{saved.payment_mode}</span>
                <span className="text-gray-500">Payment Status</span>
                <span className={saved.payment_status === "Pending" ? "text-[var(--warning)] font-bold" : "text-[var(--success)] font-bold"}>
                  {saved.payment_status}
                </span>
                {saved.ointment && <><span className="text-gray-500">Ointment</span><span>{saved.ointment}</span></>}
              </div>

              {/* Pricing */}
              <div className="border-t border-[var(--panel-border)] pt-3 space-y-1">
                <div className="flex justify-between"><span className="text-gray-400">MRP</span><span>₹ {saved.price.toFixed(2)}</span></div>
                {saved.discount > 0 && (
                  <div className="flex justify-between"><span className="text-gray-400">Discount</span>
                    <span className="text-[var(--error)]">- ₹ {saved.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t border-[var(--panel-border)] pt-2 mt-2">
                  <span className="text-white">Total</span>
                  <span className="text-[var(--accent)]">₹ {saved.final.toFixed(2)}</span>
                </div>
              </div>

              {saved.notes && <p className="text-gray-400 text-xs border-t border-[var(--panel-border)] pt-3">📝 {saved.notes}</p>}
              <p className="text-center text-gray-500 text-xs pt-2">{invoiceFooter}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-3">
              <FileText size={48} className="opacity-30" />
              <p>Fill the form and save to preview receipt</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
