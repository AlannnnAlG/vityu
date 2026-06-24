import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { generateReferralCode, getReferralLink, copyToClipboard } from '@/utils/ReferralCodeGenerator.js';
import ReferralTracker from '@/components/ReferralTracker.jsx';

const ReferralPage = () => {
  const [referralCode, setReferralCode] = useLocalStorage('vityu_referral_code', null);
  const [referralData] = useLocalStorage('vityu_referral_data', {
    totalReferrals: 0, activeReferrals: 0, rewardsEarned: 0, pointsEarned: 0
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!referralCode) setReferralCode(generateReferralCode());
  }, [referralCode, setReferralCode]);

  const handleCopyCode = async () => {
    try {
      await copyToClipboard(referralCode);
      setCopied(true);
      toast.success('Code copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <>
      <Helmet>
        <title>Refer - Vityu</title>
      </Helmet>

      <div className="w-full flex flex-col p-4 gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Refer Friends</h1>
          <p className="text-muted-foreground text-sm">
            Share the journey and earn bonus points.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Main Referral Card */}
          <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 p-6 border shadow-sm flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Share2 className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-lg font-bold mb-2">Give 50, Get 50</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Share your code. You both earn 50 pts when they log their first craving.
            </p>
            
            <div className="w-full bg-background rounded-2xl p-4 flex flex-col gap-3 shadow-inner">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Code</span>
              <div className="text-2xl font-mono font-bold tracking-widest text-foreground">
                {referralCode}
              </div>
              <Button onClick={handleCopyCode} className="w-full min-h-[48px] rounded-xl font-semibold gap-2 mt-2">
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold ml-1">Share via</label>
            <Button className="w-full min-h-[48px] bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-semibold">
              WhatsApp
            </Button>
            <Button className="w-full min-h-[48px] bg-[#1DA1F2] hover:bg-[#1A8CD8] text-white rounded-xl font-semibold">
              Twitter
            </Button>
          </div>

          <div className="mt-4">
            <ReferralTracker referralData={referralData} />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ReferralPage;