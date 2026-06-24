import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle, Clock, Package, Calendar, CreditCard,
  MapPin, ArrowRight, ShoppingBag, Phone, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const orderId  = localStorage.getItem('vityuu_order_id');
    const pending  = localStorage.getItem('vityuu_payment_pending') === 'true';
    const total    = parseInt(localStorage.getItem('vityuu_checkout_total') || '0', 10);

    if (!orderId) { navigate('/'); return; }

    // ── Baca shipping — CheckoutPage menyimpan field individual ──
    const nama      = localStorage.getItem('vityuu_shipping_nama')     || '';
    const telepon   = localStorage.getItem('vityuu_shipping_telepon')  || '';
    const alamat    = localStorage.getItem('vityuu_shipping_alamat')   || '';
    const kota      = localStorage.getItem('vityuu_shipping_kota')     || '';
    const provinsi  = localStorage.getItem('vityuu_shipping_provinsi') || '';
    const kode_pos  = localStorage.getItem('vityuu_shipping_kode_pos') || '';

    // ── Baca payment ──
    let payment = null;
    try {
      payment = JSON.parse(localStorage.getItem('vityuu_checkout_payment') || 'null');
    } catch { /* noop */ }

    // ── Baca item cart yang di-checkout ──
    let cartItems = [];
    try {
      const raw = localStorage.getItem('vityuu_last_checkout_items');
      if (raw) cartItems = JSON.parse(raw);
    } catch { /* noop */ }

    setItems(cartItems);
    setIsPending(pending);
    setOrderDetails({
      id: orderId,
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      total,
      payment,
      shipping: { nama, telepon, alamat, kota, provinsi, kode_pos },
    });

    // Bersihkan session setelah 2 detik
    const t = setTimeout(() => {
      [
        'vityuu_checkout_shipping', 'vityuu_checkout_payment', 'vityuu_checkout_total',
        'vityuu_payment_pending',   'vityuu_shipping_nama',    'vityuu_shipping_telepon',
        'vityuu_shipping_alamat',   'vityuu_shipping_kota',    'vityuu_shipping_provinsi',
        'vityuu_shipping_kode_pos', 'vityuu_last_checkout_items',
      ].forEach(k => localStorage.removeItem(k));
    }, 2000);
    return () => clearTimeout(t);
  }, [navigate]);

  if (!orderDetails) return null;

  const { shipping, payment, id, date, total } = orderDetails;
  const hasAddress = shipping.nama || shipping.alamat;

  // Subtotal produk (total dikurangi ongkir Rp15.000)
  const subtotal = total - 15000;

  return (
    <>
      <Helmet>
        <title>{isPending ? 'Menunggu Pembayaran' : 'Pesanan Berhasil'} | Vityuu</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 flex flex-col">
        <Header />

        <main className="flex-grow py-10 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">

            {/* ── Hero: ikon + judul ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="relative inline-block mb-6">
                <motion.div
                  className={`absolute inset-0 rounded-full blur-[48px] ${isPending ? 'bg-amber-400/25' : 'bg-primary/20'}`}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
                <motion.div
                  initial={{ scale: 0, rotate: -160 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center relative z-10 mx-auto shadow-xl ${
                    isPending ? 'bg-amber-400 text-white' : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {isPending ? <Clock className="w-12 h-12" /> : <CheckCircle className="w-12 h-12" />}
                </motion.div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3" style={{ letterSpacing: '-0.03em' }}>
                {isPending ? 'Menunggu Pembayaran' : 'Pesanan Berhasil! 🎉'}
              </h1>
              <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                {isPending
                  ? 'Pesanan kamu sudah tersimpan. Selesaikan pembayaran sesuai instruksi yang diberikan.'
                  : 'Terima kasih telah berbelanja di Vityuu. Pesanan kamu sedang kami proses dan akan segera dikirim.'}
              </p>

              {isPending && (
                <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium border border-amber-200">
                  <Clock className="w-4 h-4" />
                  Status diperbarui otomatis setelah pembayaran dikonfirmasi
                </div>
              )}
            </motion.div>

            {/* ── Produk yang dibeli ── */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm mb-6"
              >
                <div className="px-6 pt-6 pb-4 border-b border-border">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                    Produk yang Dibeli
                  </h3>
                </div>

                <div className="divide-y divide-border">
                  {items.map((item, idx) => (
                    <div key={item.id ?? idx} className="flex items-center gap-4 px-6 py-4">
                      {/* Gambar produk */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Package className="w-6 h-6" />
                            </div>
                        }
                      </div>

                      {/* Info produk */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.quantity} pcs × Rp {item.price?.toLocaleString('id-ID')}
                        </p>
                      </div>

                      {/* Subtotal item */}
                      <p className="font-bold text-sm text-foreground flex-shrink-0">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Ringkasan harga */}
                <div className="px-6 py-4 bg-muted/40 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal produk</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Ongkos kirim</span>
                    <span>Rp 15.000</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-base text-foreground pt-2 border-t border-border">
                    <span>Total Pembayaran</span>
                    <span className="text-primary">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Detail pesanan ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm mb-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <h3 className="text-base font-bold text-foreground">Detail Pesanan</h3>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  isPending
                    ? 'text-amber-600 bg-amber-100'
                    : 'text-primary bg-primary/10'
                }`}>
                  {isPending ? 'Menunggu Bayar' : 'Diproses'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nomor pesanan */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Nomor Pesanan</p>
                    <p className="font-bold text-sm text-foreground font-mono">{id}</p>
                  </div>
                </div>

                {/* Tanggal */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Tanggal</p>
                    <p className="font-medium text-sm text-foreground">{date}</p>
                  </div>
                </div>

                {/* Metode pembayaran */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Metode Pembayaran</p>
                    <p className="font-medium text-sm text-foreground">{payment?.name || '-'}</p>
                  </div>
                </div>

                {/* Nomor telepon */}
                {shipping.telepon && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold mb-1">No. Telepon</p>
                      <p className="font-medium text-sm text-foreground">{shipping.telepon}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Alamat pengiriman — full width */}
              {hasAddress && (
                <div className="mt-5 pt-5 border-t border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Alamat Pengiriman</p>
                      <p className="font-bold text-sm text-foreground">{shipping.nama}</p>
                      {shipping.alamat && (
                        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{shipping.alamat}</p>
                      )}
                      {(shipping.kota || shipping.provinsi || shipping.kode_pos) && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {[shipping.kota, shipping.provinsi, shipping.kode_pos].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── Info estimasi pengiriman ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-8 flex items-center gap-3"
            >
              <Home className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-bold">Estimasi tiba 2–4 hari kerja.</span>{' '}
                Kamu akan mendapat notifikasi via WhatsApp saat paket dikirim.
              </p>
            </motion.div>

            {/* ── Tombol aksi ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link to="/orders" className="w-full sm:w-auto sm:flex-1">
                <Button variant="outline" className="w-full h-14 px-6 text-sm font-bold rounded-2xl">
                  <Package className="w-4 h-4 mr-2" />
                  Lihat Pesanan Saya
                </Button>
              </Link>
              <Link to="/shop" className="w-full sm:w-auto sm:flex-1">
                <Button className="btn-primary w-full h-14 px-6 text-sm rounded-2xl">
                  Lanjut Belanja
                  <ArrowRight className="ml-2 w-4 h-4" />
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