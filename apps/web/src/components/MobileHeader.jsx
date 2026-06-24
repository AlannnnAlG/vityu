import React from 'react';

const MobileHeader = () => {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[390px] h-[60px] bg-background/95 backdrop-blur border-b flex items-center px-4 justify-between">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center font-bold text-primary-foreground text-lg tracking-tight">
          V
        </div>
        <span className="font-bold text-lg text-foreground tracking-tight">Vityu</span>
      </div>
      <div className="text-sm font-semibold text-secondary px-3 py-1 bg-secondary/10 rounded-full">
        Halo, Vityu Lover!
      </div>
    </header>
  );
};

export default MobileHeader;