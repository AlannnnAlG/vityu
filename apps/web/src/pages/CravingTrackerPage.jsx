import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import CravingCard from '@/components/CravingCard.jsx';
import { Slider } from '@/components/ui/slider';

const CravingTrackerPage = () => {
  const [cravings, setCravings] = useLocalStorage('vityu_cravings', []);
  
  const [formData, setFormData] = useState({
    time: new Date().toISOString().slice(0, 16),
    intensity: 5,
    trigger: '',
    notes: ''
  });

  const triggers = [
    { value: 'stress', label: 'Stres' },
    { value: 'boredom', label: 'Bosan' },
    { value: 'habit', label: 'Kebiasaan' },
    { value: 'social', label: 'Sosial' },
    { value: 'emotional', label: 'Emosional' },
    { value: 'other', label: 'Lainnya' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.trigger) {
      toast.error('Pilih pemicu (trigger) terlebih dahulu');
      return;
    }

    const newCraving = {
      id: Date.now().toString(),
      timestamp: new Date(formData.time).toISOString(),
      intensity: formData.intensity,
      trigger: formData.trigger,
      notes: formData.notes
    };

    setCravings([newCraving, ...cravings]);
    toast.success('Craving berhasil dicatat! +10 Poin');
    
    setFormData({
      time: new Date().toISOString().slice(0, 16),
      intensity: 5,
      trigger: '',
      notes: ''
    });
  };

  const recentCravings = cravings.slice(0, 5);

  return (
    <>
      <Helmet>
        <title>Vityu - Tracker</title>
      </Helmet>

      <div className="w-full flex flex-col p-4 gap-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-1">Catat Craving</h1>
          <p className="text-sm text-muted-foreground mb-6">Pahami kebiasaanmu dengan mencatat setiap dorongan.</p>

          <form onSubmit={handleSubmit} className="bg-card border rounded-3xl p-5 flex flex-col gap-5 shadow-sm">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold">Waktu</label>
              <input
                type="datetime-local"
                required
                className="w-full min-h-[48px] px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-3 bg-muted/40 p-4 rounded-2xl">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold">Intensitas</label>
                <span className="text-xl font-extrabold text-primary">{formData.intensity}/10</span>
              </div>
              <Slider
                value={[formData.intensity]}
                onValueChange={(val) => setFormData({ ...formData, intensity: val[0] })}
                min={1}
                max={10}
                step={1}
                className="py-2"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold">Pemicu</label>
              <select
                required
                className="w-full min-h-[48px] px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                value={formData.trigger}
                onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
              >
                <option value="" disabled>Pilih pemicu utama...</option>
                {triggers.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold">Catatan Khusus (Opsional)</label>
              <textarea
                placeholder="Bagaimana perasaanmu saat ini?"
                rows={3}
                className="w-full p-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] bg-primary text-primary-foreground font-bold rounded-xl active:scale-[0.98] transition-transform mt-2"
            >
              Simpan
            </button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-bold mb-4">Riwayat Terakhir</h2>
          {recentCravings.length === 0 ? (
            <div className="text-center p-8 bg-muted/30 rounded-2xl border border-dashed">
              <p className="text-sm text-muted-foreground font-medium">Belum ada catatan. Mulai pantau progressmu hari ini!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentCravings.map((craving, i) => (
                <CravingCard key={craving.id || i} craving={craving} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default CravingTrackerPage;