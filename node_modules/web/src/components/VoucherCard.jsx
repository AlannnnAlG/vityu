import React from 'react';
import { Copy, Gift } from 'lucide-react';
import { toast } from 'sonner';

const VoucherCard = ({ voucher }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    toast.success(`Copied code: ${voucher.code}`);
  };

  return (
    <div className="flex items-stretch bg-card border rounded-2xl overflow-hidden shadow-sm">
      <div className="w-24 bg-secondary flex flex-col items-center justify-center p-3 text-secondary-foreground">
        <Gift className="h-6 w-6 mb-1" />
        <span className="text-xl font-bold">{voucher.discount}</span>
      </div>
      
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-foreground text-sm mb-1">{voucher.title}</h4>
          <p className="text-xs text-muted-foreground mb-3">Expires: {voucher.expiryDate}</p>
        </div>
        
        <button 
          onClick={handleCopy}
          className="flex items-center justify-between w-full bg-muted px-3 py-2 rounded-lg text-sm font-bold text-foreground hover:bg-muted/80 transition-colors active:scale-[0.98]"
        >
          <span className="font-mono tracking-wider">{voucher.code}</span>
          <Copy className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default VoucherCard;