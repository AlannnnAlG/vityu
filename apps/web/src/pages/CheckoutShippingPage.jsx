import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CheckoutSteps from '@/components/CheckoutSteps.jsx';

const CheckoutShippingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('vityuu_checkout_shipping');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Nama lengkap wajib diisi";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email tidak valid";
    if (!formData.phone.trim()) newErrors.phone = "Nomor telepon wajib diisi";
    if (!formData.address.trim()) newErrors.address = "Alamat lengkap wajib diisi";
    if (!formData.city.trim()) newErrors.city = "Kota/Kabupaten wajib diisi";
    if (!formData.province.trim()) newErrors.province = "Provinsi wajib diisi";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Kode pos wajib diisi";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem('vityuu_checkout_shipping', JSON.stringify(formData));
      navigate('/checkout/shipping-method');
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout: Pengiriman | Vityuu</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-grow py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <CheckoutSteps currentStep={1} />

            <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-8">Informasi Pengiriman</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="bg-background" placeholder="Contoh: Budi Santoso" />
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="bg-background" placeholder="budi@example.com" />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="bg-background" placeholder="081234567890" />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} className="bg-background" placeholder="Nama jalan, gedung, no. rumah" />
                  {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota/Kabupaten</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} className="bg-background" placeholder="Jakarta Selatan" />
                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi</Label>
                    <Input id="province" name="province" value={formData.province} onChange={handleChange} className="bg-background" placeholder="DKI Jakarta" />
                    {errors.province && <p className="text-sm text-destructive">{errors.province}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Kode Pos</Label>
                    <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} className="bg-background" placeholder="12345" />
                    {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode}</p>}
                  </div>
                </div>

                <div className="pt-8 border-t border-border flex justify-end">
                  <Button type="submit" className="btn-primary px-8 h-12 w-full md:w-auto">
                    Lanjut ke Pengiriman
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CheckoutShippingPage;