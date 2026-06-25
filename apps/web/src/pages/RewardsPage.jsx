import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Award, Flame, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { generateReferralCode } from '@/utils/generateReferralCode.js';
import VoucherCard from '@/components/VoucherCard.jsx';
import { Progress } from '@/components/ui/progress';
import { calculateStreak } from '@/utils/calculateStreak.js';
import {
  STREAK_MILESTONES,
  getUnlockedStreakVouchers,
  checkAndUnlockVouchers,
} from '@/utils/streakVouchers.js';

const RewardsPage = () => {
  const [cravings] = useLocalStorage('vityu_cravings', []);
  const [referralCode, setReferralCode] = useLocalStorage('vityu_referral', '');
  const [unlockedVouchers, setUnlockedVouchers] = useState([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);

  const streak = calculateStreak(cravings);
  const totalPoints = cravings.length * 10;
  const currentLevel = Math.floor(totalPoints / 100) + 1;
  const pointsNextLevel = currentLevel * 100;
  const progressPercent = ((totalPoints % 100) / 100) * 100;

  useEffect(() => {
    if (!referralCode) setReferralCode(generateReferralCode());
  }, [referralCode, setReferralCode]);

  useEffect(() => {
    // Cek dan unlock voucher baru berdasarkan streak saat ini
    const freshlyUnlocked = checkAndUnlockVouchers(streak);
    if (freshlyUnlocked.length > 0) {
      setNewlyUnlocked(freshlyUnlocked);
      freshlyUnlocked.forEach((v) =>
        toast.success(`🎉 Voucher baru unlocked: ${v.title}!`)
      );
    }
    setUnlockedVouchers(getUnlockedStreakVouchers());
  }, [streak]);

  // Milestone berikutnya yang belum tercapai
  const nextMilestone = STREAK_MILESTONES.find((m) => streak < m.days);

  const handleShareWhatsApp = () => {
    const text = `Halo! Saya pakai Vityu untuk kontrol craving gula. Pakai kode referral saya: ${referralCode} untuk dapat poin tambahan!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://vityu.app/join?ref=${referralCode}`);
    toast.success('Link berhasil disalin!');
  };

  return (
    <>
      <Helmet>
        <title>Vityu - Rewards</title>
      </Helmet>

      <div className="w-full flex flex-col p-4 gap-8">
        {/* Points Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-primary-foreground p-6 rounded-3xl text-center shadow-sm relative overflow-hidden"
        >
          <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">
            Poin Loyalitas
          </h2>
          <div
            className="text-5xl font-extrabold mb-4"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {totalPoints}
          </div>
          <div className="bg-background/20 p-4 rounded-2xl backdrop-blur-sm text-left">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>Level {currentLevel}</span>
              <span>
                {totalPoints} / {pointsNextLevel}
              </span>
            </div>
            <Progress
              value={progressPercent}
              className="h-2 bg-background/30 [&>div]:bg-white"
            />
          </div>
        </motion.div>

        {/* Streak Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-r from-orange-500 to-amber-400 text-white p-5 rounded-3xl shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <Flame className="w-7 h-7" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                Streak Hari Ini
              </p>
              <p className="text-3xl font-extrabold">{streak} Hari</p>
            </div>
          </div>

          {nextMilestone ? (
            <div className="bg-white/20 rounded-2xl p-3">
              <p className="text-xs font-semibold mb-1">
                {nextMilestone.days - streak} hari lagi →{' '}
                <span className="font-bold">
                  Unlock Voucher {nextMilestone.voucher.discount} OFF
                </span>
              </p>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{
                    width: `${Math.min(
                      (streak / nextMilestone.days) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm font-bold opacity-90">
              🏆 Semua milestone streak sudah kamu capai!
            </p>
          )}
        </motion.div>

        {/* Streak Milestones Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-bold">Milestone Streak</h2>
          </div>
          <div className="flex flex-col gap-2">
            {STREAK_MILESTONES.map((milestone) => {
              const isUnlocked = streak >= milestone.days;
              return (
                <div
                  key={milestone.days}
                  className={`flex items-center gap-3 p-3 rounded-2xl border ${
                    isUnlocked
                      ? 'bg-green-50 border-green-200'
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 ${
                      isUnlocked
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isUnlocked ? '✓' : <Lock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">
                      {milestone.days} Hari — {milestone.voucher.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Diskon {milestone.voucher.discount} · Kode:{' '}
                      <span className="font-mono font-bold">
                        {milestone.voucher.code}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      isUnlocked
                        ? 'bg-green-100 text-green-700'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isUnlocked ? 'Unlocked' : `${milestone.days - streak}h lagi`}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Newly Unlocked notification */}
        <AnimatePresence>
          {newlyUnlocked.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 flex flex-col gap-2"
            >
              <p className="font-bold text-green-800 text-sm">
                🎉 Selamat! Voucher baru terbuka:
              </p>
              {newlyUnlocked.map((v) => (
                <p key={v.code} className="text-sm text-green-700">
                  • {v.title} — kode{' '}
                  <span className="font-mono font-bold">{v.code}</span>
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-bold">Kode Referral</h2>
          </div>
          <div className="bg-card border rounded-3xl p-5 shadow-sm text-center flex flex-col gap-4">
            <p className="text-sm font-medium text-muted-foreground">
              Bagikan kodemu dan dapatkan 50 Poin saat temanmu mencatat craving
              pertamanya.
            </p>
            <div className="text-2xl font-mono font-bold tracking-widest py-3 bg-muted rounded-xl">
              {referralCode}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                className="flex-1 min-h-[44px] bg-secondary/10 text-secondary font-bold rounded-xl active:scale-[0.98] transition-transform"
              >
                Salin Link
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="flex-1 min-h-[44px] bg-[#25D366] text-white font-bold rounded-xl active:scale-[0.98] transition-transform"
              >
                Bagikan
              </button>
            </div>
          </div>
        </motion.div>

        {/* Vouchers Streak yang sudah unlock */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 pb-4"
        >
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Voucher Kamu</h2>
          </div>

          {unlockedVouchers.length === 0 ? (
            <div className="bg-muted/30 border border-dashed rounded-2xl p-6 text-center">
              <Flame className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-semibold text-muted-foreground">
                Belum ada voucher
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Capai streak 7 hari untuk unlock voucher pertamamu!
              </p>
            </div>
          ) : (
            unlockedVouchers.map((voucher, idx) => (
              <VoucherCard key={idx} voucher={voucher} />
            ))
          )}
        </motion.div>
      </div>
    </>
  );
};

export default RewardsPage;