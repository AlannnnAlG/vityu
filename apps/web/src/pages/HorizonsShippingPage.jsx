import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import CheckoutSteps from '@/components/CheckoutSteps.jsx';

const couriers = [
  { id: 'jne', name: 'JNE Reguler', price: 15000, est: '2-3 hari' },
  { id: 'gojek', name: 'Gojek Instant', price: 20000, est: '1 hari' },
  { id: 'grab', name: 'Grab Same Day', price: 25000, est: 'Hari ini' }
];

const cities = [
  "Jakarta Selatan", "Jakarta Pusat", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara",
  "Bandung", "Surabaya", "Yogyakarta", "Semarang", "Medan", "Tangerang", "Bekasi", "Depok"
];

const ShippingPage = () => {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useLocalStorage('vityu_checkout', {});

  const [form, setForm] = useState({
    name: checkoutData?.shipping?.name || '',
    phone: checkoutData?.shipping?.phone || '',
    address: checkoutData?.shipping?.address || '',
    city: checkoutData?.shipping?.city || '',
    zip: checkoutData?.shipping?.zip || '',
    notes: checkoutData?.shipping?.notes || '',
    courier: checkoutData?.shipping?.courier || 'jne'
  });

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
  }, [cart, navigate]);

  const selectedCourier = couriers.find(c => c.id === form.courier);
  const total = getCartTotal() + (selectedCourier?.price || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (form.name.length < 3) return toast.error('Nama minimal 3 karakter');
    if (!/^[0-9]{9,14}$/.test(form.phone)) return toast.error('Nomor telepon tidak valid');
    if (form.address.length < 10) return toast.error('Alamat terlalu singkat');
    if (!form.city) return toast.error('Pilih kota pengiriman');
    if (!/^[0-9]{5}$/.test(form.zip)) return toast.error('Kode pos harus 5 digit angka');

    setCheckoutData({
      ...checkoutData,
      shipping: { ...form, cost: selectedCourier.price, courierName: selectedCourier.name }
    });

    navigate('/checkout/payment');
  };

  if (cart.length === 0) return null;

  return (
    <>
      <Helmet>
        <title>Vityu - Pengiriman</title>
      </Helmet>

      <div className="w-full flex flex-col p-4 gap-6 pb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <button onClick={() => navigate('/checkout')} className="p-2 -ml-2 text-foreground hover:bg-muted rounded-xl transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">Pengiriman</h1>
        </motion.div>

        <CheckoutSteps currentStep={2} />

        <motion.form 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <div className="bg-card border rounded-3xl p-5 shadow-sm flex flex-col gap-4">
            <h2 className="font-bold text-lg mb-1">Alamat Tujuan</h2>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Nama Penerima</label>
              <input
                required
                className="w-full min-h-[48px] px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                placeholder="Mis. Kevin"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Nomor Telepon</label>
              <input
                required
                type="tel"
                className="w-full min-h-[48px] px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                placeholder="08123456789"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Kota / Kabupaten</label>
              <select
                required
                className="w-full min-h-[48px] px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none text-foreground"
                value={form.city}
                onChange={e => setForm({...form, city: e.target.value})}
              >
                <option value="" disabled>Pilih kota...</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Alamat Lengkap</label>
              <textarea
                required
                rows={3}
                className="w-full p-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-foreground placeholder:text-muted-foreground"
                placeholder="Nama jalan, gedung, no. rumah"
                value={form.address}
                onChange={e => setForm({...form, address: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Kode Pos</label>
              <input
                required
                type="text"
                maxLength={5}
                className="w-full min-h-[48px] px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                placeholder="12345"
                value={form.zip}
                onChange={e => setForm({...form, zip: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Catatan (Opsional)</label>
              <input
                className="w-full min-h-[48px] px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                placeholder="Mis. Titip di pos satpam"
                value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
              />
            </div>
          </div>

          <div className="bg-card border rounded-3xl p-5 shadow-sm flex flex-col gap-3">
            <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Pilih Kurir
            </h2>
            
            {couriers.map((courier) => (
              <label 
                key={courier.id}
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                  form.courier === courier.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${form.courier === courier.id ? 'border-primary' : 'border-muted-foreground'}`}>
                    {form.courier === courier.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{courier.name}</div>
                    <div className="text-xs text-muted-foreground">Est. {courier.est}</div>
                  </div>
                </div>
                <div className="font-bold text-sm">
                  Rp {courier.price.toLocaleString('id-ID')}
                </div>
              </label>
            ))}
          </div>

          <div className="bg-card border rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">Total Pembayaran</span>
              <span className="text-xl font-bold text-foreground">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
            <button 
              type="submit"
              className="w-full min-h-[48px] bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
            >
              Lanjut ke Pembayaran
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.form>
      </div>
    </>
  );
};

export default ShippingPage;