import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AddEditProductForm = ({ isOpen, onClose, product, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama_produk: '',
    deskripsi: '',
    harga: '',
    harga_diskon: '',
    kategori: 'skincare', // 🔥 DEFAULT skincare (biar match database)
    stok: '',
    status: 'published',
    spesifikasi: '',
    ingredients: '',
    cara_penggunaan: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorDetail, setErrorDetail] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        nama_produk: product.nama_produk || '',
        deskripsi: product.deskripsi || '',
        harga: product.harga ? product.harga.toString() : '',
        harga_diskon: product.harga_diskon ? product.harga_diskon.toString() : '',
        kategori: product.kategori || 'skincare',
        stok: product.stok ? product.stok.toString() : '',
        status: product.status || 'published',
        spesifikasi: product.spesifikasi || '',
        ingredients: product.ingredients || '',
        cara_penggunaan: product.cara_penggunaan || ''
      });
    } else {
      setFormData({
        nama_produk: '',
        deskripsi: '',
        harga: '',
        harga_diskon: '',
        kategori: 'skincare',
        stok: '',
        status: 'published',
        spesifikasi: '',
        ingredients: '',
        cara_penggunaan: ''
      });
    }
    setImageFile(null);
    setErrorDetail(null);
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorDetail(null);
  };

  const handleSelect = (name, val) => {
    setFormData({ ...formData, [name]: val });
    setErrorDetail(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorDetail(null);
    
    try {
      setLoading(true);
      
      // 🔥 VALIDASI KETAT
      if (!formData.nama_produk || formData.nama_produk.trim() === '') {
        toast.error('Nama produk wajib diisi!');
        setLoading(false);
        return;
      }
      
      if (!formData.harga || formData.harga === '' || parseInt(formData.harga) <= 0) {
        toast.error('Harga wajib diisi dan harus lebih dari 0!');
        setLoading(false);
        return;
      }
      
      if (!formData.stok || formData.stok === '' || parseInt(formData.stok) < 0) {
        toast.error('Stok wajib diisi!');
        setLoading(false);
        return;
      }

      if (!formData.kategori || formData.kategori.trim() === '') {
        toast.error('Kategori wajib diisi!');
        setLoading(false);
        return;
      }

      // 🔥 KONVERSI DATA
      const dataToSend = {
        nama_produk: formData.nama_produk.trim(),
        deskripsi: formData.deskripsi || '',
        harga: parseInt(formData.harga) || 0,
        harga_diskon: formData.harga_diskon ? parseInt(formData.harga_diskon) : null,
        kategori: formData.kategori.toLowerCase().trim(),
        stok: parseInt(formData.stok) || 0,
        status: formData.status || 'published',
        spesifikasi: formData.spesifikasi || '',
        ingredients: formData.ingredients || '',
        cara_penggunaan: formData.cara_penggunaan || ''
      };

      console.log('📦 Data yang dikirim:', dataToSend);

      // 🔥 CEK FIELD YANG REQUIRED
      const requiredFields = ['nama_produk', 'harga', 'kategori', 'stok', 'status'];
      const missingFields = requiredFields.filter(field => {
        const value = dataToSend[field];
        return value === undefined || value === null || value === '';
      });
      
      if (missingFields.length > 0) {
        toast.error(`Field wajib kosong: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      let result;
      if (product) {
        // UPDATE
        if (imageFile) {
          const formDataWithImage = new FormData();
          Object.keys(dataToSend).forEach(key => {
            formDataWithImage.append(key, dataToSend[key]);
          });
          formDataWithImage.append('gambar_produk', imageFile);
          result = await pb.collection('products').update(product.id, formDataWithImage, { $autoCancel: false });
        } else {
          result = await pb.collection('products').update(product.id, dataToSend, { $autoCancel: false });
        }
        toast.success('Produk berhasil diperbarui!');
      } else {
        // CREATE
        if (imageFile) {
          const formDataWithImage = new FormData();
          Object.keys(dataToSend).forEach(key => {
            formDataWithImage.append(key, dataToSend[key]);
          });
          formDataWithImage.append('gambar_produk', imageFile);
          result = await pb.collection('products').create(formDataWithImage, { $autoCancel: false });
        } else {
          result = await pb.collection('products').create(dataToSend, { $autoCancel: false });
        }
        toast.success('Produk berhasil ditambahkan!');
      }

      console.log('✅ Success:', result);
      onSuccess();
      onClose();
      
    } catch (err) {
      console.error('❌ ERROR:', err);
      console.error('❌ Response:', err.response);
      
      // 🔥 TAMPILKAN ERROR DETAIL
      let errorMessage = 'Gagal menyimpan produk';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // 🔥 TAMPILKAN FIELD YANG BERMASALAH
      if (err.response?.data?.data) {
        const fieldErrors = err.response.data.data;
        const fieldNames = Object.keys(fieldErrors);
        if (fieldNames.length > 0) {
          errorMessage += `\n❌ Field bermasalah: ${fieldNames.join(', ')}`;
          setErrorDetail(JSON.stringify(fieldErrors, null, 2));
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      setLoading(true);
      await pb.collection('products').update(product.id, { is_deleted: true }, { $autoCancel: false });
      toast.success('Produk dihapus');
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus produk: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
        </DialogHeader>
        
        {/* 🔥 TAMPILKAN ERROR DETAIL */}
        {errorDetail && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-xs font-mono text-red-600 dark:text-red-400 max-h-40 overflow-auto">
            <strong>Error Detail:</strong>
            <pre className="mt-1 whitespace-pre-wrap">{errorDetail}</pre>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Nama Produk <span className="text-red-500">*</span></Label>
              <Input 
                name="nama_produk" 
                value={formData.nama_produk} 
                onChange={handleChange} 
                required 
                placeholder="Contoh: Vityuu Miracle Tea"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Harga (Rp) <span className="text-red-500">*</span></Label>
              <Input 
                name="harga" 
                type="number" 
                value={formData.harga} 
                onChange={handleChange} 
                required 
                placeholder="50000"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Harga Diskon (Rp) - Opsional</Label>
              <Input 
                name="harga_diskon" 
                type="number" 
                value={formData.harga_diskon} 
                onChange={handleChange} 
                placeholder="45000"
                min="0"
              />
            </div>

            {/* 🔥 DROPDOWN KATEGORI - HANYA YANG ADA DI DATABASE */}
            <div className="space-y-2">
              <Label>Kategori <span className="text-red-500">*</span></Label>
              <Select value={formData.kategori} onValueChange={(v) => handleSelect('kategori', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="skincare">🍵 Teh Herbal</SelectItem>
                  <SelectItem value="bodycare">🌿 Minuman Herbal</SelectItem>
                  <SelectItem value="makeup">💄 Makeup</SelectItem>
                  <SelectItem value="haircare">💇 Haircare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stok <span className="text-red-500">*</span></Label>
              <Input 
                name="stok" 
                type="number" 
                value={formData.stok} 
                onChange={handleChange} 
                required 
                placeholder="100"
                min="0"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Deskripsi Singkat</Label>
              <Textarea 
                name="deskripsi" 
                value={formData.deskripsi} 
                onChange={handleChange} 
                rows={3} 
                placeholder="Deskripsi singkat produk..."
              />
            </div>

            {/* 🔥 FIELD TAMBAHAN UNTUK PRODUK VITYUU */}
            <div className="space-y-2 col-span-2">
              <Label>Kandungan / Ingredients</Label>
              <Textarea 
                name="ingredients" 
                value={formData.ingredients} 
                onChange={handleChange} 
                rows={2} 
                placeholder="Contoh: Kayu Manis, Spearmint, Peppermint, Lemon, Teh Hijau"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Cara Penggunaan</Label>
              <Textarea 
                name="cara_penggunaan" 
                value={formData.cara_penggunaan} 
                onChange={handleChange} 
                rows={2} 
                placeholder="Contoh: Seduh dengan air panas 200ml, minum jam 9 pagi dan 9 malam"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Spesifikasi Produk</Label>
              <Textarea 
                name="spesifikasi" 
                value={formData.spesifikasi} 
                onChange={handleChange} 
                rows={2} 
                placeholder="Contoh: 20 tea bag, BPOM terdaftar, 100% herbal alami"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Gambar Produk</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:bg-muted/50 transition-colors">
                <input 
                  type="file" 
                  id="gambar" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      console.log('📷 File selected:', file.name);
                    }
                  }} 
                />
                <label htmlFor="gambar" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {imageFile ? imageFile.name : 'Pilih atau drop file gambar'}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Status <span className="text-red-500">*</span></Label>
              <Select value={formData.status} onValueChange={(v) => handleSelect('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-border mt-6">
            {product ? (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Hapus
              </Button>
            ) : <div />}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Simpan
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditProductForm;