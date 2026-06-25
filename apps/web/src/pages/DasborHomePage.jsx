import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Flame, Award, BookOpen, Sparkles, X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useUserName } from '@/hooks/useUserName.js';
import { calculateStreak } from '@/utils/calculateStreak.js';
import {
  STREAK_MILESTONES,
  checkAndUnlockVouchers,
} from '@/utils/streakVouchers.js';

const DasborHomePage = () => {
  const [cravings] = useLocalStorage('vityu_cravings', []);
  const [userName] = useUserName();
  const [newVoucherBanner, setNewVoucherBanner] = useState(null);

  const streak = calculateStreak(cravings);
  const totalCravings = cravings.length;
  const points = totalCravings * 10;

  // Cek apakah ada voucher baru yang di-unlock hari ini
  useEffect(() => {
    const freshlyUnlocked = checkAndUnlockVouchers(streak);
    if (freshlyUnlocked.length > 0) {
      setNewVoucherBanner(freshlyUnlocked[0]);
    }
  }, [streak]);

  // Milestone berikutnya
  const nextMilestone = STREAK_MILESTONES.find((m) => streak < m.days);
  const streakProgressToNext = nextMilestone
    ? Math.min((streak / nextMilestone.days) * 100, 100)
    : 100;

  const quickLinks = [
    {
      to: '/tracker',
      icon: Flame,
      title: 'Catat Craving',
      desc: 'Log hasrat manis sekarang',
      color: 'bg-secondary/10 border-secondary/20 text-secondary',
      iconBg: 'bg-secondary/20',
    },
    {
      to: '/insights',
      icon: Sparkles,
      title: 'AI Insights',
      desc: 'Lihat pola & rekomendasi',
      color: 'bg-primary/10 border-primary/20 text-primary',
      iconBg: 'bg-primary/20',
    },
    {
      to: '/rewards',
      icon: Award,
      title: 'Rewards',
      desc: 'Tukar poin dengan voucher',
      color: 'bg-amber-50 border-amber-200 text-amber-600',
      iconBg: 'bg-amber-100',
    },
    {
      to: '/education',
      icon: BookOpen,
      title: 'Edukasi',
      desc: 'Tips kontrol gula harian',
      color: 'bg-blue-50 border-blue-200 text-blue-600',
      iconBg: 'bg-blue-100',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Beranda - Vityu</title>
      </Helmet>

      <div className="w-full flex flex-col gap-5 pb-4">

        {/* ── Header sapaan ── */}
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
                <path
                  d="M8 10L16 22L24 10"
                  stroke="hsl(var(--primary-foreground))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-none">Halo,</p>
              <p className="text-sm font-bold text-foreground leading-tight">
                {userName || 'Vityu Lover'}!
              </p>
            </div>
          </div>
        </div>

        {/* ── Banner voucher baru ── */}
        <AnimatePresence>
          {newVoucherBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-4 bg-green-500 text-white rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">🎉 Voucher baru terbuka!</p>
                <p className="text-xs opacity-90">
                  {newVoucherBanner.title} — kode{' '}
                  <span className="font-mono font-bold">{newVoucherBanner.code}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to="/rewards"
                  className="text-xs bg-white text-green-700 font-bold px-3 py-1.5 rounded-lg"
                >
                  Lihat
                </Link>
                <button onClick={() => setNewVoucherBanner(null)}>
                  <X className="w-4 h-4 opacity-70" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Hero banner pink ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 rounded-3xl overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, hsl(330 100% 55%), hsl(330 100% 65%))',
          }}
        >
          <div className="p-6">
            <h1
              className="text-2xl font-extrabold text-white leading-tight mb-2"
              style={{ letterSpacing: '-0.02em' }}
            >
              Kontrol Gula,
              <br />
              Ubah Hidup
            </h1>
            <p className="text-white/85 text-sm mb-5 leading-relaxed">
              Setiap langkah kecil membawamu lebih dekat
              <br />
              ke kesehatan optimal.
            </p>
            <Link to="/tracker">
              <button className="flex items-center gap-2 bg-white text-foreground font-bold text-sm px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.97]">
                Catat Craving Sekarang
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* ── Statistik ── */}
        <div className="px-4">
          <p className="text-base font-bold text-foreground mb-3">Statistik Hari Ini</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'CATATAN', value: totalCravings, icon: '⚡' },
              { label: 'STREAK', value: streak, icon: '🔥' },
              { label: 'POIN', value: points, icon: '🏅' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border rounded-2xl p-3 text-center shadow-sm"
              >
                <span className="text-xl">{stat.icon}</span>
                <p className="text-2xl font-extrabold text-foreground mt-1">
                  {stat.value}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Streak progress bar menuju milestone ── */}
        {nextMilestone && streak > 0 && (
          <div className="mx-4">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <p className="text-sm font-bold text-orange-800">
                  {nextMilestone.days - streak} hari lagi unlock voucher{' '}
                  {nextMilestone.voucher.discount} OFF!
                </p>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div
                  className="bg-orange-500 rounded-full h-2 transition-all"
                  style={{ width: `${streakProgressToNext}%` }}
                />
              </div>
              <p className="text-xs text-orange-600 mt-1">
                Streak {streak} / {nextMilestone.days} hari
              </p>
            </div>
          </div>
        )}

        {/* ── CTA mulai tracking ── */}
        {totalCravings === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Start Tracking</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Log your first craving to unlock personalized AI insights.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Quick links ── */}
        <div className="px-4">
          <p className="text-base font-bold text-foreground mb-3">Menu Cepat</p>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <Link
                    to={item.to}
                    className={`flex flex-col gap-2 p-4 rounded-2xl border ${item.color} transition-all active:scale-[0.97]`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DasborHomePage;