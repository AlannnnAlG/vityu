
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Calendar, CreditCard, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const orderId = localStorage.getItem('vityuu_order_id');
    const shipping = JSON.parse(localStorage.getItem('vityuu_checkout_shipping') || '{}');
    const payment = JSON.parse(localStorage.getItem('vityuu_checkout_payment') || '{}');
    const total = localStorage.getItem('vityuu_checkout_total') || '0';

    if (!orderId) {
      navigate('/');
      return;
    }

    setOrderDetails({
      id: orderId,
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      total: parseInt(total, 10),
      shipping,
      payment
    });

    // Cleanup checkout session
    setTimeout(() => {
      localStorage.removeItem('vityuu_checkout_shipping');
      localStorage.removeItem('vityuu_checkout_payment');
      localStorage.removeItem('vityuu_checkout_total');
    }, 1000);

  }, [navigate]);

  if (!orderDetails) return null;

  return (
    <>
      <Helmet>
        <title>Pesanan Berhasil | Vityuu</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-grow py-12 md:py-20 overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="relative inline-block mb-6">
                <motion.div 
                  className="absolute inset-0 bg-primary/20 rounded-full blur-[40px]"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                  className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center relative z-10 mx-auto shadow-xl"
                >
                  <CheckCircle className="w-12 h-12" />
                </motion.div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
                Pesanan Berhasil!
              </h1>
              <p className="text-base text-muted-foreground max-w-md mx-auto">
                Terima kasih telah berbelanja di Vityuu. Pesanan Anda sedang kami proses dan akan segera dikirim.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm mb-8"
            >
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <h3 className="text-lg font-bold text-foreground">Detail Pesanan</h3>
                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Diproses
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Nomor Pesanan</p>
                    <p className="font-bold text-foreground">{orderDetails.id}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Tanggal</p>
                    <p className="font-medium text-foreground">{orderDetails.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Metode Pembayaran</p>
                    <p className="font-medium text-foreground">{orderDetails.payment.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Pengiriman</p>
                    <p className="font-medium text-foreground">{orderDetails.shipping.fullName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{orderDetails.shipping.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-border flex justify-between items-center">
                <span className="font-bold text-foreground">Total Pembayaran</span>
                <span className="font-extrabold text-2xl text-primary">Rp {orderDetails.total.toLocaleString('id-ID')}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/orders" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-14 px-8 text-base font-bold">
                  <ShoppingBag className="w-5 h-5 mr-2" /> Lihat Pesanan Saya
                </Button>
              </Link>
              <Link to="/shop" className="w-full sm:w-auto">
                <Button className="btn-primary w-full h-14 px-8 text-base">
                  Lanjut Belanja <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CheckoutSuccessPage;
