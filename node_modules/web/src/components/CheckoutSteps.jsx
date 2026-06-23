import React from 'react';
import { Check } from 'lucide-react';

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Pengiriman' },
    { id: 2, name: 'Metode' },
    { id: 3, name: 'Konfirmasi' },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between relative max-w-lg mx-auto">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full pointer-events-none" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500 pointer-events-none"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 
                  isCompleted ? 'bg-primary text-primary-foreground' : 
                  'bg-card text-muted-foreground border-2 border-muted'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <span className={`absolute -bottom-7 text-xs font-medium whitespace-nowrap ${
                isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;