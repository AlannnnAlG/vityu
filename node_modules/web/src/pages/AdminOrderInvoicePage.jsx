
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Printer, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AdminOrderInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await pb.collection('orders').getOne(id, { $autoCancel: false });
        const user = await pb.collection('users').getOne(orderData.user_id, { $autoCancel: false }).catch(() => null);
        setOrder({ ...orderData, user });
      } catch (err) {
        toast.error('Pesanan tidak ditemukan');
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  if (!order) return null;

  let items = [];
  try {
    items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  } catch (e) {}

  return (
    <>
      <Helmet><title>Invoice {order.nomor_pesanan} | Vityuu</title></Helmet>
      
      <div className="min-h-screen bg-muted/20 pb-12 print:bg-white print:pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-0 print:px-0">
          
          <div className="flex justify-between items-center mb-8 print:hidden">
            <Button variant="ghost" onClick={() => navigate('/admin/orders')}><ArrowLeft className="w-4 h-4 mr-2"/> Kembali</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}><Printer className="w-4 h-4 mr-2"/> Print Invoice</Button>
            </div>
          </div>

          {/* Invoice Document */}
          <div className="bg-card print:shadow-none print:border-none border border-border shadow-md rounded-2xl p-8 md:p-12 text-foreground" id="invoice-content">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-8 mb-8">
              <div>
                <img src="https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/456510c1e5fc5030feef0a6f70003395.png" alt="Vityuu" className="h-10 mb-4 print:grayscale" />
                <p className="text-sm text-muted-foreground">Jl. Kesehatan No. 123, Jakarta Selatan<br/>DKI Jakarta 12345<br/>admin@vityuu.com</p>
              </div>
              <div className="text-left md:text-right mt-6 md:mt-0">
                <h1 className="text-4xl font-extrabold tracking-tight uppercase text-primary print:text-black">INVOICE</h1>
                <p className="font-medium mt-1">#{order.nomor_pesanan}</p>
                <p className="text-sm text-muted-foreground mt-1">Tanggal: {new Date(order.created).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div>
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Ditagihkan Kepada:</h2>
                <div className="text-sm">
                  <p className="font-bold text-lg mb-1">{order.user?.nama_lengkap || 'Pelanggan'}</p>
                  <p className="text-muted-foreground mb-1">{order.user?.email || '-'}</p>
                  <p className="text-muted-foreground mb-1">{order.user?.nomor_telepon || '-'}</p>
                  <p className="text-muted-foreground leading-relaxed mt-2">{order.alamat_pengiriman}</p>
                </div>
              </div>
              <div>
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Informasi Pengiriman:</h2>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between border-b border-border/50 pb-1">
                    <span className="text-muted-foreground">Status Pembayaran:</span>
                    <span className="font-medium uppercase">{order.status_pembayaran}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-1 pt-1">
                    <span className="text-muted-foreground">Status Pesanan:</span>
                    <span className="font-medium uppercase">{order.status_pesanan}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-1 pt-1">
                    <span className="text-muted-foreground">Kurir Pengiriman:</span>
                    <span className="font-medium">{order.kurir_pengiriman || '-'}</span>
                  </div>
                  <div className="flex justify-between pb-1 pt-1">
                    <span className="text-muted-foreground">No. Resi:</span>
                    <span className="font-medium">{order.nomor_tracking || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-foreground border-y border-border">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Deskripsi Item</th>
                    <th className="px-4 py-3 font-semibold text-center w-24">Qty</th>
                    <th className="px-4 py-3 font-semibold text-right w-40">Harga</th>
                    <th className="px-4 py-3 font-semibold text-right w-40">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-4 font-medium">{item.name || item.nama_produk}</td>
                      <td className="px-4 py-4 text-center">{item.quantity}</td>
                      <td className="px-4 py-4 text-right text-muted-foreground">Rp {item.price?.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-4 text-right font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end border-t border-border pt-6">
              <div className="w-full md:w-1/2 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">Rp {order.total_harga?.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pajak / Biaya (0%)</span>
                  <span className="font-medium">Rp 0</span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t border-border">
                  <span className="font-bold">Total Pembayaran</span>
                  <span className="font-extrabold text-primary print:text-black">Rp {order.total_harga?.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p>Terima kasih telah berbelanja di Vityuu. Jika ada pertanyaan, hubungi admin@vityuu.com.</p>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default AdminOrderInvoicePage;
