
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Eye, Edit2, Trash2, ShieldAlert, Loader2, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import Header from '@/components/Header.jsx';
import ConfirmationModal from '@/components/ConfirmationModal.jsx';
import AdminUserDetailModal from '@/components/AdminUserDetailModal.jsx';
import AdminUserRoleForm from '@/components/AdminUserRoleForm.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('-created');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let filterArgs = [];
      if (roleFilter !== 'all') filterArgs.push(`role = '${roleFilter}'`);
      if (statusFilter !== 'all') {
        filterArgs.push(statusFilter === 'active' ? `verified = true` : `verified = false`);
      }
      if (search) filterArgs.push(`(nama_lengkap ~ '${search.replace(/'/g, "\\'")}' || email ~ '${search.replace(/'/g, "\\'")}')`);
      
      const filter = filterArgs.join(' && ');

      const result = await pb.collection('users').getList(page, 10, {
        filter: filter || '',
        sort: sort,
        $autoCancel: false
      });

      setUsers(result.items);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengambil data pengguna');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, roleFilter, statusFilter, sort, page]);

  const openAction = (action, user) => {
    setSelectedUser(user);
    if (action === 'detail') setDetailModalOpen(true);
    if (action === 'role') setRoleModalOpen(true);
    if (action === 'delete') setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    try {
      await pb.collection('users').delete(selectedUser.id, { $autoCancel: false });
      toast.success('Pengguna berhasil dihapus');
      setDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error('Gagal menghapus pengguna');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Helmet><title>Kelola Pengguna | Admin Vityuu</title></Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex flex-grow max-w-7xl mx-auto w-full">
          <AdminSidebar />
          <main className="flex-grow p-6 md:p-8 overflow-x-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Kelola Pengguna</h1>
                <p className="text-muted-foreground text-sm">Total {totalItems} pengguna terdaftar</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/20">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Cari nama atau email..." value={search} onChange={e => {setSearch(e.target.value); setPage(1);}} className="pl-9 bg-background" />
                </div>
                <Select value={roleFilter} onValueChange={(v) => {setRoleFilter(v); setPage(1);}}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Semua Role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Role</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(v) => {setStatusFilter(v); setPage(1);}}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sort} onValueChange={(v) => {setSort(v); setPage(1);}}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Urutkan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-created">Tanggal (Terbaru)</SelectItem>
                    <SelectItem value="created">Tanggal (Terlama)</SelectItem>
                    <SelectItem value="nama_lengkap">Nama (A-Z)</SelectItem>
                    <SelectItem value="-nama_lengkap">Nama (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Pengguna</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Tanggal Daftar</th>
                      <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr><td colSpan="5" className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto"/></td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-16 text-center text-muted-foreground">Tidak ada pengguna ditemukan.</td></tr>
                    ) : (
                      users.map(user => (
                        <tr key={user.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">
                                {user.nama_lengkap?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{user.nama_lengkap || 'Tanpa Nama'}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={`border-none ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                              {user.role === 'admin' ? 'Admin' : 'User'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={`border-none ${user.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                              {user.verified ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {new Date(user.created).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openAction('detail', user)} title="Detail User"><Eye className="w-4 h-4"/></Button>
                              <Button variant="ghost" size="icon" onClick={() => openAction('role', user)} className="text-primary" title="Edit Role"><Edit2 className="w-4 h-4"/></Button>
                              <Button variant="ghost" size="icon" onClick={() => openAction('delete', user)} className="text-destructive hover:bg-destructive/10" title="Hapus"><Trash2 className="w-4 h-4"/></Button>
                            </div>
                          </td>
                        </tr>
                      ))
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

      <AdminUserDetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} user={selectedUser} onAction={(action) => { setDetailModalOpen(false); openAction(action, selectedUser); }} />
      <AdminUserRoleForm isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} user={selectedUser} onSuccess={fetchUsers} />
      <ConfirmationModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
        isLoading={isDeleting}
        title="Hapus Akun Pengguna"
        message={`Yakin ingin menghapus akun ${selectedUser?.email}? Semua data terkait pengguna ini akan hilang secara permanen.`}
        confirmText="Hapus Akun"
      />
    </>
  );
};

export default AdminUsersPage;
