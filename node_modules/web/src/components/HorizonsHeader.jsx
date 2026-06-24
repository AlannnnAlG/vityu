import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart.js';
import { useUserName } from '@/hooks/useUserName.js';

const Header = () => {
  const { getCartCount } = useCart();
  const [userName] = useUserName();
  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[390px] h-[60px] bg-background/95 backdrop-blur border-b flex items-center px-4 justify-between">
      <Link to="/" className="flex items-center gap-3">
        <img 
          src="https://horizons-cdn.hostinger.com/f4f43ded-dd69-4e09-8ef1-f3407f7ad1fe/2134ddc59e642a28f0800b1725e08b47.png" 
          alt="Vityu Logo" 
          className="h-8 w-8 object-contain rounded-xl"
        />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">Halo,</span>
          <span className="font-bold text-sm text-foreground leading-none">{userName}!</span>
        </div>
      </Link>
      
      <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors active:scale-95">
        <ShoppingBag className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background">
            {cartCount}
          </span>
        )}
      </Link>
    </header>
  );
};

export default Header;