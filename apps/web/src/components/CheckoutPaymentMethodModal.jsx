import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, X } from 'lucide-react';

// ─── Metode Pembayaran ────────────────────────────────────────────────────────
// Semua metode ini didukung Midtrans Sandbox.
// id harus cocok dengan switch-case di backend payment.js → buildPaymentDetails()
// ─────────────────────────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  // ── COD ──────────────────────────────────────────────────────────────────
  {
    id: 'cod',
    category: 'Bayar di Tempat',
    name: 'Bayar di Tempat (COD)',
    description: 'Bayar tunai saat pesanan tiba',
    icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/cod-icon.png',
    sandbox_note: null,
  },

  // ── QRIS ─────────────────────────────────────────────────────────────────
  {
    id: 'qris',
    category: 'QRIS',
    name: 'QRIS',
    description: 'GoPay, DANA, ShopeePay, OVO, LinkAja, dll',
    icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/qris-icon.png',
    sandbox_note: 'Sandbox: scan QR akan muncul beneran di popup.',
  },

  // ── Virtual Account Bank ──────────────────────────────────────────────────
  {
    id: 'va_bca',
    category: 'Transfer Bank',
    name: 'BCA Virtual Account',
    description: 'Nomor VA otomatis, cek otomatis otomatis',
    icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/bca-icon.png',
    sandbox_note: 'Sandbox: Gunakan simulator bank Midtrans untuk test bayar.',
  },
  {
    id: 'va_mandiri',
    category: 'Transfer Bank',
    name: 'Mandiri Virtual Account',
    description: 'Bayar via ATM / m-banking Mandiri',
    icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/mandiri-icon.png',
    sandbox_note: 'Sandbox: Gunakan simulator Mandiri di dashboard Midtrans.',
  },
  {
    id: 'va_bni',
    category: 'Transfer Bank',
    name: 'BNI Virtual Account',
    description: 'Bayar via ATM / m-banking BNI',
    icon: null,
    iconText: 'BNI',
    sandbox_note: 'Sandbox: BNI VA tersedia di simulator Midtrans.',
  },
  {
    id: 'va_bri',
    category: 'Transfer Bank',
    name: 'BRI Virtual Account',
    description: 'Bayar via ATM / m-banking BRI',
    icon: null,
    iconText: 'BRI',
    sandbox_note: 'Sandbox: BRI VA tersedia di simulator Midtrans.',
  },

  // ── E-Wallet ─────────────────────────────────────────────────────────────
  {
    id: 'gopay',
    category: 'Dompet Digital',
    name: 'GoPay',
    description: 'QR atau deep-link ke aplikasi Gojek',
    icon: null,
    iconText: 'GP',
    iconColor: 'bg-green-600',
    sandbox_note: 'Sandbox: Akan memunculkan QR Code Snap.',
  },
  {
    id: 'shopeepay',
    category: 'Dompet Digital',
    name: 'ShopeePay',
    description: 'QR atau deep-link ke aplikasi Shopee',
    icon: null,
    iconText: 'SPY',
    iconColor: 'bg-orange-500',
    sandbox_note: 'Sandbox: Simulasi QR code Snap Midtrans.',
  },

  // ── Kartu Kredit / Debit ─────────────────────────────────────────────────
  {
    id: 'cc',
    category: 'Kartu',
    name: 'Kartu Kredit / Debit',
    description: 'Visa, Mastercard, JCB — 3D Secure',
    icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/cc-icon.png',
    sandbox_note: 'Sandbox: Gunakan kartu tes 4811 1111 1111 1114.',
  },
];

// Kelompokkan metode berdasarkan category
const groupedMethods = PAYMENT_METHODS.reduce((groups, method) => {
  const cat = method.category;
  if (!groups[cat]) groups[cat] = [];
  groups[cat].push(method);
  return groups;
}, {});

const CATEGORY_ORDER = ['Bayar di Tempat', 'QRIS', 'Transfer Bank', 'Dompet Digital', 'Kartu'];

// ─── Komponen Ikon Fallback ───────────────────────────────────────────────────
const PaymentIcon = ({ method }) => {
  if (method.icon) {
    return (
      <img
        src={method.icon}
        alt={method.name}
        className="w-full h-full object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          if (e.currentTarget.nextSibling) {
            e.currentTarget.nextSibling.style.display = 'flex';
          }
        }}
      />
    );
  }
  return (
    <div
      className={`w-full h-full rounded flex items-center justify-center text-white text-[11px] font-extrabold tracking-wider ${
        method.iconColor || 'bg-blue-600'
      }`}
    >
      {method.iconText || method.name.substring(0, 2).toUpperCase()}
    </div>
  );
};

// ─── Payment Method Card ──────────────────────────────────────────────────────
const MethodCard = ({ method, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(method.id)}
    className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
      isSelected
        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
        : 'border-border bg-background hover:border-primary/40 hover:bg-muted/20'
    }`}
  >
    {/* Icon Container */}
    <div className="w-10 h-10 flex-shrink-0 rounded-xl border border-border bg-white overflow-hidden p-1.5 flex items-center justify-center shadow-sm">
      <PaymentIcon method={method} />
    </div>

    {/* Text Info */}
    <div className="flex-1 min-w-0 pr-2">
      <p className="font-bold text-foreground text-sm tracking-tight">{method.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{method.description}</p>
      {method.sandbox_note && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-md inline-block max-w-full truncate">
          🧪 {method.sandbox_note}
        </p>
      )}
    </div>

    {/* Radio Indicator */}
    <div
      className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5 ${
        isSelected
          ? 'border-primary bg-primary scale-110'
          : 'border-muted-foreground/30'
      }`}
    >
      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
  </button>
);

// ─── Modal Utama ──────────────────────────────────────────────────────────────
const CheckoutPaymentMethodModal = ({ isOpen, onClose, selectedMethodId, onConfirm }) => {
  // ⚡ KRUSIAL: Sinkronisasi state lokal setiap kali modal dibuka kembali
  const [tempSelected, setTempSelected] = useState(selectedMethodId || null);

  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedMethodId || null);
    }
  }, [isOpen, selectedMethodId]);

  const handleConfirm = () => {
    if (tempSelected) {
      const method = PAYMENT_METHODS.find((m) => m.id === tempSelected);
      if (method) {
        onConfirm(method); // Mengirim seluruh data object metode pembayaran ke halaman utama
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background rounded-3xl max-h-[85vh] flex flex-col shadow-2xl border border-border">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border bg-background flex-shrink-0 relative">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Metode Pembayaran
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-start gap-2.5 mt-4 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="font-medium leading-normal">
              Pembayaran aman didukung penuh oleh enkripsi **Midtrans Sandbox**.
            </span>
          </div>

          <div className="flex items-start gap-2.5 mt-2 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-xl border border-amber-100 dark:border-amber-900/30">
            <span className="mt-0.5">💡</span>
            <span className="leading-normal">
              <strong>Simulasi Sandbox</strong> — Tidak ada saldo asli dipotong. QRIS dan VA aman digunakan untuk pengujian demo tugas/mentor.
            </span>
          </div>
        </DialogHeader>

        {/* Scroll Area List Metode Pembayaran */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/5">
          {CATEGORY_ORDER.map((category) => {
            const methods = groupedMethods[category];
            if (!methods) return null;
            return (
              <div key={category} className="space-y-3">
                <p className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-widest pl-1">
                  {category}
                </p>
                <div className="space-y-2.5">
                  {methods.map((method) => (
                    <MethodCard
                      key={method.id}
                      method={method}
                      isSelected={tempSelected === method.id}
                      onSelect={setTempSelected}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action Button */}
        <div className="p-5 border-t border-border bg-background flex-shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
          <Button
            type="button"
            className="w-full btn-primary h-12 text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer"
            onClick={handleConfirm}
            disabled={!tempSelected}
          >
            Gunakan Metode Ini
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutPaymentMethodModal;