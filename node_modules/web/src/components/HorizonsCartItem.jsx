import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart.js';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 p-4 bg-card border rounded-2xl shadow-sm">
      <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-bold text-sm line-clamp-2">{item.name}</h4>
          <button 
            onClick={() => removeFromCart(item.id)}
            className="text-muted-foreground hover:text-destructive transition-colors p-1"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary text-sm">
            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
          </span>
          <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="h-6 w-6 flex items-center justify-center rounded-md bg-background shadow-sm text-foreground active:scale-95"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="h-6 w-6 flex items-center justify-center rounded-md bg-background shadow-sm text-foreground active:scale-95"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;