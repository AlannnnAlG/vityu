import React from 'react';
import { Sparkles } from 'lucide-react';

const InsightCard = ({ title, insight }) => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <h3 className="font-bold text-base text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed font-medium">
        {insight}
      </p>
    </div>
  );
};

export default InsightCard;