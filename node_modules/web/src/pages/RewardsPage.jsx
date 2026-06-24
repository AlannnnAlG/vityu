import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Share2, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { generateReferralCode } from '@/utils/generateReferralCode.js';
import VoucherCard from '@/components/VoucherCard.jsx';
import { Progress } from '@/components/ui/progress';

const RewardsPage = () => {
  const [cravings] = useLocalStorage('vityu_cravings', []);
  const [referralCode, setReferralCode] = useLocalStorage('vityu_referral', '');

  useEffect(() => {
    if (!referralCode) {
      setReferralCode(generateReferralCode());
    }
  }, [referralCode, setReferralCode]);

  const totalPoints = cravings.length * 10;
  const currentLevel = Math.floor(totalPoints / 100) + 1;
  const pointsNextLevel = currentLevel * 100;
  const progressPercent = ((totalPoints % 100) / 100) * 100;

  const sampleVouchers = [
    {
      id: 1,
      title: "Diskon Katering Sehat",
      discount: "15%",
      code: "SEHAT15",
      expiryDate: "31 Des 2026"
    },
    {
      id: 2,
      title: "Gratis Ongkir Supermarket",
      discount: "Free",
      code: "VITYUONGKIR",
      expiryDate: "15 Ags 2026"
    },
    {
      id: 3,
      title: "Potongan Gym Member",
      discount: "20%",
      code: "FIT20",
      expiryDate: "30 Sep 2026"
    }
  ];

  const handleShareWhatsApp = () => {
    const text = `Halo! Saya pakai Vityu untuk kontrol craving gula. Pakai kode referral saya: ${referralCode} untuk dapat poin tambahan!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://vityu.app/join?ref=${referralCode}`);
    toast.success("Link berhasil disalin!");
  };

  return (
    <>
      <Helmet>
        <title>Vityu - Rewards</title>
      </Helmet>

      <div className="w-full flex flex-col p-4 gap-8">
        {/* Points Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-primary-foreground p-6 rounded-3xl text-center shadow-sm relative overflow-hidden"
        >
          <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Poin Loyalitas</h2>
          <div className="text-5xl font-extrabold mb-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {totalPoints}
          </div>
          
          <div className="bg-background/20 p-4 rounded-2xl backdrop-blur-sm text-left">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>Level {currentLevel}</span>
              <span>{totalPoints} / {pointsNextLevel}</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-background/30 [&>div]:bg-white" />
          </div>
        </motion.div>

        {/* Referral Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-bold">Kode Referral</h2>
          </div>
          <div className="bg-card border rounded-3xl p-5 shadow-sm text-center flex flex-col gap-4">
            <p className="text-sm font-medium text-muted-foreground">Bagikan kodemu dan dapatkan 50 Poin saat temanmu mencatat craving pertamanya.</p>
            <div className="text-2xl font-mono font-bold tracking-widest py-3 bg-muted rounded-xl">
              {referralCode}
            </div>
            <div className="flex gap-3">
              <button onClick={handleCopyLink} className="flex-1 min-h-[44px] bg-secondary/10 text-secondary font-bold rounded-xl active:scale-[0.98] transition-transform">
                Salin Link
              </button>
              <button onClick={handleShareWhatsApp} className="flex-1 min-h-[44px] bg-[#25D366] text-white font-bold rounded-xl active:scale-[0.98] transition-transform">
                Bagikan
              </button>
            </div>
          </div>
        </motion.div>

        {/* Vouchers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-4 pb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Voucher</h2>
          </div>
          {sampleVouchers.map((voucher, idx) => (
            <VoucherCard key={idx} voucher={voucher} />
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default RewardsPage;