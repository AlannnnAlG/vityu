
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const EditProfileForm = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    nama_lengkap: user?.nama_lengkap || '',
    nomor_telepon: user?.nomor_telepon || '',
    alamat: user?.alamat || '',
    kota: user?.kota || '',
    provinsi: user?.provinsi || '',
    kode_pos: user?.kode_pos || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const record = await pb.collection('users').update(user.id, formData, { $autoCancel: false });
      toast.success('Profil berhasil diperbarui');
      onUpdate(record);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
            <Input id="nama_lengkap" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nomor_telepon">Nomor Telepon</Label>
            <Input id="nomor_telepon" name="nomor_telepon" value={formData.nomor_telepon} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat Lengkap</Label>
            <Input id="alamat" name="alamat" value={formData.alamat} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kota">Kota/Kabupaten</Label>
              <Input id="kota" name="kota" value={formData.kota} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provinsi">Provinsi</Label>
              <Input id="provinsi" name="provinsi" value={formData.provinsi} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="kode_pos">Kode Pos</Label>
            <Input id="kode_pos" name="kode_pos" value={formData.kode_pos} onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileForm;
