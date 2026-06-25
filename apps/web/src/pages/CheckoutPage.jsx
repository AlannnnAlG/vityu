import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, CreditCard, MapPin, Tag, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { getCart, clearCheckedOutItems } from '@/lib/cartUtils.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiClient from '@/lib/apiServerClient.js';
import { validateStreakVoucherCode } from '@/utils/streakVouchers.js';

const PAYMENT_METHODS = [
  { id: 'bca', name: 'BCA Virtual Account' },
  { id: 'mandiri', name: 'Mandiri Virtual Account' },
  { id: 'qris', name: 'QRIS' },
  { id: 'gopay', name: 'GoPay' },
  { id: 'cc', name: 'Kartu Kredit / Debit' },
];

const injectMidtransSnapScript = () => {
  return new Promise((resolve, reject) => {
    if (window.snap) { resolve(window.snap); return; }
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'SB-Mid-client-GANTI_DENGAN_KEY_KAMU');
    script.onload = () => resolve(window.snap);
    script.onerror = () => reject(new Error('Gagal load script Midtrans'));
    document.head.appendChild(script);
  });
};

const SHIPPING_COST = 15000;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: '', nomor_telepon: '', alamat: '',
    kota: '', provinsi: '', kode_pos: '',
  });
  const [selectedPayment, setSelectedPayment] = useState('');
  const [subtotal, setSubtotal] = useState(0);

  // ── State Kupon ──
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount, title }
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const itemsParam = searchParams.get('items');
    if (!itemsParam) { navigate('/cart'); return; }

    const itemIdsToCheckout = itemsParam.split(',');
    const allCartItems = getCart();
    const itemsToProcess = allCartItems.filter((item) =>
      itemIdsToCheckout.includes(item.id)
    );

    if (itemsToProcess.length === 0) { navigate('/cart'); return; }

    setCheckoutItems(itemsToProcess);
    const calcSubtotal = itemsToProcess.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(calcSubtotal);

    if (currentUser) {
      setFormData({
        nama_lengkap: currentUser.nama_lengkap || '',
        nomor_telepon: currentUser.nomor_telepon || '',
        alamat: currentUser.alamat || '',
        kota: currentUser.kota || '',
        provinsi: currentUser.provinsi || '',
        kode_pos: currentUser.kode_pos || '',
      });
    }
    setLoading(false);
  }, [location, navigate, currentUser]);

  // ── Kalkulasi total dengan diskon ──
  const discountAmount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.discount) / 100)
    : 0;
  const total = subtotal + SHIPPING_COST - discountAmount;

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponInput.trim()) return;
    setCouponLoading(true);

    setTimeout(() => {
      const result = validateStreakVoucherCode(couponInput);
      if (result.valid) {
        setAppliedCoupon({
          code: couponInput.toUpperCase().trim(),
          discount: result.discount,
          title: result.voucher.title,
        });
        toast.success(result.message);
        setCouponInput('');
      } else {
        setCouponError(result.message);
        toast.error(result.message);
      }
      setCouponLoading(false);
    }, 400);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    toast.info('Kupon dihapus');
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) { toast.error('Pilih metode pembayaran!'); return; }
    if (!formData.nama_lengkap.trim()) { toast.error('Nama lengkap wajib diisi!'); return; }
    if (!formData.alamat.trim()) { toast.error('Alamat wajib diisi!'); return; }
    if (!formData.nomor_telepon.trim()) { toast.error('Nomor telepon wajib diisi!'); return; }

    setSubmitting(true);
    const internalOrderId = `ORD-${Date.now()}`;

    try {
      const shippingData = {
        nama: formData.nama_lengkap.trim(),
        telepon: formData.nomor_telepon.trim(),
        alamat: formData.alamat.trim(),
        kota: formData.kota.trim() || '-',
        provinsi: formData.provinsi.trim() || '-',
        kode_pos: formData.kode_pos.trim() || '-',
        total,
      };

      // ── SIMPAN DI LOCAL STORAGE ──
      localStorage.setItem('vityuu_order_id', internalOrderId);
      localStorage.setItem('vityuu_shipping_nama', shippingData.nama);
      localStorage.setItem('vityuu_shipping_telepon', shippingData.telepon);
      localStorage.setItem('vityuu_shipping_alamat', shippingData.alamat);
      localStorage.setItem('vityuu_shipping_kota', shippingData.kota);
      localStorage.setItem('vityuu_shipping_provinsi', shippingData.provinsi);
      localStorage.setItem('vityuu_shipping_kode_pos', shippingData.kode_pos);
      localStorage.setItem('vityuu_checkout_total', total.toString());
      localStorage.setItem(
        'vityuu_checkout_payment',
        JSON.stringify(PAYMENT_METHODS.find((m) => m.id === selectedPayment))
      );
      localStorage.setItem(
        'vityuu_last_checkout_items',
        JSON.stringify(checkoutItems)
      );
      if (appliedCoupon) {
        localStorage.setItem('vityuu_applied_coupon', JSON.stringify(appliedCoupon));
      }

      // ── BUAT TRANSAKSI ──
      const response = await apiClient.post('/payment/create-transaction', {
        order_id: internalOrderId,
        amount: total,
        payment_method: selectedPayment,
        customer_details: {
          first_name: formData.nama_lengkap.trim(),
          phone: formData.nomor_telepon.trim(),
        },
        item_details: checkoutItems.map((item) => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          name: item.name,
        })),
        shipping_data: shippingData,
        coupon: appliedCoupon || null,
      });

      const snapToken = response.data?.snap_token;
      if (!snapToken) throw new Error('Token tidak diterima');

      const snap = await injectMidtransSnapScript();
      snap.pay(snapToken, {
        onSuccess: () => {
          clearCheckedOutItems(checkoutItems.map((i) => i.id));
          navigate('/checkout/success');
        },
        onPending: () => {
          clearCheckedOutItems(checkoutItems.map((i) => i.id));
          navigate('/checkout/success');
        },
        onClose: () => {
          toast.info('Pembayaran dibatalkan. Silakan coba lagi.');
          setSubmitting(false);
        },
      });
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Gagal membuat transaksi. Cek server backend.');
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Checkout | Vityuu</title>
      </Helmet>
      <div className="min-h-screen bg-muted/30 pb-24">
        <header className="bg-background border-b sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Checkout</h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ── Kolom kiri: form ── */}
            <div className="lg:col-span-7 space-y-6">
              {/* Alamat */}
              <div className="bg-card border p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Alamat
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={(e) =>
                      setFormData({ ...formData, nama_lengkap: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-xl border text-sm"
                    placeholder="Nama lengkap *"
                    required
                  />
                  <input
                    type="tel"
                    name="nomor_telepon"
                    value={formData.nomor_telepon}
                    onChange={(e) =>
                      setFormData({ ...formData, nomor_telepon: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-xl border text-sm"
                    placeholder="No telepon *"
                    required
                  />
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={(e) =>
                      setFormData({ ...formData, alamat: e.target.value })
                    }
                    className="sm:col-span-2 w-full p-4 rounded-xl border text-sm"
                    placeholder="Alamat lengkap *"
                    required
                    rows="3"
                  />
                  <input
                    type="text"
                    name="kota"
                    value={formData.kota}
                    onChange={(e) =>
                      setFormData({ ...formData, kota: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-xl border text-sm"
                    placeholder="Kota"
                  />
                  <input
                    type="text"
                    name="provinsi"
                    value={formData.provinsi}
                    onChange={(e) =>
                      setFormData({ ...formData, provinsi: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-xl border text-sm"
                    placeholder="Provinsi"
                  />
                  <input
                    type="text"
                    name="kode_pos"
                    value={formData.kode_pos}
                    onChange={(e) =>
                      setFormData({ ...formData, kode_pos: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-xl border text-sm"
                    placeholder="Kode Pos"
                  />
                </div>
              </div>

              {/* ── Kupon / Voucher Streak ── */}
              <div className="bg-card border p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" /> Kode Kupon
                </h2>

                {appliedCoupon ? (
                  /* Kupon sudah dipakai */
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-green-800">
                        {appliedCoupon.title}
                      </p>
                      <p className="text-xs text-green-600">
                        Kode:{' '}
                        <span className="font-mono font-bold">
                          {appliedCoupon.code}
                        </span>{' '}
                        — Hemat {appliedCoupon.discount}% (
                        {`Rp ${discountAmount.toLocaleString('id-ID')}`})
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  /* Input kupon */
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleApplyCoupon()
                        }
                        className="flex-1 h-12 px-4 rounded-xl border text-sm font-mono tracking-wider"
                        placeholder="Masukkan kode kupon streak..."
                        maxLength={20}
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="h-12 px-5 font-bold rounded-xl"
                        variant="outline"
                      >
                        {couponLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Pakai'
                        )}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> {couponError}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      💡 Dapatkan kode kupon dari halaman{' '}
                      <span className="font-bold text-primary">Rewards</span>{' '}
                      setelah mencapai streak tertentu.
                    </p>
                  </div>
                )}
              </div>

              {/* Pembayaran */}
              <div className="bg-card border p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Pembayaran
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer ${
                        selectedPayment === method.id
                          ? 'border-primary'
                          : 'border-border'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={selectedPayment === method.id}
                        onChange={() => setSelectedPayment(method.id)}
                        className="mr-3"
                      />
                      <p className="font-bold text-sm">{method.name}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Kolom kanan: ringkasan ── */}
            <div className="lg:col-span-5">
              <div className="bg-card border p-6 rounded-2xl sticky top-24">
                <h2 className="text-xl font-bold mb-6">Ringkasan</h2>
                <div className="space-y-4 mb-6">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-8 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Ongkir</span>
                    <span>Rp {SHIPPING_COST.toLocaleString('id-ID')}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                      <span>Diskon ({appliedCoupon.discount}%)</span>
                      <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-extrabold border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="w-full h-14 font-bold"
                >
                  {submitting ? 'Memproses...' : 'Buat Pesanan'}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CheckoutPage;