
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Plus, Edit2, Eye, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import AddEditProductForm from '@/components/AddEditProductForm.jsx';
import Header from '@/components/Header.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const records = await pb.collection('products').getFullList({
        filter: 'is_deleted = false || is_deleted = null',
        sort: '-created',
        $autoCancel: false
      });
      setProducts(records);
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengambil data produk');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Hapus produk ini?')) return;
    try {
      await pb.collection('products').update(id, { is_deleted: true }, { $autoCancel: false });
      toast.success('Produk dihapus');
      fetchProducts();
    } catch (e) {
      toast.error('Gagal menghapus');
    }
  };

  const filtered = products.filter(p => p.nama_produk.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Helmet><title>Kelola Produk | Admin Vityuu</title></Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex flex-grow max-w-7xl mx-auto w-full">
          <AdminSidebar />
          <main className="flex-grow p-6 md:p-8 overflow-x-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Kelola Produk</h1>
                <p className="text-muted-foreground text-sm">Manajemen inventaris dan katalog produk</p>
              </div>
              <Button onClick={handleAddNew} className="btn-primary"><Plus className="w-4 h-4 mr-2"/> Tambah Produk Baru</Button>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                <div className="relative w-full max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Cari produk..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    className="pl-9 bg-background"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Produk</th>
                      <th className="px-6 py-4 font-semibold">Harga</th>
                      <th className="px-6 py-4 font-semibold">Stok</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map(p => (
                      <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                              {p.gambar_produk ? (
                                <img src={pb.files.getURL(p, p.gambar_produk)} alt="" className="w-full h-full object-cover" />
                              ) : <Package className="w-5 h-5 m-2.5 text-muted-foreground"/>}
                            </div>
                            <span className="font-medium text-foreground line-clamp-1">{p.nama_produk}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">Rp {p.harga.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4">{p.stok}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'published' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4"/></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(p)} className="h-8 w-8 text-primary hover:bg-primary/10"><Edit2 className="w-4 h-4"/></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4"/></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Tidak ada data produk ditemukan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
      <AddEditProductForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={editingProduct} onSuccess={fetchProducts} />
    </>
  );
};

export default AdminProductsPage;
