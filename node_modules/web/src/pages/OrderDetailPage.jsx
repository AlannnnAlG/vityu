import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Package, Calendar, CreditCard, MapPin, 
  ArrowLeft, Loader2, ShoppingBag, CheckCircle, 
  Truck, Clock, XCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🔥 CEK APAKAH ADA TOKEN DI LOCALSTORAGE
    const hasToken = !!localStorage.getItem('pb_token');
    const hasAuth = !!localStorage.getItem('pb_auth');
    
    if (!hasToken || !hasAuth) {
      console.log('❌ No token, redirecting to login');
      navigate('/login');
      return;
    }

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📦 Fetching order detail for id:', id);
        
        const orderData = await pb.collection('orders').getOne(id);
        console.log('📦 Order detail:', orderData);

        let items = [];
        try {
          items = JSON.parse(orderData.items || '[]');
        } catch (e) {
          items = [];
        }

        setOrder({
          ...orderData,
          items: items,
        });

      } catch (error) {
        console.error('❌ Gagal ambil detail order:', error);
        setError(error.message || 'Gagal memuat detail pesanan');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id, navigate]);

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'processing': { label: 'Diproses', color: 'bg-blue-100 text-blue-800', icon: Package },
      'paid': { label: 'Lunas', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'shipped': { label: 'Dikirim', color: 'bg-purple-100 text-purple-800', icon: Truck },
      'delivered': { label: 'Diterima', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
      'cancelled': { label: 'Dibatalkan', color: 'bg-red-100 text-red-800', icon: XCircle },
      'expired': { label: 'Kadaluarsa', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      'failed': { label: 'Gagal', color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    return statusMap[status] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-800', icon: Package };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Gagal Memuat Detail</h3>
            <p className="text-muted-foreground">{error || 'Order tidak ditemukan'}</p>
            <Button className="mt-4" onClick={() => navigate('/orders')}>
              Kembali ke Pesanan
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const statusBadge = getStatusBadge(order.status_pembayaran);
  const orderDate = new Date(order.created);
  const formattedDate = orderDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <>
      <Helmet>
        <title>Detail Pesanan | Vityuu</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-grow py-8 md:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button 
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Kembali ke Pesanan</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Detail Pesanan</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.nomor_pesanan || order.id}
                </p>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${statusBadge.color}`}>
                <statusBadge.icon className="w-4 h-4" />
                {statusBadge.label}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Produk</h3>
                  <div className="space-y-4">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                          <div className="w-20 h-20 rounded-xl bg-muted border border-border overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
                            📦
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold text-foreground">{item.name || 'Produk'}</h4>
                            {item.variant && (
                              <p className="text-xs text-muted-foreground">Variasi: {item.variant}</p>
                            )}
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-muted-foreground">x{item.quantity || 0}</span>
                              <span className="font-bold text-foreground">
                                Rp {((item.price || 0) * (item.quantity || 0)).toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">Tidak ada item</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Ringkasan</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        Rp {(order.total_harga - 15000).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ongkos Kirim</span>
                      <span className="font-medium">Rp 15.000</span>
                    </div>
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">Rp {order.total_harga.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    Alamat Pengiriman
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-foreground">{order.nama_penerima || 'Nama tidak tersedia'}</p>
                    <p className="text-muted-foreground">{order.alamat_pengiriman || 'Alamat tidak tersedia'}</p>
                    <p className="text-muted-foreground">{order.nomor_telepon_penerima || '-'}</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    Pembayaran
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-medium ${statusBadge.color.split(' ')[1]}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal</span>
                      <span className="font-medium">{formattedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link to="/shop">
                    <Button variant="outline" className="w-full">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Lanjut Belanja
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default OrderDetailPage;