
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Eye, Edit2, Printer, Mail, Package, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import Header from '@/components/Header.jsx';
import AdminOrderDetailModal from '@/components/AdminOrderDetailModal.jsx';
import AdminOrderStatusForm from '@/components/AdminOrderStatusForm.jsx';
import AdminOrderEmailModal from '@/components/AdminOrderEmailModal.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  const [sort, setSort] = useState('-created');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchUsers = async () => {
    try {
      const users = await pb.collection('users').getFullList({ $autoCancel: false });
      const map = {};
      users.forEach(u => map[u.id] = u);
      setUsersMap(map);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let filterArgs = [];
      if (paymentFilter !== 'all') filterArgs.push(`status_pembayaran = '${paymentFilter}'`);
      if (orderFilter !== 'all') filterArgs.push(`status_pesanan = '${orderFilter}'`);
      if (search) filterArgs.push(`nomor_pesanan ~ '${search.replace(/'/g, "\\'")}'`);
      
      const filter = filterArgs.join(' && ');

      const result = await pb.collection('orders').getList(page, 10, {
        filter: filter || '',
        sort: sort,
        $autoCancel: false
      });

      setOrders(result.items);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);

      // Fetch all for total revenue if filter is applied (approximation for demo)
      const allOrders = await pb.collection('orders').getFullList({ filter: filter || '', $autoCancel: false });
      const rev = allOrders.reduce((sum, o) => sum + (o.total_harga || 0), 0);
      setTotalRevenue(rev);
      
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengambil data pesanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, paymentFilter, orderFilter, sort, page]);

  const openAction = (action, order) => {
    const orderWithUser = { ...order, user: usersMap[order.user_id] || {} };
    setSelectedOrder(orderWithUser);
    if (action === 'detail') setDetailModalOpen(true);
    if (action === 'status') setStatusModalOpen(true);
    if (action === 'email') setEmailModalOpen(true);
    if (action === 'print') window.open(`/admin/orders/${order.id}/invoice`, '_blank');
  };

  const paymentColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-100 text-slate-700'
  };

  const orderColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-slate-100 text-slate-700'
  };

  return (
    <>
      <Helmet><title>Kelola Pesanan | Admin Vityuu</title></Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex flex-grow max-w-7xl mx-auto w-full">
          <AdminSidebar />
          <main className="flex-grow p-6 md:p-8 overflow-x-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Kelola Pesanan</h1>
                <p className="text-muted-foreground text-sm">Manajemen order dan pengiriman</p>
              </div>
              <div className="flex gap-4 bg-card border border-border p-3 rounded-2xl shadow-sm">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Pesanan</p>
                  <p className="text-xl font-bold">{totalItems}</p>
                </div>
                <div className="w-px bg-border mx-2"></div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Revenue</p>
                  <p className="text-xl font-bold text-primary">Rp {totalRevenue.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/20">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Cari no. pesanan..." value={search} onChange={e => {setSearch(e.target.value); setPage(1);}} className="pl-9 bg-background" />
                </div>
                <Select value={paymentFilter} onValueChange={(v) => {setPaymentFilter(v); setPage(1);}}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Status Pembayaran" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Pembayaran</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={orderFilter} onValueChange={(v) => {setOrderFilter(v); setPage(1);}}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Status Pesanan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Pesanan</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sort} onValueChange={(v) => {setSort(v); setPage(1);}}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Urutkan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-created">Tanggal (Terbaru)</SelectItem>
                    <SelectItem value="created">Tanggal (Terlama)</SelectItem>
                    <SelectItem value="-total_harga">Total (Tertinggi)</SelectItem>
                    <SelectItem value="total_harga">Total (Terendah)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Pesanan</th>
                      <th className="px-6 py-4 font-semibold">Pelanggan</th>
                      <th className="px-6 py-4 font-semibold">Total</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr><td colSpan="5" className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto"/></td></tr>
                    ) : orders.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-16 text-center text-muted-foreground">Tidak ada data pesanan</td></tr>
                    ) : (
                      orders.map(order => {
                        const user = usersMap[order.user_id];
                        return (
                          <tr key={order.id} className="hover:bg-muted/10 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="font-bold text-foreground">{order.nomor_pesanan}</p>
                              <p className="text-xs text-muted-foreground">{new Date(order.created).toLocaleDateString('id-ID')}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-foreground">{user?.nama_lengkap || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground">{user?.email || 'N/A'}</p>
                            </td>
                            <td className="px-6 py-4 font-bold text-foreground">
                              Rp {order.total_harga?.toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 space-y-1">
                              <Badge variant="outline" className={`border-none ${paymentColors[order.status_pembayaran] || paymentColors.pending}`}>
                                Bayar: {order.status_pembayaran}
                              </Badge>
                              <br/>
                              <Badge variant="outline" className={`border-none ${orderColors[order.status_pesanan] || orderColors.pending}`}>
                                Kirim: {order.status_pesanan}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => openAction('detail', order)} title="Detail Pesanan"><Eye className="w-4 h-4"/></Button>
                                <Button variant="ghost" size="icon" onClick={() => openAction('status', order)} className="text-primary" title="Update Status"><Edit2 className="w-4 h-4"/></Button>
                                <Button variant="ghost" size="icon" onClick={() => openAction('print', order)} title="Print Invoice"><Printer className="w-4 h-4"/></Button>
                                <Button variant="ghost" size="icon" onClick={() => openAction('email', order)} title="Kirim Email"><Mail className="w-4 h-4"/></Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {!loading && totalPages > 1 && (
                <div className="p-4 border-t border-border flex items-center justify-between bg-background mt-auto">
                  <p className="text-sm text-muted-foreground">Halaman {page} dari {totalPages}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4 mr-1" /> Prev</Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <AdminOrderDetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} order={selectedOrder} onAction={(action) => { setDetailModalOpen(false); openAction(action, selectedOrder); }} />
      <AdminOrderStatusForm isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} order={selectedOrder} onSuccess={fetchOrders} />
      <AdminOrderEmailModal isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)} order={selectedOrder} />
    </>
  );
};

export default AdminOrdersPage;
