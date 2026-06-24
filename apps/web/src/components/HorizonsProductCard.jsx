import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart.js';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square w-full relative bg-muted">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-sm mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-primary text-base">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
          <button 
            onClick={() => addToCart(product)}
            className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors active:scale-95"
            aria-label="Tambah ke Keranjang"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;