
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
    kategori: 'skincare',
    stok: '',
    status: 'published',
    spesifikasi: '',
    ingredients: '',
    cara_penggunaan: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        nama_produk: product.nama_produk,
        deskripsi: product.deskripsi || '',
        harga: product.harga.toString(),
        harga_diskon: product.harga_diskon ? product.harga_diskon.toString() : '',
        kategori: product.kategori || 'skincare',
        stok: product.stok.toString(),
        status: product.status || 'published',
        spesifikasi: product.spesifikasi || '',
        ingredients: product.ingredients || '',
        cara_penggunaan: product.cara_penggunaan || ''
      });
    } else {
      setFormData({
        nama_produk: '', deskripsi: '', harga: '', harga_diskon: '', kategori: 'skincare',
        stok: '', status: 'published', spesifikasi: '', ingredients: '', cara_penggunaan: ''
      });
    }
    setImageFile(null);
  }, [product, isOpen]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSelect = (name, val) => setFormData({ ...formData, [name]: val });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append('gambar_produk', imageFile);

      if (product) {
        await pb.collection('products').update(product.id, data, { $autoCancel: false });
        toast.success('Produk diperbarui');
      } else {
        await pb.collection('products').create(data, { $autoCancel: false });
        toast.success('Produk ditambahkan');
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan produk');
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
      toast.error('Gagal menghapus produk');
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
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Nama Produk</Label>
              <Input name="nama_produk" value={formData.nama_produk} onChange={handleChange} required />
            </div>
            
            <div className="space-y-2">
              <Label>Harga (Rp)</Label>
              <Input name="harga" type="number" value={formData.harga} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Harga Diskon (Rp) - Opsional</Label>
              <Input name="harga_diskon" type="number" value={formData.harga_diskon} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={formData.kategori} onValueChange={(v) => handleSelect('kategori', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="skincare">Skincare</SelectItem>
                  <SelectItem value="makeup">Makeup</SelectItem>
                  <SelectItem value="haircare">Haircare</SelectItem>
                  <SelectItem value="bodycare">Bodycare</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Stok</Label>
              <Input name="stok" type="number" value={formData.stok} onChange={handleChange} required />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Deskripsi Singkat</Label>
              <Textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={3} />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Gambar Produk</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:bg-muted/50 transition-colors">
                <input type="file" id="gambar" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                <label htmlFor="gambar" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm font-medium">{imageFile ? imageFile.name : 'Pilih atau drop file gambar'}</span>
                </label>
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Status</Label>
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
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>Hapus</Button>
            ) : <div />}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
              <Button type="submit" className="btn-primary" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Simpan
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditProductForm;
