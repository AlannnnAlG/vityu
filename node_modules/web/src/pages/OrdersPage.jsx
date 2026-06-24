import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Calendar, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // 🔥 AMBIL USER DARI LOCALSTORAGE
        const authData = localStorage.getItem('pb_auth');
        let userId = null;
        if (authData) {
          const parsed = JSON.parse(authData);
          const user = parsed.record || parsed.model;
          userId = user?.id;
        }
        
        if (!userId) {
          setError('User tidak ditemukan');
          setLoading(false);
          return;
        }
        
        console.log('📦 Fetching orders for user:', userId);
        
        const response = await pb.collection('orders').getList(1, 50, {
          filter: `user_id = "${userId}"`,
          sort: '-created',
        });

        console.log('📦 Orders fetched:', response.items.length);

        const parsedOrders = response.items.map(order => {
          let items = [];
          try {
            items = JSON.parse(order.items || '[]');
          } catch (e) {
            items = [];
          }
          
          return {
            ...order,
            items: items,
            total_harga: order.total_harga || 0,
            status_pembayaran: order.status_pembayaran || 'pending',
          };
        });

        setOrders(parsedOrders);
      } catch (error) {
        console.error('❌ Gagal ambil orders:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
      'processing': { label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
      'paid': { label: 'Lunas', color: 'bg-green-100 text-green-800' },
      'shipped': { label: 'Dikirim', color: 'bg-purple-100 text-purple-800' },
      'delivered': { label: 'Diterima', color: 'bg-emerald-100 text-emerald-800' },
      'cancelled': { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
      'expired': { label: 'Kadaluarsa', color: 'bg-gray-100 text-gray-800' },
      'failed': { label: 'Gagal', color: 'bg-red-100 text-red-800' },
    };
    return statusMap[status] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">Error: {error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>Coba Lagi</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Pesanan Saya | Vityuu</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow py-8 md:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pesanan Saya</h1>
                <p className="text-muted-foreground text-sm mt-1">Kelola dan lacak semua pesanan Anda</p>
              </div>
              <Link to="/shop">
                <Button variant="outline" size="sm">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Lanjut Belanja
                </Button>
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Belum Ada Pesanan</h3>
                <p className="text-muted-foreground max-w-md mx-auto">Anda belum melakukan pemesanan apapun.</p>
                <Link to="/shop" className="mt-6 inline-block">
                  <Button>Mulai Belanja</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusBadge = getStatusBadge(order.status_pembayaran);
                  const orderDate = new Date(order.created);
                  const formattedDate = orderDate.toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  });

                  return (
                    <div key={order.id} className="bg-card border border-border rounded-2xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold">Nomor Pesanan</p>
                            <p className="font-bold text-foreground text-sm">{order.nomor_pesanan || order.id}</p>
                          </div>
                          <div className="hidden sm:block w-px h-8 bg-border" />
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold">Tanggal</p>
                            <p className="font-medium text-foreground text-sm">{formattedDate}</p>
                          </div>
                          <div className="hidden sm:block w-px h-8 bg-border" />
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold">Total</p>
                            <p className="font-bold text-primary text-sm">Rp {order.total_harga.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                            {statusBadge.label}
                          </span>
                          <Link to={`/orders/${order.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              Detail <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {order.items && order.items.length > 0 ? (
                          order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
                              <span className="text-sm font-medium text-foreground">
                                {item.name || 'Produk'} x{item.quantity || 0}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Tidak ada item</p>
                        )}
                        {order.items && order.items.length > 3 && (
                          <div className="flex items-center justify-center bg-muted/50 rounded-lg px-3 py-1.5">
                            <span className="text-xs font-bold text-muted-foreground">
                              +{order.items.length - 3} lainnya
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default OrdersPage;