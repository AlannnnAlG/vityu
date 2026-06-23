
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AdminOrderStatusForm = ({ isOpen, onClose, order, onSuccess }) => {
  const [formData, setFormData] = useState({
    status_pembayaran: 'pending',
    status_pesanan: 'pending',
    kurir_pengiriman: '',
    nomor_tracking: '',
    catatan: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order && isOpen) {
      setFormData({
        status_pembayaran: order.status_pembayaran || 'pending',
        status_pesanan: order.status_pesanan || 'pending',
        kurir_pengiriman: order.kurir_pengiriman || '',
        nomor_tracking: order.nomor_tracking || '',
        catatan: '' // Reset local notes
      });
    }
  }, [order, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pb.collection('orders').update(order.id, {
        status_pembayaran: formData.status_pembayaran,
        status_pesanan: formData.status_pesanan,
        kurir_pengiriman: formData.kurir_pengiriman,
        nomor_tracking: formData.nomor_tracking
      }, { $autoCancel: false });
      
      toast.success('Status pesanan berhasil diperbarui');
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui status');
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Status: {order.nomor_pesanan}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Status Pembayaran</Label>
            <Select value={formData.status_pembayaran} onValueChange={(v) => setFormData({...formData, status_pembayaran: v})}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Status Pesanan</Label>
            <Select value={formData.status_pesanan} onValueChange={(v) => setFormData({...formData, status_pesanan: v})}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kurir (Opsional)</Label>
              <Input value={formData.kurir_pengiriman} onChange={(e) => setFormData({...formData, kurir_pengiriman: e.target.value})} placeholder="JNE, GoSend" />
            </div>
            <div className="space-y-2">
              <Label>No. Resi (Opsional)</Label>
              <Input value={formData.nomor_tracking} onChange={(e) => setFormData({...formData, nomor_tracking: e.target.value})} placeholder="Resi pelacakan" />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label>Catatan Admin (Internal)</Label>
            <Textarea value={formData.catatan} onChange={(e) => setFormData({...formData, catatan: e.target.value})} placeholder="Catatan opsional..." rows={2} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2"/>} Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOrderStatusForm;
