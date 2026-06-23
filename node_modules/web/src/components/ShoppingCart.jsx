import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('vityuu_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vityuu_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (productId, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setCartItems((items) => items.filter((item) => item.id !== productId));
    toast('Item removed from cart');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast('Your cart is empty');
      return;
    }
    toast('Checkout feature coming soon');
    setIsOpen(false);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-all duration-200">
          <ShoppingBag className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping cart</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-6">Add some products to get started</p>
              <Button onClick={() => setIsOpen(false)} className="btn-primary">
                Continue shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-muted rounded-xl p-4 flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-accent"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{item.name}</h4>
                      <p className="text-sm text-primary font-semibold">${item.price}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-destructive/10 rounded transition-all duration-200"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                      <div className="flex items-center space-x-2 bg-background rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-muted rounded transition-all duration-200"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-muted rounded transition-all duration-200"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 mt-6 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">${getTotalPrice()}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full btn-primary">
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;

export const addToCart = (product) => {
  const savedCart = localStorage.getItem('vityuu_cart');
  const currentCart = savedCart ? JSON.parse(savedCart) : [];
  
  const existingItem = currentCart.find((item) => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    currentCart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem('vityuu_cart', JSON.stringify(currentCart));
  toast('Added to cart');
  
  window.dispatchEvent(new Event('storage'));
};