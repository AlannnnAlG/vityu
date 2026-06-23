
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, CreditCard, MapPin, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { getCart, clearCheckedOutItems } from '@/lib/cartUtils.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const PAYMENT_METHODS = [
  { id: 'va_bca', name: 'BCA Virtual Account', type: 'Transfer Bank' },
  { id: 'va_mandiri', name: 'Mandiri Virtual Account', type: 'Transfer Bank' },
  { id: 'qris', name: 'QRIS', type: 'E-Wallet' },
  { id: 'gopay', name: 'GoPay', type: 'E-Wallet' },
  { id: 'cc', name: 'Kartu Kredit / Debit', type: 'Kartu' },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nomor_telepon: '',
    alamat: '',
    kota: '',
    provinsi: '',
    kode_pos: ''
  });
  const [selectedPayment, setSelectedPayment] = useState('');

  // Pricing state
  const [subtotal, setSubtotal] = useState(0);
  const shippingCost = 15000; // Fixed mock shipping
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Parse query params
    const searchParams = new URLSearchParams(location.search);
    const itemsParam = searchParams.get('items');
    
    if (!itemsParam) {
      navigate('/cart');
      return;
    }

    const itemIdsToCheckout = itemsParam.split(',');
    const allCartItems = getCart();
    
    // Filter cart items based on query params
    const itemsToProcess = allCartItems.filter(item => itemIdsToCheckout.includes(item.id));
    
    if (itemsToProcess.length === 0) {
      toast.error('Produk tidak ditemukan di keranjang');
      navigate('/cart');
      return;
    }

    setCheckoutItems(itemsToProcess);

    // Calculate prices
    const calcSubtotal = itemsToProcess.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setSubtotal(calcSubtotal);
    setTotal(calcSubtotal + shippingCost);

    // Pre-fill address if user is logged in
    if (currentUser) {
      setFormData({
        nama_lengkap: currentUser.nama_lengkap || '',
        nomor_telepon: currentUser.nomor_telepon || '',
        alamat: currentUser.alamat || '',
        kota: currentUser.kota || '',
        provinsi: currentUser.provinsi || '',
        kode_pos: currentUser.kode_pos || ''
      });
    }

    setLoading(false);
  }, [location, navigate, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['nama_lengkap', 'nomor_telepon', 'alamat', 'kota', 'provinsi', 'kode_pos'];
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        toast.error(`Mohon lengkapi ${field.replace('_', ' ')}`);
        return false;
      }
    }
    if (!selectedPayment) {
      toast.error('Silakan pilih metode pembayaran');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const fullAddress = `${formData.alamat}, ${formData.kota}, ${formData.provinsi} ${formData.kode_pos}`;
      const paymentMethodName = PAYMENT_METHODS.find(m => m.id === selectedPayment)?.name || 'Unknown';

      // 1. Create Order Record
      const orderData = {
        nomor_pesanan: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_id: currentUser?.id || '',
        items: JSON.stringify(checkoutItems),
        total_harga: total,
        status_pesanan: 'pending',
        status_pembayaran: 'pending',
        alamat_pengiriman: fullAddress,
        kurir_pengiriman: 'Reguler',
      };

      const orderRecord = await pb.collection('orders').create(orderData, { $autoCancel: false });

      // 2. Update Product Stock
      for (const item of checkoutItems) {
        try {
          const product = await pb.collection('products').getOne(item.productId, { $autoCancel: false });
          const newStock = Math.max(0, product.stok - item.quantity);
          await pb.collection('products').update(item.productId, { stok: newStock }, { $autoCancel: false });
        } catch (err) {
          console.error(`Failed to update stock for product ${item.productId}`, err);
        }
      }

      // 3. Remove checked out items from cart
      const checkedOutIds = checkoutItems.map(item => item.id);
      clearCheckedOutItems(checkedOutIds);
      
      // 4. Save order info for success page
      localStorage.setItem('vityuu_order_id', orderRecord.nomor_pesanan);
      localStorage.setItem('vityuu_checkout_shipping', JSON.stringify({
        fullName: formData.nama_lengkap,
        address: fullAddress,
        phone: formData.nomor_telepon
      }));
      localStorage.setItem('vityuu_checkout_payment', JSON.stringify({
        name: paymentMethodName
      }));
      localStorage.setItem('vityuu_checkout_total', total.toString());

      navigate('/checkout/success');

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Gagal membuat pesanan. Silakan coba lagi.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <Helmet><title>Checkout | Vityuu</title></Helmet>

      <div className="min-h-screen bg-muted/30 pb-24 md:pb-12">
        {/* Header */}
        <header className="bg-background border-b border-border sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/cart')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <h1 className="text-lg font-bold text-foreground">Checkout</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-medium hidden sm:inline">Pembayaran Aman</span>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Forms */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Address Form */}
              <div className="checkout-card">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Alamat Pengiriman
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="checkout-label">Nama Lengkap</label>
                    <input 
                      type="text" 
                      name="nama_lengkap" 
                      value={formData.nama_lengkap} 
                      onChange={handleInputChange}
                      className="checkout-input" 
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="checkout-label">Nomor Telepon</label>
                    <input 
                      type="tel" 
                      name="nomor_telepon" 
                      value={formData.nomor_telepon} 
                      onChange={handleInputChange}
                      className="checkout-input" 
                      placeholder="Contoh: 081234567890"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="checkout-label">Alamat Lengkap</label>
                    <textarea 
                      name="alamat" 
                      value={formData.alamat} 
                      onChange={handleInputChange}
                      className="checkout-input min-h-[100px] py-3 resize-none" 
                      placeholder="Nama jalan, gedung, no. rumah"
                    />
                  </div>
                  <div>
                    <label className="checkout-label">Provinsi</label>
                    <input 
                      type="text" 
                      name="provinsi" 
                      value={formData.provinsi} 
                      onChange={handleInputChange}
                      className="checkout-input" 
                      placeholder="Provinsi"
                    />
                  </div>
                  <div>
                    <label className="checkout-label">Kota/Kabupaten</label>
                    <input 
                      type="text" 
                      name="kota" 
                      value={formData.kota} 
                      onChange={handleInputChange}
                      className="checkout-input" 
                      placeholder="Kota/Kabupaten"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="checkout-label">Kode Pos</label>
                    <input 
                      type="text" 
                      name="kode_pos" 
                      value={formData.kode_pos} 
                      onChange={handleInputChange}
                      className="checkout-input" 
                      placeholder="Kode Pos"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-card">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Metode Pembayaran
                </h2>
                
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label 
                      key={method.id} 
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPayment === method.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border bg-background hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="payment_method" 
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="font-bold text-foreground text-sm">{method.name}</p>
                          <p className="text-xs text-muted-foreground">{method.type}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="checkout-card sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-6">Ringkasan Pesanan</h2>
                
                {/* Items List */}
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {checkoutItems.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center flex-grow">
                        <h4 className="font-bold text-foreground text-sm line-clamp-2">{item.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                          <span className="font-bold text-foreground text-sm">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3 text-sm mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal Produk</span>
                    <span className="font-medium text-foreground">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Biaya Pengiriman</span>
                    <span className="font-medium text-foreground">Rp {shippingCost.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-border pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground text-base">Total Pembayaran</span>
                    <span className="font-extrabold text-2xl text-primary">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceOrder} 
                  disabled={submitting}
                  className="w-full btn-primary h-14 text-lg"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
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
