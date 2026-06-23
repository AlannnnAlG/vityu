import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const CheckoutProcessingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent leaving
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Simulate processing
    const timer = setTimeout(() => {
      // Generate Order ID
      const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
      const orderId = `#VIT-2025-${randomStr}`;
      localStorage.setItem('vityuu_order_id', orderId);
      
      // Clear cart
      localStorage.removeItem('vityuu_cart');
      window.dispatchEvent(new Event('vityuu_cart_updated'));

      navigate('/checkout/success');
    }, 3000);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Memproses... | Vityuu</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative w-32 h-32 mx-auto mb-8">
            <motion.div 
              className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="bg-card w-full h-full rounded-full border border-border flex items-center justify-center relative z-10 shadow-lg">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          </div>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-foreground mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Memproses pembayaran Anda...
          </motion.h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            Mohon jangan tutup atau muat ulang halaman ini. Kami sedang mengamankan transaksi Anda.
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default CheckoutProcessingPage;