
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, MapPin, Package, Edit2, Printer, Mail } from 'lucide-react';

const AdminOrderDetailModal = ({ isOpen, onClose, order, onAction }) => {
  if (!order) return null;

  let items = [];
  try {
    items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  } catch (e) {
    console.error('Failed to parse items', e);
  }

  const paymentColors = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', success: 'bg-emerald-100 text-emerald-700', failed: 'bg-red-100 text-red-700', cancelled: 'bg-slate-100 text-slate-700' };
  const orderColors = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-slate-100 text-slate-700' };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 border-b border-border bg-muted/20 sticky top-0 z-10 flex flex-row items-start justify-between">
          <div>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              Pesanan {order.nomor_pesanan}
            </DialogTitle>
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className={`border-none ${paymentColors[order.status_pembayaran]}`}>Bayar: {order.status_pembayaran}</Badge>
              <Badge variant="outline" className={`border-none ${orderColors[order.status_pesanan]}`}>Kirim: {order.status_pesanan}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onAction('status')}><Edit2 className="w-4 h-4 mr-2"/> Update</Button>
            <Button variant="outline" size="sm" onClick={() => onAction('print')}><Printer className="w-4 h-4 mr-2"/> Print</Button>
            <Button variant="outline" size="sm" onClick={() => onAction('email')}><Mail className="w-4 h-4 mr-2"/> Email</Button>
          </div>
        </DialogHeader>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><User className="w-4 h-4"/> Informasi Pelanggan</h3>
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-sm">
                <p className="font-bold text-foreground">{order.user?.nama_lengkap || 'Unknown User'}</p>
                <p className="text-muted-foreground">{order.user?.email || 'N/A'}</p>
                <p className="text-muted-foreground">{order.user?.nomor_telepon || '-'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><MapPin className="w-4 h-4"/> Alamat Pengiriman</h3>
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-sm">
                <p className="text-foreground leading-relaxed">{order.alamat_pengiriman}</p>
                {(order.kurir_pengiriman || order.nomor_tracking) && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p><span className="text-muted-foreground">Kurir:</span> <span className="font-medium">{order.kurir_pengiriman || '-'}</span></p>
                    <p><span className="text-muted-foreground">Resi:</span> <span className="font-medium">{order.nomor_tracking || '-'}</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><Package className="w-4 h-4"/> Detail Produk</h3>
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground sticky top-0">
                    <tr>
                      <th className="px-4 py-2 font-medium text-left">Produk</th>
                      <th className="px-4 py-2 font-medium text-center">Qty</th>
                      <th className="px-4 py-2 font-medium text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items && items.length > 0 ? items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-medium">{item.name || item.nama_produk}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="px-4 py-4 text-center text-muted-foreground">Data produk tidak tersedia</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-muted/20 border-t border-border">
                <div className="flex justify-between items-center text-base">
                  <span className="font-bold text-foreground">Total Keseluruhan</span>
                  <span className="font-extrabold text-primary">Rp {order.total_harga?.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOrderDetailModal;
