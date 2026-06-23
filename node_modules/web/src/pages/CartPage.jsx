
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CheckoutProtectionModal from '@/components/CheckoutProtectionModal.jsx';
import { getCart, updateItemQuantity, removeItemFromCart } from '@/lib/cartUtils.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingCheckoutItems, setPendingCheckoutItems] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    setCartItems(getCart());
    
    const handleCartUpdate = () => {
      setCartItems(getCart());
    };
    
    window.addEventListener('vityuu_cart_updated', handleCartUpdate);
    return () => window.removeEventListener('vityuu_cart_updated', handleCartUpdate);
  }, []);

  const handleUpdateQuantity = (id, delta) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        updateItemQuantity(id, newQuantity);
      }
    }
  };

  const handleRemoveItem = (id) => {
    removeItemFromCart(id);
    toast.success('Produk dihapus dari keranjang');
  };

  const handleCheckoutSingle = (id) => {
    if (!currentUser) {
      setPendingCheckoutItems([id]);
      setShowAuthModal(true);
      return;
    }
    navigate(`/checkout?items=${id}`);
  };

  const handleCheckoutAll = () => {
    if (cartItems.length === 0) return;
    const allIds = cartItems.map(item => item.id).join(',');
    
    if (!currentUser) {
      setPendingCheckoutItems(cartItems.map(item => item.id));
      setShowAuthModal(true);
      return;
    }
    navigate(`/checkout?items=${allIds}`);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      <Helmet>
        <title>Keranjang Belanja | Vityuu</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-10" style={{ letterSpacing: '-0.02em' }}>
              Keranjang Belanja
            </h1>

            {cartItems.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-3xl border border-border shadow-sm">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Keranjang Kosong</h2>
                <p className="text-muted-foreground mb-8">Belum ada produk di keranjang Anda.</p>
                <Link to="/shop">
                  <Button className="btn-primary px-8 h-12">Lanjut Belanja</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-6">
                  {/* Desktop Table Header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 rounded-xl border border-border text-sm font-bold text-muted-foreground">
                    <div className="col-span-5">Produk</div>
                    <div className="col-span-2 text-center">Harga</div>
                    <div className="col-span-2 text-center">Kuantitas</div>
                    <div className="col-span-3 text-right">Subtotal</div>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                          
                          {/* Product Info */}
                          <div className="col-span-5 flex items-center gap-4 w-full">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted/30 rounded-xl p-2 flex-shrink-0 border border-border/50">
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 leading-snug">{item.name}</h3>
                              {item.variant && <p className="text-xs text-muted-foreground mt-1">Variasi: {item.variant}</p>}
                            </div>
                          </div>

                          {/* Price (Desktop) */}
                          <div className="col-span-2 hidden md:block text-center">
                            <p className="font-medium text-foreground">Rp {item.price.toLocaleString('id-ID')}</p>
                          </div>

                          {/* Quantity & Mobile Price */}
                          <div className="col-span-2 flex items-center justify-between md:justify-center w-full md:w-auto">
                            <div className="md:hidden font-bold text-primary">
                              Rp {item.price.toLocaleString('id-ID')}
                            </div>
                            <div className="flex items-center border border-border rounded-lg bg-background">
                              <button onClick={() => handleUpdateQuantity(item.id, -1)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Minus className="w-4 h-4" /></button>
                              <span className="w-10 text-center font-medium text-foreground text-sm">{item.quantity}</span>
                              <button onClick={() => handleUpdateQuantity(item.id, 1)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Plus className="w-4 h-4" /></button>
                            </div>
                          </div>

                          {/* Subtotal & Actions */}
                          <div className="col-span-3 flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground md:hidden mb-1">Subtotal</p>
                              <p className="font-bold text-foreground text-lg">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                            </div>
                          </div>
                        </div>

                        {/* Item Actions */}
                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-end gap-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Hapus
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleCheckoutSingle(item.id)}
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                          >
                            <CreditCard className="w-4 h-4 mr-2" /> Checkout Item Ini
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4">
                  <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 sticky top-28 shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-6">Ringkasan Belanja</h3>
                    
                    <div className="space-y-4 mb-6 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Total Item</span>
                        <span className="text-foreground font-medium">{totalItems} Produk</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Total Harga</span>
                        <span className="text-foreground font-medium">Rp {totalPrice.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-4 mb-8">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground text-lg">Total</span>
                        <span className="font-extrabold text-2xl text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button onClick={handleCheckoutAll} className="w-full btn-primary h-14 text-base shadow-md">
                        Checkout Semua ({totalItems})
                      </Button>
                      <Link to="/shop" className="block">
                        <Button variant="outline" className="w-full h-14 text-base">
                          Lanjut Belanja
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>

      <CheckoutProtectionModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={() => {
          setShowAuthModal(false);
          if (pendingCheckoutItems.length > 0) {
            navigate(`/checkout?items=${pendingCheckoutItems.join(',')}`);
          }
        }}
      />
    </>
  );
};

export default CartPage;
