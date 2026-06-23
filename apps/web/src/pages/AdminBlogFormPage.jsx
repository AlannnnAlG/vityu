
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Check, Image as ImageIcon, ArrowLeft, Loader2, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import Header from '@/components/Header.jsx';
import AdminBlogPreviewModal from '@/components/AdminBlogPreviewModal.jsx';
import ConfirmationModal from '@/components/ConfirmationModal.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AdminBlogFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEdit = !!id;
  
  const contentEditableRef = useRef(null);
  
  const [formData, setFormData] = useState({
    judul: '',
    slug: '',
    konten: '',
    excerpt: '',
    kategori: 'tips',
    tags: '',
    status: 'draft',
    meta_description: ''
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchArticle = async () => {
        try {
          const article = await pb.collection('blog').getOne(id, { $autoCancel: false });
          setFormData({
            judul: article.judul,
            slug: article.slug,
            konten: article.konten,
            excerpt: article.excerpt || '',
            kategori: article.kategori || 'tips',
            tags: article.tags || '',
            status: article.status || 'draft',
            meta_description: article.meta_description || ''
          });
          if (contentEditableRef.current) {
            contentEditableRef.current.innerHTML = article.konten;
          }
          if (article.featured_image) {
            setImagePreview(pb.files.getURL(article, article.featured_image));
          }
        } catch (err) {
          toast.error('Gagal mengambil data artikel');
          navigate('/admin/blog');
        }
      };
      fetchArticle();
    }
  }, [id, isEdit, navigate]);

  // Generate Slug
  useEffect(() => {
    if (!isEdit && formData.judul) {
      const timer = setTimeout(() => {
        const slug = formData.judul.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, slug }));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.judul, isEdit]);

  // Auto-save draft
  useEffect(() => {
    if (!formData.judul || formData.status === 'published') return;
    
    const timer = setInterval(async () => {
      setAutoSaving(true);
      try {
        await saveArticle('draft', true);
      } catch (e) {
        console.error('Auto-save failed', e);
      } finally {
        setAutoSaving(false);
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(timer);
  }, [formData, isEdit]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentInput = () => {
    if (contentEditableRef.current) {
      setFormData({ ...formData, konten: contentEditableRef.current.innerHTML });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const execCmd = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg);
    handleContentInput();
    contentEditableRef.current.focus();
  };

  const checkSlugUnique = async (slugToCheck) => {
    try {
      const records = await pb.collection('blog').getFullList({
        filter: `slug = '${slugToCheck}' ${isEdit ? `&& id != '${id}'` : ''}`,
        $autoCancel: false
      });
      return records.length === 0;
    } catch (e) {
      return false;
    }
  };

  const saveArticle = async (forcedStatus = null, isAutoSave = false) => {
    if (!formData.judul || !formData.konten) {
      if (!isAutoSave) toast.error('Judul dan konten wajib diisi');
      throw new Error('Validation failed');
    }

    const finalStatus = forcedStatus || formData.status;
    const isUnique = await checkSlugUnique(formData.slug);
    if (!isUnique) {
      if (!isAutoSave) toast.error('Slug sudah digunakan, silakan ubah slug');
      throw new Error('Slug not unique');
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'status') data.append('status', finalStatus);
      else data.append(key, formData[key]);
    });
    
    if (featuredImage) data.append('featured_image', featuredImage);
    if (!isEdit && currentUser) data.append('author_id', currentUser.id);

    try {
      if (isEdit) {
        await pb.collection('blog').update(id, data, { $autoCancel: false });
      } else {
        const record = await pb.collection('blog').create(data, { $autoCancel: false });
        if (!isAutoSave) navigate(`/admin/blog/${record.id}/edit`, { replace: true });
      }
      return true;
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e, forcedStatus = null) => {
    if(e) e.preventDefault();
    setLoading(true);
    try {
      await saveArticle(forcedStatus);
      toast.success(forcedStatus === 'published' ? 'Artikel berhasil dipublish' : 'Draft berhasil disimpan');
      if (forcedStatus === 'published') navigate('/admin/blog');
    } catch (err) {
      if(err.message !== 'Validation failed' && err.message !== 'Slug not unique') {
        toast.error('Gagal menyimpan artikel');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await pb.collection('blog').update(id, { is_deleted: true }, { $autoCancel: false });
      toast.success('Artikel dihapus');
      navigate('/admin/blog');
    } catch (err) {
      toast.error('Gagal menghapus artikel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'} | Admin Vityuu</title></Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex flex-grow max-w-7xl mx-auto w-full">
          <AdminSidebar />
          <main className="flex-grow p-6 md:p-8 overflow-x-hidden">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')} className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    {autoSaving && <span className="text-xs text-muted-foreground flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Menyimpan otomatis...</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setPreviewModalOpen(true)}>
                  <Eye className="w-4 h-4 mr-2" /> Preview
                </Button>
                <Button variant="secondary" onClick={(e) => handleSubmit(e, 'draft')} disabled={loading} className="bg-muted text-foreground hover:bg-muted/80 border-border">
                  <Save className="w-4 h-4 mr-2" /> Simpan Draft
                </Button>
                <Button onClick={(e) => handleSubmit(e, 'published')} disabled={loading} className="btn-primary">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />} Publish
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="judul">Judul Artikel <span className="text-destructive">*</span></Label>
                    <Input id="judul" name="judul" value={formData.judul} onChange={handleInputChange} className="text-lg font-medium h-12" placeholder="Masukkan judul yang menarik..." required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug URL</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm bg-muted px-3 py-2 rounded-lg border border-border h-10 flex items-center">vityuu.com/blog/</span>
                      <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} className="h-10" />
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Label>Konten Artikel <span className="text-destructive">*</span></Label>
                    <div className="border border-border rounded-xl overflow-hidden bg-background">
                      <div className="bg-muted/50 p-2 flex flex-wrap gap-1 border-b border-border">
                        <Button type="button" variant="ghost" size="sm" onClick={() => execCmd('bold')} className="h-8 px-2 font-bold">B</Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => execCmd('italic')} className="h-8 px-2 italic">I</Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => execCmd('underline')} className="h-8 px-2 underline">U</Button>
                        <div className="w-px h-6 bg-border mx-1 my-auto"></div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => execCmd('formatBlock', 'H2')} className="h-8 px-2 font-bold">H2</Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => execCmd('formatBlock', 'H3')} className="h-8 px-2 font-bold">H3</Button>
                        <div className="w-px h-6 bg-border mx-1 my-auto"></div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => execCmd('insertUnorderedList')} className="h-8 px-2">• List</Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => execCmd('insertOrderedList')} className="h-8 px-2">1. List</Button>
                      </div>
                      <div 
                        ref={contentEditableRef}
                        contentEditable
                        onInput={handleContentInput}
                        onBlur={handleContentInput}
                        className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto focus:outline-none prose prose-sm sm:prose lg:prose-lg max-w-none"
                        placeholder="Mulai menulis konten di sini..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-bold text-lg border-b border-border pb-2">Featured Image</h3>
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-border group">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg text-sm font-medium">
                            Ganti Gambar
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                          <ImageIcon className="w-8 h-8 mb-2" />
                          <p className="text-sm font-medium">Klik untuk upload gambar</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-bold text-lg border-b border-border pb-2">Detail Artikel</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="kategori">Kategori</Label>
                    <Select value={formData.kategori} onValueChange={(val) => setFormData({...formData, kategori: val})}>
                      <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tips">Tips</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                    <Input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="skincare, beauty, tips" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt (Ringkasan Singkat)</Label>
                    <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows={3} placeholder="Tampil di halaman daftar blog..." />
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label>Status Artikel</Label>
                    <RadioGroup value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="draft" id="r-draft" />
                        <Label htmlFor="r-draft" className="font-normal cursor-pointer">Draft</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="published" id="r-pub" />
                        <Label htmlFor="r-pub" className="font-normal cursor-pointer">Published</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {isEdit && (
                  <div className="pt-4">
                    <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={() => setDeleteModalOpen(true)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Hapus Artikel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
        isLoading={loading}
        title="Hapus Artikel"
        message={`Yakin ingin menghapus artikel "${formData.judul}"? Aksi ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
      />

      <AdminBlogPreviewModal 
        isOpen={previewModalOpen} 
        onClose={() => setPreviewModalOpen(false)} 
        article={{...formData, featured_image: featuredImage || formData.featured_image}} 
      />
    </>
  );
};

export default AdminBlogFormPage;
