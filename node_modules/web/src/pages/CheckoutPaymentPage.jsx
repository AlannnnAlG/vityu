import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ChevronRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { getCart, clearCart } from '@/lib/cartUtils.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

import AddressSection from '@/components/AddressSection.jsx';
import OrderItemsTable from '@/components/OrderItemsTable.jsx';
import PriceSummarySection from '@/components/PriceSummarySection.jsx';
import CheckoutPaymentMethodModal from '@/components/CheckoutPaymentMethodModal.jsx';

// ─── Load Midtrans Snap.js ────────────────────────────────────────────────────
// Langsung mulai load saat module di-import, bukan tunggu component mount
const snapScriptPromise = (() => {
  if (typeof window === 'undefined') return Promise.resolve();
  return new Promise((resolve) => {
    if (window.snap) return resolve();
    const existing = document.querySelector('script[src*="midtrans"]');
    if (existing) { existing.addEventListener('load', resolve); return; }
    const script = document.createElement('script');
    const isProd = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true';
    script.src = isProd
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });
})();

const shippingCost = 15000; // konstanta di luar komponen, tidak perlu re-create

const CheckoutPaymentPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  // ─── Effect 1: Load cart items (tidak bergantung currentUser) ──────────────
  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    setCartItems(items);

    const calcSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const calcDiscount = calcSubtotal > 500000 ? 50000 : 0;
    setSubtotal(calcSubtotal);
    setDiscount(calcDiscount);
    setTotal(calcSubtotal + shippingCost - calcDiscount);

    setLoading(false);
  }, []); // hanya jalan sekali saat mount

  // ─── Effect 2: Set address dari currentUser (terpisah) ────────────────────
  useEffect(() => {
    if (!currentUser) return; // tunggu currentUser ready
    setAddress({
      name: currentUser.nama_lengkap || 'Pelanggan',
      phone: currentUser.nomor_telepon || '081234567890',
      fullAddress: currentUser.alamat
        ? `${currentUser.alamat}, ${currentUser.kota}, ${currentUser.provinsi} ${currentUser.kode_pos}`
        : 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 12190',
      label: 'Rumah',
    });
  }, [currentUser?.id]); // hanya re-run kalau user ID berubah, bukan tiap render

  // ─── Simpan order ke PocketBase ───────────────────────────────────────────
  const createOrder = async (nomorPesanan) => {
    const orderRecord = await pb.collection('orders').create({
      nomor_pesanan: nomorPesanan,
      user_id: currentUser?.id || '',
      items: JSON.stringify(cartItems),
      total_harga: total,
      status_pesanan: 'pending',
      status_pembayaran: paymentMethod.id === 'cod' ? 'pending' : 'waiting_payment',
      alamat_pengiriman: address.fullAddress,
      kurir_pengiriman: 'Reguler (JNE/Sicepat)',
      metode_pembayaran: paymentMethod.name,
    }, { $autoCancel: false });

    // ✅ Update stok PARALEL, bukan sequential satu-satu
    await Promise.allSettled(
      cartItems.map(async (item) => {
        try {
          const product = await pb.collection('products').getOne(item.productId, { $autoCancel: false });
          await pb.collection('products').update(item.productId, {
            stok: Math.max(0, product.stok - item.quantity),
          }, { $autoCancel: false });
        } catch (e) {
          console.warn(`Gagal update stok ${item.productId}:`, e.message);
        }
      })
    );

    return orderRecord;
  };

  // ─── Simpan info ke localStorage ─────────────────────────────────────────
  const saveSession = (nomorPesanan) => {
    // Batch semua localStorage.setItem sekaligus
    const sessionData = {
      vityuu_order_id: nomorPesanan,
      vityuu_checkout_shipping: JSON.stringify({
        fullName: address.name,
        address: address.fullAddress,
        email: currentUser?.email || 'guest@example.com',
      }),
      vityuu_checkout_delivery: JSON.stringify({ name: 'Reguler', eta: '2-3 Hari Kerja' }),
      vityuu_checkout_payment: JSON.stringify({ name: paymentMethod.name }),
      vityuu_checkout_total: total.toString(),
    };
    Object.entries(sessionData).forEach(([k, v]) => localStorage.setItem(k, v));
  };

  // ─── Panggil Backend API ──────────────────────────────────────────────────
  const callCreateTransaction = async (nomorPesanan) => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const token = pb.authStore.token;

    const itemDetails = [
      ...cartItems.map(item => ({
        id: item.productId || item.id || 'item',
        price: Math.round(item.price),
        quantity: item.quantity,
        name: (item.name || 'Produk').substring(0, 50),
      })),
      { id: 'shipping', price: shippingCost, quantity: 1, name: 'Ongkos Kirim' },
      ...(discount > 0 ? [{ id: 'discount', price: -discount, quantity: 1, name: 'Diskon' }] : []),
    ];

    const res = await fetch(`${apiBase}/payment/create-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: nomorPesanan,
        amount: total,
        payment_method: paymentMethod.id,
        customer_details: {
          first_name: address.name,
          email: currentUser?.email || 'guest@vityuu.com',
          phone: address.phone,
        },
        item_details: itemDetails,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    return res.json();
  };

  // ─── Main: Buat Pesanan ───────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!address) return toast.error('Silakan pilih alamat pengiriman');
    if (!paymentMethod) return toast.error('Silakan pilih metode pembayaran');
    if (!termsAccepted) return toast.error('Anda harus menyetujui Ketentuan Penggunaan');

    setSubmitting(true);

    try {
      const nomorPesanan = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // ✅ Jalankan createOrder & saveSession bersamaan dengan snap script load
      const [orderRecord] = await Promise.all([
        createOrder(nomorPesanan),
        snapScriptPromise, // pastikan snap.js sudah siap
      ]);

      saveSession(nomorPesanan);

      // COD → langsung sukses
      if (paymentMethod.id === 'cod') {
        await callCreateTransaction(nomorPesanan).catch(e => console.warn('COD record error:', e.message));
        clearCart();
        navigate('/checkout/success');
        return;
      }

      // Non-COD → Buat transaksi Midtrans
      toast.loading('Menyiapkan pembayaran...', { id: 'pay-load' });

      const data = await callCreateTransaction(nomorPesanan);
      toast.dismiss('pay-load');

      if (!data.success || !data.snap_token) {
        throw new Error(data.error || 'Snap token tidak diterima');
      }

      if (window.snap) {
        window.snap.pay(data.snap_token, {
          onSuccess: () => { clearCart(); navigate('/checkout/success'); },
          onPending: () => {
            clearCart();
            localStorage.setItem('vityuu_payment_pending', 'true');
            navigate('/checkout/success');
          },
          onError: (result) => {
            console.error('Midtrans error:', result);
            toast.error('Pembayaran gagal. Silakan coba lagi.');
            setSubmitting(false);
          },
          onClose: () => {
            toast.info('Jendela pembayaran ditutup. Pesanan masih tersimpan.');
            setSubmitting(false);
          },
        });
      } else if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        throw new Error('Midtrans Snap tidak tersedia');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast.dismiss('pay-load');
      toast.error(error.message || 'Gagal membuat pesanan. Silakan coba lagi.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Checkout | Vityuu</title></Helmet>

      <div className="min-h-screen bg-muted/30 pb-24 md:pb-12">
        {/* Header */}
        <header className="bg-background border-b border-border sticky top-0 z-40">
          <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
            <button onClick={() => navigate('/cart')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-bold text-foreground ml-4">Checkout</h1>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          <AddressSection address={address} onEdit={() => toast.info('Fitur ubah alamat akan segera hadir')} />
          <OrderItemsTable items={cartItems} />

          {/* Metode Pembayaran */}
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground text-lg">Metode Pembayaran</h3>
            </div>

            {paymentMethod ? (
              <div
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex items-center justify-between p-4 rounded-2xl border border-border bg-muted/20 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-background rounded-lg border border-border p-1.5 flex items-center justify-center">
                    {paymentMethod.icon
                      ? <img src={paymentMethod.icon} alt="" className="w-full h-full object-contain" />
                      : <CreditCard className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{paymentMethod.name}</p>
                    <p className="text-xs text-muted-foreground">{paymentMethod.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ) : (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-dashed border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
              >
                <span className="font-bold text-sm">Pilih Metode Pembayaran</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {paymentMethod && paymentMethod.id !== 'cod' && (
              <p className="mt-3 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-xl">
                🔒 Pembayaran aman diproses oleh Midtrans Payment Gateway
              </p>
            )}
          </div>

          <PriceSummarySection subtotal={subtotal} shipping={shippingCost} discount={discount} total={total} />

          <div className="flex items-start space-x-3 px-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={setTermsAccepted}
              className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              Dengan membuat pesanan, Anda menyetujui{' '}
              <a href="#" className="text-primary hover:underline">Ketentuan Penggunaan</a> dan{' '}
              <a href="#" className="text-primary hover:underline">Kebijakan Privasi</a> Vityuu.
            </label>
          </div>
        </main>

        {/* Tombol Buat Pesanan */}
        <div className="fixed bottom-0 left-0 w-full bg-background border-t border-border p-4 z-40">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Pembayaran</p>
              <p className="text-xl font-extrabold text-primary">Rp {total.toLocaleString('id-ID')}</p>
            </div>
            <Button
              onClick={handlePlaceOrder}
              disabled={submitting || !paymentMethod || !termsAccepted}
              className="btn-primary h-12 px-8 text-base flex-1 md:flex-none md:min-w-[180px]"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {submitting ? 'Memproses...' : 'Buat Pesanan'}
            </Button>
          </div>
        </div>
      </div>

      <CheckoutPaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedMethodId={paymentMethod?.id}
        onConfirm={setPaymentMethod}
      />
    </>
  );
};

export default CheckoutPaymentPage;