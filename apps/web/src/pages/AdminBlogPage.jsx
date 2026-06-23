
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit2, Eye, Trash2, CheckCircle, Circle, FileText, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import Header from '@/components/Header.jsx';
import ConfirmationModal from '@/components/ConfirmationModal.jsx';
import AdminBlogPreviewModal from '@/components/AdminBlogPreviewModal.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AdminBlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, draft, published
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [articleToPreview, setArticleToPreview] = useState(null);

  const fetchUsers = async () => {
    try {
      const users = await pb.collection('users').getFullList({ $autoCancel: false });
      const map = {};
      users.forEach(u => map[u.id] = u.nama_lengkap);
      setUsersMap(map);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let filter = 'is_deleted = false || is_deleted = null';
      if (statusFilter !== 'all') {
        filter += ` && status = '${statusFilter}'`;
      }
      if (search) {
        filter += ` && judul ~ '${search.replace(/'/g, "\\'")}'`;
      }

      const result = await pb.collection('blog').getList(page, 10, {
        filter,
        sort: '-created',
        $autoCancel: false
      });

      setArticles(result.items);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengambil data artikel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchArticles();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, page]);

  const togglePublish = async (article) => {
    try {
      const newStatus = article.status === 'published' ? 'draft' : 'published';
      await pb.collection('blog').update(article.id, { status: newStatus }, { $autoCancel: false });
      toast.success(`Artikel berhasil di-${newStatus}`);
      fetchArticles();
    } catch (err) {
      toast.error('Gagal mengubah status artikel');
    }
  };

  const confirmDelete = (article) => {
    setArticleToDelete(article);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);
    try {
      await pb.collection('blog').update(articleToDelete.id, { is_deleted: true }, { $autoCancel: false });
      toast.success('Artikel berhasil dihapus');
      setDeleteModalOpen(false);
      fetchArticles();
    } catch (err) {
      toast.error('Gagal menghapus artikel');
    } finally {
      setIsDeleting(false);
    }
  };

  const openPreview = (article) => {
    setArticleToPreview(article);
    setPreviewModalOpen(true);
  };

  return (
    <>
      <Helmet><title>Kelola Blog | Admin Vityuu</title></Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex flex-grow max-w-7xl mx-auto w-full">
          <AdminSidebar />
          <main className="flex-grow p-6 md:p-8 overflow-x-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Kelola Artikel Blog</h1>
                <p className="text-muted-foreground text-sm">Total {totalItems} artikel tersedia</p>
              </div>
              <Link to="/admin/blog/new">
                <Button className="btn-primary"><Plus className="w-4 h-4 mr-2"/> Tulis Artikel Baru</Button>
              </Link>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/20">
                <div className="flex gap-2">
                  {['all', 'draft', 'published'].map(status => (
                    <button
                      key={status}
                      onClick={() => { setStatusFilter(status); setPage(1); }}
                      className={`px-4 py-2 text-sm font-medium rounded-xl capitalize transition-all ${
                        statusFilter === status 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'bg-transparent text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {status === 'all' ? 'Semua' : status}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Cari judul..." 
                    value={search} 
                    onChange={e => { setSearch(e.target.value); setPage(1); }} 
                    className="pl-9 bg-background h-10"
                  />
                </div>
              </div>

              <div className="overflow-x-auto flex-grow">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-semibold w-12">ID</th>
                      <th className="px-6 py-4 font-semibold">Judul & Penulis</th>
                      <th className="px-6 py-4 font-semibold">Tanggal</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border relative">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                          <p className="text-muted-foreground">Memuat data artikel...</p>
                        </td>
                      </tr>
                    ) : articles.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-16 text-center">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="text-lg font-medium text-foreground mb-1">Tidak ada artikel</p>
                          <p className="text-sm text-muted-foreground">Coba sesuaikan filter pencarian atau buat artikel baru.</p>
                        </td>
                      </tr>
                    ) : (
                      articles.map(article => (
                        <tr key={article.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{article.id.slice(0, 5)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0 border border-border">
                                {article.featured_image ? (
                                  <img src={pb.files.getURL(article, article.featured_image)} alt="" className="w-full h-full object-cover" />
                                ) : <FileText className="w-5 h-5 m-3.5 text-muted-foreground"/>}
                              </div>
                              <div>
                                <p className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{article.judul}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{usersMap[article.author_id] || 'Admin'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {new Date(article.created).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={`font-semibold border-none ${article.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                              {article.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => togglePublish(article)} 
                                title={article.status === 'published' ? 'Unpublish' : 'Publish'}
                                className={`h-8 w-8 ${article.status === 'published' ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100' : 'text-muted-foreground hover:text-foreground'}`}
                              >
                                {article.status === 'published' ? <CheckCircle className="w-4 h-4"/> : <Circle className="w-4 h-4"/>}
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openPreview(article)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <Eye className="w-4 h-4"/>
                              </Button>
                              <Link to={`/admin/blog/${article.id}/edit`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                                  <Edit2 className="w-4 h-4"/>
                                </Button>
                              </Link>
                              <Button variant="ghost" size="icon" onClick={() => confirmDelete(article)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                <Trash2 className="w-4 h-4"/>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {!loading && totalPages > 1 && (
                <div className="p-4 border-t border-border flex items-center justify-between bg-background">
                  <p className="text-sm text-muted-foreground">Halaman {page} dari {totalPages}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                      <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
        isLoading={isDeleting}
        title="Hapus Artikel"
        message={`Yakin ingin menghapus artikel "${articleToDelete?.judul}"? Aksi ini tidak dapat dibatalkan.`}
        confirmText="Hapus Artikel"
      />

      <AdminBlogPreviewModal 
        isOpen={previewModalOpen} 
        onClose={() => setPreviewModalOpen(false)} 
        article={articleToPreview} 
      />
    </>
  );
};

export default AdminBlogPage;
