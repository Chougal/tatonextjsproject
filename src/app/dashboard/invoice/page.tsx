"use client";

import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FileText, Printer, Download, MessageCircle, Search } from "lucide-react";

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
  "Sketching", "Freming", "Sclupture", "DIY Art", "Coverup Tattos", "Laser Removel",
];
const TATTOO_TYPES = ["2D", "3D"];
const PAYMENT_MODES = ["Cash", "UPI", "Online"];
const PAYMENT_STATUSES = ["Paid", "Pending"];
const GENDERS = ["Male", "Female", "Other"];

export default function InvoicePage() {
  const [customers, , customersLoaded]  = useLocalStorage<Customer[]>("ritech_customers", []);
  const [invoices, setInvoices, invoicesLoaded] = useLocalStorage<Invoice[]>("ritech_invoices", []);
  const [settings, , settingsLoaded]    = useLocalStorage<Record<string, string>>("ritech_settings", {});

  const [customer, setCustomer]         = useState("");
  const [mobile, setMobile]             = useState("");
  const [gender, setGender]             = useState(GENDERS[0]);
  const [service, setService]           = useState(SERVICES[0]);
  const [tattooType, setTattooType]     = useState(TATTOO_TYPES[0]);
  const [price, setPrice]               = useState("");
  const [discount, setDiscount]         = useState("0");
  const [paymentMode, setPaymentMode]   = useState(PAYMENT_MODES[0]);
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUSES[0]);
  const [ointment, setOintment]         = useState("");
  const [notes, setNotes]               = useState("");
  const [saved, setSaved]               = useState<Invoice | null>(null);
  const [error, setError]               = useState("");

  // Customer search dropdown
  const [showSuggestions, setShowSuggestions] = useState(false);
  const customerRef = useRef<HTMLDivElement>(null);

  const priceNum    = parseFloat(price) || 0;
  const discountNum = parseFloat(discount) || 0;
  const finalAmount = Math.max(0, priceNum - discountNum);

  // Filter suggestions
  const suggestions = customers.filter(c =>
    c.name.toLowerCase().includes(customer.toLowerCase()) ||
    c.mobile.includes(customer)
  ).slice(0, 8);

  // Auto-fill mobile when customer exactly matches
  useEffect(() => {
    const found = customers.find(c => c.name.toLowerCase() === customer.toLowerCase());
    if (found) setMobile(found.mobile);
  }, [customer, customers]);

  useEffect(() => {
    if (discountNum > priceNum && priceNum > 0) setError("Discount cannot exceed MRP!");
    else if (error === "Discount cannot exceed MRP!") setError("");
  }, [discountNum, priceNum, error]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (customerRef.current && !customerRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const genInvNo = () => {
    const now = new Date();
    return `RT${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(Math.floor(Math.random() * 900) + 100)}`;
  };

  const resetForm = () => {
    setCustomer(""); setMobile(""); setGender(GENDERS[0]); setService(SERVICES[0]);
    setTattooType(TATTOO_TYPES[0]); setPrice(""); setDiscount("0");
    setPaymentMode(PAYMENT_MODES[0]); setPaymentStatus(PAYMENT_STATUSES[0]);
    setOintment(""); setNotes(""); setError("");
  };

  const handleSubmit = () => {
    if (!customer.trim())                     { setError("Customer name is required."); return; }
    if (!price || isNaN(priceNum) || priceNum <= 0) { setError("Enter a valid MRP."); return; }
    if (discountNum > priceNum)               { setError("Discount cannot exceed MRP!"); return; }

    const inv: Invoice = {
      id: Date.now().toString(),
      invoice_no: genInvNo(),
      customer: customer.trim(),
      mobile: mobile.trim(),
      gender, service,
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

  // ── Print ──
  const handlePrint = () => window.print();

  // ── Download PDF via browser print-to-PDF ──
  const handleDownloadPDF = () => {
    const receipt = document.getElementById("receipt-content");
    if (!receipt) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>Invoice ${saved?.invoice_no}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #000; max-width: 400px; margin: auto; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 12px; }
        .row { display: flex; justify-content: space-between; margin: 4px 0; font-size: 13px; }
        .label { color: #555; }
        .total { font-size: 18px; font-weight: bold; border-top: 2px solid #000; padding-top: 8px; margin-top: 8px; }
        .footer { text-align: center; color: #777; font-size: 11px; margin-top: 16px; }
      </style></head>
      <body>${receipt.innerHTML}</body></html>
    `);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 400);
  };

  // ── WhatsApp Share ──
  const handleWhatsApp = () => {
    if (!saved) return;
    const studioName = settings?.studio_name || "Ritesh Tattoo Studio";
    const msg = `🧿 *${studioName}*\n` +
      `━━━━━━━━━━━━━━\n` +
      `📄 Invoice: *${saved.invoice_no}*\n` +
      `👤 Customer: *${saved.customer}*\n` +
      `🎨 Service: *${saved.service}* (${saved.tattoo_type})\n` +
      `💰 MRP: ₹${saved.price.toFixed(2)}\n` +
      (saved.discount > 0 ? `🎁 Discount: ₹${saved.discount.toFixed(2)}\n` : "") +
      `✅ *Total: ₹${saved.final.toFixed(2)}*\n` +
      `💳 Payment: ${saved.payment_mode} — ${saved.payment_status}\n` +
      `━━━━━━━━━━━━━━\n` +
      `${settings?.invoice_footer || "Thank you for visiting! 🙏"}`;

    const phone = saved.mobile ? `91${saved.mobile}` : "";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  if (!customersLoaded || !invoicesLoaded || !settingsLoaded)
    return <div className="flex h-full items-center justify-center">Loading...</div>;

  const studioName    = settings?.studio_name    || "Ritesh Tattoo Studio";
  const studioPhone   = settings?.phone          || "";
  const studioAddress = settings?.address        || "";
  const invoiceFooter = settings?.invoice_footer || "Thank you for visiting! 🙏";

  const inputCls  = "w-full bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)] text-sm";
  const selectCls = inputCls;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <FileText className="text-[var(--accent)]" /> New Invoice
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Form ── */}
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-[var(--accent)]">Invoice Details</h2>

          {/* Customer searchable dropdown */}
          <div className="space-y-1" ref={customerRef}>
            <label className="text-xs text-gray-400">Customer Name *</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Type name or mobile to search..."
                value={customer}
                onChange={e => { setCustomer(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-[var(--accent)] text-sm"
              />
              {showSuggestions && customer.length > 0 && suggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-[#1e1e2f] border border-[var(--panel-border)] rounded-xl shadow-2xl overflow-hidden">
                  {suggestions.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setCustomer(c.name); setMobile(c.mobile); setShowSuggestions(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#2a2a3b] border-b border-[var(--panel-border)] last:border-0"
                    >
                      <span className="text-white font-medium text-sm">{c.name}</span>
                      <span className="text-gray-400 text-xs ml-2">📞 {c.mobile}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile + Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Mobile (auto-filled)</label>
              <input type="text" placeholder="Mobile" value={mobile} maxLength={10}
                onChange={e => setMobile(e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className={selectCls}>
                {GENDERS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Service + Tattoo Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Service *</label>
              <select value={service} onChange={e => setService(e.target.value)} className={selectCls}>
                {SERVICES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Tattoo Type</label>
              <select value={tattooType} onChange={e => setTattooType(e.target.value)} className={selectCls}>
                {TATTOO_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* MRP + Discount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">MRP (₹) *</label>
              <input type="number" placeholder="e.g. 2000" value={price} min="0"
                onChange={e => setPrice(e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Discount (₹)</label>
              <input type="number" placeholder="e.g. 200" value={discount} min="0"
                onChange={e => setDiscount(e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Payment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Payment Mode</label>
              <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className={selectCls}>
                {PAYMENT_MODES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Payment Status</label>
              <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className={selectCls}>
                {PAYMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Ointment */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Ointment</label>
            <input type="text" placeholder="e.g. Vitamin A,D, Himalaya, Vaslin etc."
              value={ointment} onChange={e => setOintment(e.target.value)} className={inputCls} />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Notes</label>
            <textarea rows={2} placeholder="Additional notes..." value={notes}
              onChange={e => setNotes(e.target.value)}
              className={`${inputCls} resize-none`} />
          </div>

          {/* Final */}
          <div className={`rounded-xl p-4 flex justify-between items-center border ${paymentStatus === "Pending" ? "border-[var(--warning)] bg-[#2a2000]" : "border-[var(--accent)] bg-[#0d1a1a]"}`}>
            <div>
              <span className="text-gray-300 font-medium text-sm">Final Amount</span>
              {paymentStatus === "Pending" && <span className="ml-2 text-xs text-[var(--warning)] font-bold">⏳ PENDING</span>}
            </div>
            <span className="text-xl font-bold text-[var(--accent)]">
              ₹ {finalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {error && <p className="text-[var(--error)] text-sm">{error}</p>}

          <button onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-[var(--accent)] to-[#00b3ff] text-black font-bold py-3 rounded-xl hover:opacity-90">
            💾 Save Invoice
          </button>
        </div>

        {/* ── Receipt Preview ── */}
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-white">🧾 Receipt Preview</h2>
          </div>

          {saved ? (
            <>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={handlePrint}
                  className="flex items-center gap-2 text-xs bg-[#1f2937] border border-gray-700 text-white px-3 py-2 rounded-xl hover:bg-[#374151]">
                  <Printer size={14} /> Print
                </button>
                <button onClick={handleDownloadPDF}
                  className="flex items-center gap-2 text-xs bg-[#1a3a1a] border border-green-900/50 text-[var(--success)] px-3 py-2 rounded-xl hover:opacity-80">
                  <Download size={14} /> Download PDF
                </button>
                <button onClick={handleWhatsApp}
                  className="flex items-center gap-2 text-xs bg-[#1a3a1a] border border-green-900/50 text-[#25D366] px-3 py-2 rounded-xl hover:opacity-80">
                  <MessageCircle size={14} /> WhatsApp
                </button>
              </div>

              {/* Receipt Card */}
              <div id="receipt-content" className="bg-[#0d0d1a] border border-[var(--panel-border)] rounded-xl p-5 space-y-3 text-sm">
                {/* Studio Header */}
                <div className="text-center border-b border-[var(--panel-border)] pb-4">
                  <p className="text-lg font-bold text-[var(--accent)]">🧿 {studioName}</p>
                  {studioAddress && <p className="text-gray-400 text-xs">{studioAddress}</p>}
                  {studioPhone   && <p className="text-gray-400 text-xs">📞 {studioPhone}</p>}
                  <p className="text-gray-500 text-xs mt-1">Invoice# {saved.invoice_no}</p>
                  <p className="text-gray-500 text-xs">{new Date(saved.date).toLocaleString("en-IN")}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                  <span className="text-gray-500">Customer</span>
                  <span className="text-white font-semibold">{saved.customer}</span>
                  {saved.mobile && <><span className="text-gray-500">Mobile</span><span className="text-gray-300">{saved.mobile}</span></>}
                  <span className="text-gray-500">Gender</span>
                  <span className="text-gray-300">{saved.gender}</span>
                  <span className="text-gray-500">Service</span>
                  <span className="text-gray-300">{saved.service}</span>
                  <span className="text-gray-500">Tattoo Type</span>
                  <span className="text-gray-300">{saved.tattoo_type}</span>
                  <span className="text-gray-500">Payment</span>
                  <span className="text-gray-300">{saved.payment_mode}</span>
                  <span className="text-gray-500">Status</span>
                  <span className={`font-bold ${saved.payment_status === "Pending" ? "text-[var(--warning)]" : "text-[var(--success)]"}`}>
                    {saved.payment_status}
                  </span>
                  {saved.ointment && (
                    <><span className="text-gray-500">Ointment</span><span className="text-gray-300">{saved.ointment}</span></>
                  )}
                </div>

                {/* Pricing */}
                <div className="border-t border-[var(--panel-border)] pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">MRP</span>
                    <span className="text-gray-300">₹ {saved.price.toFixed(2)}</span>
                  </div>
                  {saved.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discount</span>
                      <span className="text-[var(--error)]">- ₹ {saved.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base border-t border-[var(--panel-border)] pt-2 mt-1">
                    <span className="text-white">Total</span>
                    <span className="text-[var(--accent)]">₹ {saved.final.toFixed(2)}</span>
                  </div>
                </div>

                {saved.notes && (
                  <p className="text-gray-400 text-xs border-t border-[var(--panel-border)] pt-3">📝 {saved.notes}</p>
                )}
                <p className="text-center text-gray-500 text-xs pt-1">{invoiceFooter}</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-3">
              <FileText size={48} className="opacity-20" />
              <p className="text-sm">Fill the form and save to preview receipt</p>
            </div>
          )}
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #receipt-print-area { display: block !important; }
        }
      `}</style>
    </div>
  );
}
