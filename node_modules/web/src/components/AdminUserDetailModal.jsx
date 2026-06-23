
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Edit2, ShoppingBag, Trash2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

const AdminUserDetailModal = ({ isOpen, onClose, user, onAction }) => {
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });

  useEffect(() => {
    if (user && isOpen) {
      // Fetch user's orders to calculate stats
      pb.collection('orders').getFullList({
        filter: `user_id = '${user.id}'`,
        $autoCancel: false
      }).then(orders => {
        const total = orders.reduce((sum, o) => sum + (o.total_harga || 0), 0);
        setStats({ totalOrders: orders.length, totalSpent: total });
      }).catch(() => setStats({ totalOrders: 0, totalSpent: 0 }));
    }
  }, [user, isOpen]);

  if (!user) return null;

  const isActive = user.verified; // using verified as proxy for Active status
  const joinedDate = new Date(user.created).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="p-6 border-b border-border bg-muted/20 -mx-6 -mt-6 mb-6 flex flex-row items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold border border-primary/30">
              {user.nama_lengkap?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold mb-1">{user.nama_lengkap}</DialogTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className={`border-none ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </Badge>
                <Badge variant="outline" className={`border-none ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><User className="w-4 h-4"/> Informasi Kontak</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium text-foreground">{user.email}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Telepon:</span>
                  <span className="font-medium text-foreground">{user.nomor_telepon || '-'}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Terdaftar:</span>
                  <span className="font-medium text-foreground">{joinedDate}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><MapPin className="w-4 h-4"/> Alamat Pengiriman Utama</h3>
              <div className="bg-muted/30 border border-border rounded-xl p-4 text-sm text-foreground leading-relaxed">
                {user.alamat ? (
                  <>
                    {user.alamat}<br/>
                    {user.kota}, {user.provinsi}<br/>
                    {user.kode_pos}
                  </>
                ) : <span className="text-muted-foreground italic">Belum mengatur alamat</span>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><ShoppingBag className="w-4 h-4"/> Riwayat Transaksi</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Total Pesanan</p>
                  <p className="text-3xl font-extrabold text-foreground">{stats.totalOrders}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Total Pengeluaran</p>
                  <p className="text-lg font-extrabold text-primary truncate" title={`Rp ${stats.totalSpent.toLocaleString('id-ID')}`}>
                    Rp {stats.totalSpent > 1000000 ? `${(stats.totalSpent / 1000000).toFixed(1)}M` : stats.totalSpent.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-3">
              <Button className="w-full btn-primary" onClick={() => onAction('role')}>
                <Edit2 className="w-4 h-4 mr-2" /> Edit Role & Status
              </Button>
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={() => onAction('delete')}>
                <Trash2 className="w-4 h-4 mr-2" /> Hapus Akun
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUserDetailModal;
