
import React, { useState, useEffect } from 'react';
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

  // Pricing state
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(15000); // Mock shipping cost
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    setCartItems(items);

    // Calculate prices
    const calcSubtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setSubtotal(calcSubtotal);
    
    // Mock discount logic
    const calcDiscount = calcSubtotal > 500000 ? 50000 : 0;
    setDiscount(calcDiscount);
    
    setTotal(calcSubtotal + shippingCost - calcDiscount);

    // Set mock address or from user profile
    if (currentUser) {
      setAddress({
        name: currentUser.nama_lengkap || 'Pelanggan',
        phone: currentUser.nomor_telepon || '081234567890',
        fullAddress: currentUser.alamat ? `${currentUser.alamat}, ${currentUser.kota}, ${currentUser.provinsi} ${currentUser.kode_pos}` : 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 12190',
        label: 'Rumah'
      });
    } else {
      setAddress({
        name: 'Pelanggan Guest',
        phone: '081234567890',
        fullAddress: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 12190',
        label: 'Rumah'
      });
    }

    setLoading(false);
  }, [navigate, currentUser, shippingCost]);

  const handlePlaceOrder = async () => {
    if (!address) {
      toast.error('Silakan pilih alamat pengiriman');
      return;
    }
    if (!paymentMethod) {
      toast.error('Silakan pilih metode pembayaran');
      return;
    }
    if (!termsAccepted) {
      toast.error('Anda harus menyetujui Ketentuan Penjual');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create Order Record
      const orderData = {
        nomor_pesanan: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_id: currentUser?.id || '',
        items: JSON.stringify(cartItems),
        total_harga: total,
        status_pesanan: 'pending',
        status_pembayaran: paymentMethod.id === 'cod' ? 'pending' : 'processing',
        alamat_pengiriman: address.fullAddress,
        kurir_pengiriman: 'Reguler (JNE/Sicepat)',
      };

      const orderRecord = await pb.collection('orders').create(orderData, { $autoCancel: false });

      // 2. Update Product Stock
      for (const item of cartItems) {
        try {
          const product = await pb.collection('products').getOne(item.productId, { $autoCancel: false });
          const newStock = Math.max(0, product.stok - item.quantity);
          await pb.collection('products').update(item.productId, { stok: newStock }, { $autoCancel: false });
        } catch (err) {
          console.error(`Failed to update stock for product ${item.productId}`, err);
        }
      }

      // 3. Clear Cart & Redirect
      clearCart();
      
      // Save order info for success page
      localStorage.setItem('vityuu_order_id', orderRecord.nomor_pesanan);
      localStorage.setItem('vityuu_checkout_shipping', JSON.stringify({
        fullName: address.name,
        address: address.fullAddress,
        email: currentUser?.email || 'guest@example.com'
      }));
      localStorage.setItem('vityuu_checkout_delivery', JSON.stringify({
        name: 'Reguler',
        eta: '2-3 Hari Kerja'
      }));
      localStorage.setItem('vityuu_checkout_payment', JSON.stringify({
        name: paymentMethod.name
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
          <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/cart')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <h1 className="text-lg font-bold text-foreground">Checkout</h1>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          
          {/* Address Section */}
          <AddressSection 
            address={address} 
            onEdit={() => toast.info('Fitur ubah alamat akan segera hadir')} 
          />

          {/* Order Items */}
          <OrderItemsTable items={cartItems} />

          {/* Payment Method Section */}
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Metode Pembayaran
              </h3>
            </div>

            {paymentMethod ? (
              <div 
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex items-center justify-between p-4 rounded-2xl border border-border bg-muted/20 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-background rounded-lg border border-border p-1.5 flex items-center justify-center">
                    {paymentMethod.icon ? (
                      <img src={paymentMethod.icon} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                    )}
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

            {paymentMethod?.id === 'paylater' && (
              <div className="mt-4 p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
                <p className="text-sm font-bold text-secondary mb-2">Opsi Cicilan Vityuu PayLater</p>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-background border border-border cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="installment" defaultChecked className="text-secondary focus:ring-secondary" />
                      <span className="text-sm font-medium">Beli Sekarang Bayar Nanti (1x)</span>
                    </div>
                    <span className="text-sm font-bold">Rp {total.toLocaleString('id-ID')}</span>
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-background border border-border cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="installment" className="text-secondary focus:ring-secondary" />
                      <span className="text-sm font-medium">Cicilan 12x</span>
                    </div>
                    <span className="text-sm font-bold">Rp {Math.ceil(total / 12).toLocaleString('id-ID')}/bln</span>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-3">*Persetujuan cicilan akan dikonfirmasi setelah checkout.</p>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <PriceSummarySection 
            subtotal={subtotal}
            shipping={shippingCost}
            discount={discount}
            total={total}
          />

          {/* Terms */}
          <div className="flex items-start space-x-3 px-2">
            <Checkbox 
              id="terms" 
              checked={termsAccepted} 
              onCheckedChange={setTermsAccepted}
              className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              Dengan membuat pesanan, Anda menyetujui <a href="#" className="text-primary hover:underline">Ketentuan Penggunaan</a> dan <a href="#" className="text-primary hover:underline">Kebijakan Privasi</a> Vityuu.
            </label>
          </div>

        </main>

        {/* Bottom Action Bar (Sticky on Mobile) */}
        <div className="fixed bottom-0 left-0 w-full bg-background border-t border-border p-4 md:relative md:bg-transparent md:border-none md:p-0 md:max-w-3xl md:mx-auto md:mt-8 z-40">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">Total Pembayaran</p>
              <p className="text-2xl font-extrabold text-primary">Rp {total.toLocaleString('id-ID')}</p>
            </div>
            <Button 
              onClick={handlePlaceOrder} 
              disabled={submitting || !paymentMethod || !termsAccepted}
              className="w-full md:w-auto btn-primary h-14 px-10 text-lg flex-1 md:flex-none"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
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
