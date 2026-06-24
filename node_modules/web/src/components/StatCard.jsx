import React from 'react';

const StatCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card border shadow-sm">
      {Icon && (
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="text-2xl font-bold tracking-tight text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider text-center">
        {label}
      </div>
    </div>
  );
};

export default StatCard;