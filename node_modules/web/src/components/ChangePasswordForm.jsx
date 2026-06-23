
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const ChangePasswordForm = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    password: '',
    passwordConfirm: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password minimal 8 karakter');
      return;
    }

    try {
      setLoading(true);
      await pb.collection('users').update(user.id, {
        oldPassword: formData.oldPassword,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm
      }, { $autoCancel: false });
      
      toast.success('Password berhasil diperbarui');
      onClose();
      // Clear form
      setFormData({ oldPassword: '', password: '', passwordConfirm: '' });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui password. Pastikan password lama benar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ubah Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Password Lama</Label>
            <Input id="oldPassword" name="oldPassword" type="password" value={formData.oldPassword} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password Baru</Label>
            <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Konfirmasi Password Baru</Label>
            <Input id="passwordConfirm" name="passwordConfirm" type="password" value={formData.passwordConfirm} onChange={handleChange} required />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white font-semibold" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Ubah Password
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordForm;
