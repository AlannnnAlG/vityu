
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

const AdminOrderEmailModal = ({ isOpen, onClose, order }) => {
  const [template, setTemplate] = useState('custom');
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order && isOpen) {
      applyTemplate('custom');
    }
  }, [order, isOpen]);

  const applyTemplate = (val) => {
    setTemplate(val);
    const orderNo = order?.nomor_pesanan || '';
    const name = order?.user?.nama_lengkap || 'Pelanggan';

    switch (val) {
      case 'confirmation':
        setFormData({
          subject: `Konfirmasi Pesanan Vityuu - ${orderNo}`,
          message: `Halo ${name},\n\nTerima kasih telah berbelanja di Vityuu. Pesanan Anda dengan nomor ${orderNo} sedang kami proses.\n\nSalam,\nTim Vityuu`
        });
        break;
      case 'shipping':
        setFormData({
          subject: `Pesanan Anda Dikirim - ${orderNo}`,
          message: `Halo ${name},\n\nKabar baik! Pesanan Anda (${orderNo}) telah diserahkan ke pihak kurir (${order?.kurir_pengiriman || '-'}).\n\nNomor Resi: ${order?.nomor_tracking || '-'}\n\nTerima kasih,\nTim Vityuu`
        });
        break;
      case 'delivery':
        setFormData({
          subject: `Pesanan Selesai - ${orderNo}`,
          message: `Halo ${name},\n\nPesanan Anda (${orderNo}) telah berstatus Delivered/Selesai. Terima kasih atas kepercayaan Anda kepada Vityuu!\n\nJangan lupa berikan review produk kami ya.\n\nSalam,\nTim Vityuu`
        });
        break;
      default:
        setFormData({ subject: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Dummy implementation since there's no specific explicit backend endpoint provided
    setTimeout(() => {
      toast.success(`Email terkirim ke ${order?.user?.email}`);
      setLoading(false);
      onClose();
    }, 1500);
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Mail className="w-5 h-5"/> Kirim Email ke Pelanggan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          
          <div className="space-y-2">
            <Label>Penerima</Label>
            <Input value={order.user?.email || 'Email tidak tersedia'} readOnly className="bg-muted text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <Label>Pilih Template</Label>
            <Select value={template} onValueChange={applyTemplate}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Message</SelectItem>
                <SelectItem value="confirmation">Order Confirmation</SelectItem>
                <SelectItem value="shipping">Shipping Notification</SelectItem>
                <SelectItem value="delivery">Delivery Confirmation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Subjek Email <span className="text-destructive">*</span></Label>
            <Input value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
          </div>

          <div className="space-y-2">
            <Label>Pesan Email <span className="text-destructive">*</span></Label>
            <Textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={6} required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2"/>} Kirim Email
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOrderEmailModal;
