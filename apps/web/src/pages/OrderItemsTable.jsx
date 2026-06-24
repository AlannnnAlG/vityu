import React from 'react';
import pb from '@/lib/pocketbaseClient.js';

const OrderItemsTable = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
        <p className="text-muted-foreground text-center">Tidak ada item</p>
      </div>
    );
  }

  const totalItems = items.reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-foreground text-lg">Pesanan Anda</h3>
        <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {totalItems} Item
        </span>
      </div>

      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-muted border border-border overflow-hidden flex-shrink-0">
              {item.image ? (
                <img 
                  src={item.image.startsWith('http') ? item.image : pb.files.getURL({ id: item.productId, collectionId: 'pbc_7440446144' }, item.image)} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Img</div>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Img</div>
              )}
            </div>
            
            <div className="flex flex-col justify-between flex-grow py-1">
              <div>
                <h4 className="font-bold text-foreground text-sm md:text-base line-clamp-2 leading-snug">{item.name || 'Produk'}</h4>
                {item.variant && <p className="text-xs text-muted-foreground mt-1">Variasi: {item.variant}</p>}
              </div>
              
              <div className="flex items-end justify-between mt-2">
                <span className="text-sm font-medium text-muted-foreground">x{item.quantity || 0}</span>
                <span className="font-bold text-foreground">Rp {((item.price || 0) * (item.quantity || 0)).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemsTable;