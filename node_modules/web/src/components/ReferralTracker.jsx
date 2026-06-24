import React from 'react';
import { Users, Gift, TrendingUp } from 'lucide-react';
import StatCard from './StatCard.jsx';

const ReferralTracker = ({ referralData }) => {
  const { totalReferrals = 0, activeReferrals = 0, rewardsEarned = 0, pointsEarned = 0 } = referralData;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Your referral stats</h2>
        <p className="text-muted-foreground">Track your referral success and rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="Users"
          label="Total referrals"
          value={totalReferrals}
        />
        <StatCard
          icon="UserCheck"
          label="Active referrals"
          value={activeReferrals}
        />
        <StatCard
          icon="Gift"
          label="Rewards earned"
          value={rewardsEarned}
        />
        <StatCard
          icon="Award"
          label="Points earned"
          value={pointsEarned}
        />
      </div>

      {totalReferrals > 0 && (
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Keep it up</h3>
              <p className="text-sm text-muted-foreground">
                You're helping friends live healthier lives
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-2xl font-bold text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {Math.round((activeReferrals / totalReferrals) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Conversion rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {Math.round(pointsEarned / Math.max(totalReferrals, 1))}
              </div>
              <div className="text-sm text-muted-foreground">Avg points per referral</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralTracker;