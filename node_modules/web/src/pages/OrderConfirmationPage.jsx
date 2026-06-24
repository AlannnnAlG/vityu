import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('vityu_current_order');
    if (!id) {
      navigate('/shop');
    } else {
      setOrderId(id);
    }
  }, [navigate]);

  if (!orderId) return null;

  return (
    <>
      <Helmet>
        <title>Pesanan Berhasil - Vityu</title>
      </Helmet>

      <div className="w-full flex flex-col items-center justify-center p-6 min-h-[70vh] text-center gap-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mb-2"
        >
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-2xl font-bold">Terima Kasih!</h1>
          <p className="text-muted-foreground">Pesanan Anda Berhasil Dibuat</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full bg-card border rounded-2xl p-5 shadow-sm flex flex-col gap-4 text-left"
        >
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Order ID</p>
            <p className="font-mono font-bold text-lg">{orderId}</p>
          </div>
          <div className="h-px w-full bg-border" />
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm font-bold">Estimasi Pengiriman</p>
              <p className="text-xs text-muted-foreground">3-5 hari kerja</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full flex flex-col gap-3 mt-4"
        >
          <Link 
            to="/orders"
            className="w-full min-h-[48px] bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            Lihat Pesanan
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link 
            to="/shop"
            className="w-full min-h-[48px] bg-muted text-foreground font-bold rounded-xl flex items-center justify-center active:scale-[0.98] transition-transform"
          >
            Kembali ke Toko
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;