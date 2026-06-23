import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Truck, Zap, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CheckoutSteps from '@/components/CheckoutSteps.jsx';
import { toast } from 'sonner';

const CheckoutDeliveryPage = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');

  const deliveryOptions = [
    { id: 'jne_reg', name: 'JNE Regular', price: 25000, eta: '3-5 hari kerja', icon: Truck },
    { id: 'jne_yes', name: 'JNE Express', price: 50000, eta: '1-2 hari kerja', icon: Zap },
    { id: 'grab', name: 'Grab Express', price: 75000, eta: 'Same day delivery', icon: Bike },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('vityuu_checkout_delivery');
    if (saved) setSelectedMethod(JSON.parse(saved).id);
  }, []);

  const handleContinue = () => {
    if (!selectedMethod) {
      toast.error('Pilih salah satu layanan pengiriman');
      return;
    }
    const option = deliveryOptions.find(o => o.id === selectedMethod);
    localStorage.setItem('vityuu_checkout_delivery', JSON.stringify(option));
    navigate('/checkout/payment');
  };

  return (
    <>
      <Helmet>
        <title>Checkout: Layanan Pengiriman | Vityuu</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-grow py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <CheckoutSteps currentStep={2} />

            <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-8">Pilih Layanan Pengiriman</h2>

              <div className="space-y-4">
                {deliveryOptions.map((option) => (
                  <div 
                    key={option.id}
                    onClick={() => setSelectedMethod(option.id)}
                    className={`relative flex items-center p-6 border rounded-2xl cursor-pointer transition-all duration-200 ${
                      selectedMethod === option.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:border-muted-foreground'
                    }`}
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === option.id ? 'border-primary' : 'border-muted-foreground'
                      }`}>
                        {selectedMethod === option.id && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                    </div>
                    
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mr-4">
                      <option.icon className="w-6 h-6 text-foreground" />
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

              <div className="pt-8 mt-8 border-t border-border flex justify-between">
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

export default CheckoutDeliveryPage;