import React from 'react';
import { Award, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const RewardTierCard = ({ tier, currentPoints, isActive, isUnlocked }) => {
  const progress = isActive ? Math.min((currentPoints / tier.pointsRequired) * 100, 100) : 0;

  return (
    <div className={`rounded-2xl border p-6 space-y-4 transition-all duration-200 ${
      isActive ? 'bg-primary/5 border-primary shadow-lg scale-105' : 'bg-card'
    } ${isUnlocked ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
            isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{tier.name}</h3>
            <p className="text-sm text-muted-foreground">{tier.pointsRequired} points</p>
          </div>
        </div>
        {isUnlocked && (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {isActive && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{currentPoints} / {tier.pointsRequired}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="space-y-2 pt-2 border-t">
        <p className="text-sm font-medium">Benefits:</p>
        <ul className="space-y-1">
          {tier.benefits.map((benefit, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RewardTierCard;