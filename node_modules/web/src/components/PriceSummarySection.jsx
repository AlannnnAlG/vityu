
import React from 'react';

const PriceSummarySection = ({ subtotal, shipping, discount, total }) => {
  return (
    <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
      <h3 className="font-bold text-foreground text-lg mb-5">Rincian Pembayaran</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal Produk</span>
          <span className="font-medium text-foreground">Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal Pengiriman</span>
          <span className="font-medium text-foreground">Rp {shipping.toLocaleString('id-ID')}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-secondary font-medium">
            <span>Diskon</span>
            <span>- Rp {discount.toLocaleString('id-ID')}</span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-5 border-t border-dashed border-border">
        <div className="flex justify-between items-center">
          <span className="font-bold text-foreground text-base">Total Pembayaran</span>
          <span className="font-extrabold text-2xl text-primary">Rp {total.toLocaleString('id-ID')}</span>
        </div>
        {discount > 0 && (
          <p className="text-xs text-right text-secondary mt-1 font-medium">
            Anda hemat Rp {discount.toLocaleString('id-ID')}!
          </p>
        )}
      </div>
    </div>
  );
};

export default PriceSummarySection;
