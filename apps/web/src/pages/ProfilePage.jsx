import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Bell, Clock, FileDown, Trash2, Package } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useUserName } from '@/hooks/useUserName.js';
import SettingToggle from '@/components/SettingToggle.jsx';
import { toast } from 'sonner';

const ProfilePage = () => {
  const [cravings, setCravings] = useLocalStorage('vityu_cravings', []);
  const [userName, setUserName] = useUserName();
  const [settings, setSettings] = useLocalStorage('vityu_settings', { reminder: true, notifications: false });
  const [orders] = useLocalStorage('vityu_orders', []);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);

  const joinDate = cravings.length > 0 
    ? new Date(cravings[cravings.length - 1].timestamp).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
    : 'Hari ini';

  const handleSaveProfile = () => {
    if (editName.trim()) {
      setUserName(editName.trim());
      setIsEditing(false);
      toast.success('Profil berhasil diperbarui');
    } else {
      toast.error('Nama tidak boleh kosong');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ profile: { name: userName }, cravings, settings, orders }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vityu_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Data berhasil diekspor');
  };

  const handleClearData = () => {
    if (window.confirm('Yakin ingin menghapus semua data permanen? Tindakan ini tidak bisa dibatalkan.')) {
      setCravings([]);
      setUserName('Vityu Lover');
      window.localStorage.removeItem('vityu_orders');
      window.localStorage.removeItem('vityu_checkout');
      toast.success('Semua data berhasil dihapus');
      window.location.reload();
    }
  };

  return (
    <>
      <Helmet>
        <title>Vityu - Profil</title>
      </Helmet>

      <div className="w-full flex flex-col p-4 gap-8 pb-8">
        {/* User Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    className="w-full p-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-background text-foreground"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nama kamu"
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-foreground">{userName}</h2>
                  <p className="text-sm text-muted-foreground">Member Vityu</p>
                </>
              )}
            </div>
          </div>
          
          <button 
            onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
            className="w-full min-h-[44px] bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 active:scale-[0.98] transition-all"
          >
            {isEditing ? 'Simpan Perubahan' : 'Edit Profil'}
          </button>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-4">
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Bergabung</p>
            <p className="text-lg font-bold text-foreground">{joinDate}</p>
          </div>
          <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Total Logs</p>
            <p className="text-lg font-bold text-foreground">{cravings.length}</p>
          </div>
        </motion.div>

        {/* Order History */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col gap-3">
          <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Pesanan Saya
          </h3>
          
          {orders.length === 0 ? (
            <div className="bg-muted/30 border border-dashed rounded-2xl p-6 text-center">
              <p className="text-sm font-medium text-muted-foreground">Belum ada pesanan.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map(order => (
                <div key={order.id} className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer hover:border-primary transition-colors active:scale-[0.99]">
                  <div className="flex justify-between items-start border-b pb-3">
                    <div>
                      <span className="text-xs font-bold bg-muted px-2 py-1 rounded-md font-mono">{order.id}</span>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-xs text-muted-foreground font-medium">{order.items.length} Barang</p>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Total Belanja</p>
                      <p className="text-sm font-bold text-foreground">Rp {order.total.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Settings */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-3">
          <h3 className="font-bold text-lg mb-1">Pengaturan</h3>
          <SettingToggle 
            icon={Clock} 
            label="Pengingat" 
            description="Ingatkan saya untuk mencatat jurnal harian"
            checked={settings.reminder}
            onCheckedChange={(val) => setSettings({...settings, reminder: val})}
          />
          <SettingToggle 
            icon={Bell} 
            label="Notifikasi" 
            description="Info voucher dan diskon terbaru"
            checked={settings.notifications}
            onCheckedChange={(val) => setSettings({...settings, notifications: val})}
          />
        </motion.div>

        {/* Data Management */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-3">
          <h3 className="font-bold text-lg mb-1 text-destructive">Data</h3>
          <button onClick={handleExport} className="flex items-center gap-3 p-4 bg-card border rounded-2xl text-left font-bold text-sm active:scale-[0.98] transition-all hover:bg-muted/50">
            <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
              <FileDown className="h-5 w-5 text-foreground" />
            </div>
            Export Data Lokal
          </button>
          <button onClick={handleClearData} className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-2xl text-left font-bold text-sm text-destructive active:scale-[0.98] transition-all hover:bg-destructive/10">
            <div className="h-10 w-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            Hapus Semua Data
          </button>
        </motion.div>

        <div className="text-center mt-4">
          <p className="text-xs font-medium text-muted-foreground">Vityu App v1.2.0</p>
          <p className="text-xs text-muted-foreground mt-1">Dibuat dengan ❤️ untuk gaya hidup sehat.</p>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;