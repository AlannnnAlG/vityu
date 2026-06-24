import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

const CravingCard = ({ craving }) => {
  const intensityColor = 
    craving.intensity > 7 ? 'bg-destructive' :
    craving.intensity > 4 ? 'bg-orange-500' : 'bg-primary';

  return (
    <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {format(new Date(craving.timestamp), 'MMM d, h:mm a')}
        </div>
        <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
          {craving.trigger}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 mt-1">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-muted-foreground">Intensity</span>
          <span className="text-foreground">{craving.intensity}/10</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full ${intensityColor} transition-all duration-500`} 
            style={{ width: `${(craving.intensity / 10) * 100}%` }}
          />
        </div>
      </div>

      {craving.notes && (
        <p className="text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-lg mt-1 italic">
          "{craving.notes}"
        </p>
      )}
    </div>
  );
};

export default CravingCard;