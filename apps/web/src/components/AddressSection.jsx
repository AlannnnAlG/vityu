
import React from 'react';
import { MapPin, ChevronRight, Star } from 'lucide-react';

const AddressSection = ({ address, onEdit }) => {
  return (
    <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm relative overflow-hidden group">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-70" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 text-foreground font-bold">
          <MapPin className="w-5 h-5 text-primary" />
          <h3>Alamat Pengiriman</h3>
        </div>
        <button 
          onClick={onEdit}
          className="text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center"
        >
          Ubah <ChevronRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      {address ? (
        <div className="pl-7">
          <p className="font-bold text-foreground text-base mb-1">
            {address.name} <span className="text-muted-foreground font-normal ml-2">{address.phone}</span>
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {address.fullAddress}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
            <span className="text-xs font-medium text-muted-foreground">Label:</span>
            <span className="text-xs font-bold text-foreground">{address.label || 'Rumah'}</span>
          </div>
        </div>
      ) : (
        <div className="pl-7 py-2">
          <p className="text-sm text-muted-foreground mb-3">Belum ada alamat pengiriman yang dipilih.</p>
          <button onClick={onEdit} className="text-sm font-bold text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors">
            Tambah Alamat
          </button>
        </div>
      )}

      {/* Seller Rating Mock */}
      <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
          V
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Vityuu Official Store</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-foreground">4.9</span>
            <span>(10k+ Penilaian)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
