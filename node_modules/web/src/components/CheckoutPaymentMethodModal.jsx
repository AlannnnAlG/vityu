
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, X } from 'lucide-react';
import PaymentMethodCard from './PaymentMethodCard.jsx';

const PAYMENT_METHODS = [
  { id: 'cod', name: 'Bayar di Tempat (COD)', description: 'Bayar tunai saat pesanan tiba', icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/cod-icon.png' },
  { id: 'va_bca', name: 'BCA Virtual Account', description: 'Dicek otomatis', icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/bca-icon.png' },
  { id: 'va_mandiri', name: 'Mandiri Virtual Account', description: 'Dicek otomatis', icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/mandiri-icon.png' },
  { id: 'qris', name: 'QRIS', description: 'Gopay, Dana, ShopeePay, dll', icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/qris-icon.png' },
  { id: 'dana', name: 'DANA', description: 'Hubungkan akun DANA', icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/dana-icon.png' },
  { id: 'ovo', name: 'OVO', description: 'Hubungkan akun OVO', icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/ovo-icon.png' },
  { id: 'cc', name: 'Kartu Kredit / Debit', description: 'Visa, Mastercard, JCB', icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/cc-icon.png' },
  { id: 'paylater', name: 'Vityuu PayLater', description: 'Beli sekarang, bayar nanti', installment: 'Tersedia cicilan hingga 12x', icon: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/paylater-icon.png' },
];

const CheckoutPaymentMethodModal = ({ isOpen, onClose, selectedMethodId, onConfirm }) => {
  const [tempSelected, setTempSelected] = useState(selectedMethodId);

  const handleConfirm = () => {
    if (tempSelected) {
      const method = PAYMENT_METHODS.find(m => m.id === tempSelected);
      onConfirm(method);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background rounded-3xl">
        <DialogHeader className="p-6 pb-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Metode Pembayaran</DialogTitle>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-2.5 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium">Informasi Anda aman dan terenkripsi</span>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <PaymentMethodCard 
              key={method.id}
              method={method}
              isSelected={tempSelected === method.id}
              onSelect={setTempSelected}
            />
          ))}
        </div>

        <div className="p-6 border-t border-border bg-background sticky bottom-0">
          <Button 
            className="w-full btn-primary h-14 text-lg" 
            onClick={handleConfirm}
            disabled={!tempSelected}
          >
            Lanjutkan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutPaymentMethodModal;
