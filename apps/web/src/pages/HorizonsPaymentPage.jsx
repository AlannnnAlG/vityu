import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, QrCode, CreditCard, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import CheckoutSteps from '@/components/CheckoutSteps.jsx';

const PaymentPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [checkoutData] = useLocalStorage('vityu_checkout', {});
  const [orders, setOrders] = useLocalStorage('vityu_orders', []);
  const [method, setMethod] = useState('qris');

  useEffect(() => {
    if (cart.length === 0 || !checkoutData.shipping) {
      navigate('/cart');
    }
  }, [cart, checkoutData, navigate]);

  if (cart.length === 0 || !checkoutData.shipping) return null;

  const subtotal = getCartTotal();
  const shippingCost = checkoutData.shipping.cost;
  const total = subtotal + shippingCost;

  const handlePayment = () => {
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      date: new Date().toISOString(),
      items: cart,
      shipping: checkoutData.shipping,
      paymentMethod: method,
      subtotal,
      total,
      status: 'Proses'
    };

    setOrders([newOrder, ...orders]);
    clearCart();
    // Pass order ID via route state or let success page read latest
    navigate('/checkout/success', { state: { orderId: newOrder.id } });
  };

  return (
    <>
      <Helmet>
        <title>Vityu - Pembayaran</title>
      </Helmet>

      <div className="w-full flex flex-col p-4 gap-6 pb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <button onClick={() => navigate('/checkout/shipping')} className="p-2 -ml-2 text-foreground hover:bg-muted rounded-xl transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">Pembayaran</h1>
        </motion.div>

        <CheckoutSteps currentStep={3} />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">
          <div className="bg-card border rounded-3xl p-5 shadow-sm flex flex-col gap-3">
            <h2 className="font-bold text-lg mb-1">Pilih Metode</h2>
            
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setMethod('qris')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${method === 'qris' ? 'border-primary bg-primary/10 text-foreground' : 'border-muted text-muted-foreground'}`}
              >
                <QrCode className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold uppercase">QRIS</span>
              </button>
              <button 
                onClick={() => setMethod('bank')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${method === 'bank' ? 'border-primary bg-primary/10 text-foreground' : 'border-muted text-muted-foreground'}`}
              >
                <CreditCard className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold uppercase">Transfer</span>
              </button>
              <button 
                onClick={() => setMethod('ewallet')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${method === 'ewallet' ? 'border-primary bg-primary/10 text-foreground' : 'border-muted text-muted-foreground'}`}
              >
                <Wallet className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold uppercase">E-Wallet</span>
              </button>
            </div>
            
            {method === 'qris' && (
              <div className="mt-4 p-6 bg-muted/30 border border-dashed rounded-2xl flex flex-col items-center text-center">
                <div className="w-40 h-40 bg-white p-2 rounded-xl shadow-sm mb-4">
                  {/* Dummy QR placeholder */}
                  <img src="https://horizons-cdn.hostinger.com/f4f43ded-dd69-4e09-8ef1-f3407f7ad1fe/d4cd30f57dff65a9baeaeeab7574b125.png" alt="QRIS" className="w-full h-full object-contain mix-blend-multiply" style={{ filter: "brightness(0)" }} />
                </div>
                <p className="text-sm font-bold text-foreground">Scan QRIS dengan aplikasi pembayaran Anda</p>
                <p className="text-xs text-muted-foreground mt-1">OVO, GoPay, Dana, LinkAja, BCA, dll.</p>
              </div>
            )}
          </div>

          <div className="bg-card border rounded-3xl p-5 shadow-sm flex flex-col gap-2">
            <h2 className="font-bold text-lg mb-2">Ringkasan</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal Produk</span>
              <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ongkos Kirim ({checkoutData.shipping.courierName})</span>
              <span className="font-semibold">Rp {shippingCost.toLocaleString('id-ID')}</span>
            </div>
            <div className="h-[1px] w-full bg-border my-2" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">Total Pembayaran</span>
              <span className="text-xl font-extrabold text-primary">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button 
            onClick={handlePayment}
            className="w-full min-h-[48px] bg-primary text-primary-foreground font-bold rounded-xl active:scale-[0.98] transition-all shadow-sm mt-2"
          >
            Saya Sudah Membayar
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default PaymentPage;