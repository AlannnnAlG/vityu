import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Cart' },
  { id: 2, label: 'Shipping' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Success' }
];

const CheckoutSteps = ({ currentStep }) => {
  return (
    <div className="w-full flex items-center justify-between mb-6 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-muted -z-10" />
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary -z-10 transition-all duration-500"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      
      {steps.map((step) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        
        return (
          <div key={step.id} className="flex flex-col items-center gap-1.5 bg-background px-1">
            <div 
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300
                ${isCompleted ? 'step-completed' : isActive ? 'step-active' : 'step-inactive'}`}
            >
              {isCompleted ? <Check className="h-3.5 w-3.5" /> : step.id}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;