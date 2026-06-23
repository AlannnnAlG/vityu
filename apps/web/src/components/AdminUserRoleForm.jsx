
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AdminUserRoleForm = ({ isOpen, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    role: 'user',
    status: 'active',
    catatan: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        role: user.role || 'user',
        status: user.verified ? 'active' : 'inactive',
        catatan: ''
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Using verified field as proxy for Active/Inactive status
      await pb.collection('users').update(user.id, {
        role: formData.role,
        verified: formData.status === 'active'
      }, { $autoCancel: false });
      
      toast.success('Role dan status berhasil diperbarui');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Gagal memperbarui pengguna');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Pengguna: {user.nama_lengkap}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-3">
            <Label>Role Akses</Label>
            <RadioGroup value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})} className="flex gap-4">
              <div className="flex items-center space-x-2 border border-border rounded-lg p-3 flex-1 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="user" id="role-user" />
                <Label htmlFor="role-user" className="cursor-pointer flex-1">User Regular</Label>
              </div>
              <div className="flex items-center space-x-2 border border-border rounded-lg p-3 flex-1 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="admin" id="role-admin" />
                <Label htmlFor="role-admin" className="cursor-pointer flex-1">Admin</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Status Akun</Label>
            <RadioGroup value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})} className="flex gap-4">
              <div className="flex items-center space-x-2 border border-border rounded-lg p-3 flex-1 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="active" id="status-active" />
                <Label htmlFor="status-active" className="cursor-pointer flex-1 text-emerald-600">Active</Label>
              </div>
              <div className="flex items-center space-x-2 border border-border rounded-lg p-3 flex-1 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="inactive" id="status-inactive" />
                <Label htmlFor="status-inactive" className="cursor-pointer flex-1 text-muted-foreground">Inactive</Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">Akun Inactive tidak dapat melakukan checkout pesanan.</p>
          </div>

          <div className="space-y-2">
            <Label>Catatan Admin (Opsional)</Label>
            <Textarea value={formData.catatan} onChange={(e) => setFormData({...formData, catatan: e.target.value})} placeholder="Catatan perubahan role..." rows={2} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2"/>} Simpan Perubahan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUserRoleForm;
