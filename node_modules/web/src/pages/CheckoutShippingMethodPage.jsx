import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Truck, Zap, Bike, CreditCard, Building, Wallet, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CheckoutSteps from '@/components/CheckoutSteps.jsx';
import { toast } from 'sonner';

const CheckoutShippingMethodPage = () => {
  const navigate = useNavigate();
  const [selectedShipping, setSelectedShipping] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');

  const shippingOptions = [
    { id: 'jne_reg', name: 'JNE Regular', price: 25000, eta: '3-5 hari kerja', icon: Truck },
    { id: 'jne_yes', name: 'JNE Express', price: 50000, eta: '1-2 hari kerja', icon: Zap },
    { id: 'grab', name: 'Grab Express', price: 75000, eta: 'Same day delivery', icon: Bike },
  ];

  const paymentOptions = [
    { id: 'bank', name: 'Transfer Bank', desc: 'BCA, Mandiri, BNI', icon: Building },
    { id: 'ewallet', name: 'E-Wallet', desc: 'GoPay, OVO, Dana, LinkAja', icon: Wallet },
    { id: 'credit', name: 'Kartu Kredit', desc: 'Visa, Mastercard', icon: CreditCard },
    { id: 'cod', name: 'Cash on Delivery (COD)', desc: 'Bayar di tempat', icon: Banknote },
  ];

  useEffect(() => {
    const savedShipping = localStorage.getItem('vityuu_checkout_delivery');
    if (savedShipping) setSelectedShipping(JSON.parse(savedShipping).id);

    const savedPayment = localStorage.getItem('vityuu_checkout_payment');
    if (savedPayment) setSelectedPayment(JSON.parse(savedPayment).id);
  }, []);

  const handleContinue = () => {
    if (!selectedShipping) {
      toast.error('Pilih layanan pengiriman terlebih dahulu');
      return;
    }
    if (!selectedPayment) {
      toast.error('Pilih metode pembayaran terlebih dahulu');
      return;
    }

    const shipping = shippingOptions.find(o => o.id === selectedShipping);
    const payment = paymentOptions.find(o => o.id === selectedPayment);

    localStorage.setItem('vityuu_checkout_delivery', JSON.stringify(shipping));
    localStorage.setItem('vityuu_checkout_payment', JSON.stringify(payment));
    
    navigate('/checkout/payment');
  };

  return (
    <>
      <Helmet>
        <title>Checkout: Metode | Vityuu</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-grow py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <CheckoutSteps currentStep={2} />

            <div className="space-y-8">
              {/* Shipping Section */}
              <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-6">Pilih Layanan Pengiriman</h2>
                <div className="space-y-4">
                  {shippingOptions.map((option) => (
                    <div 
                      key={option.id}
                      onClick={() => setSelectedShipping(option.id)}
                      className={`relative flex items-center p-5 border rounded-2xl cursor-pointer transition-all duration-200 ${
                        selectedShipping === option.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:border-muted-foreground'
                      }`}
                    >
                      <div className="flex-shrink-0 mr-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedShipping === option.id ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                          {selectedShipping === option.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                      </div>
                      
                      <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center mr-4">
                        <option.icon className="w-5 h-5 text-foreground" />
                      </div>

                      <div className="flex-grow">
                        <h4 className="font-bold text-foreground">{option.name}</h4>
                        <p className="text-sm text-muted-foreground">{option.eta}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-foreground">Rp {option.price.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-6">Pilih Metode Pembayaran</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentOptions.map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`relative flex items-start p-5 border rounded-2xl cursor-pointer transition-all duration-200 ${
                        selectedPayment === method.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:border-muted-foreground'
                      }`}
                    >
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === method.id ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                          {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <method.icon className="w-4 h-4 text-foreground" />
                          <h4 className="font-bold text-foreground">{method.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{method.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => navigate('/checkout/shipping')} className="px-8 h-12">
                  Kembali
                </Button>
                <Button onClick={handleContinue} className="btn-primary px-8 h-12">
                  Lanjut ke Pembayaran
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CheckoutShippingMethodPage;