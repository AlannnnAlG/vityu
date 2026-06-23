
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const PaymentMethodCard = ({ method, isSelected, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(method.id)}
      className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-sm' 
          : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30'
      }`}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mr-4 overflow-hidden p-2">
        {method.icon ? (
          <img src={method.icon} alt={method.name} className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full bg-muted rounded-lg" />
        )}
      </div>
      
      <div className="flex-grow">
        <h4 className="font-bold text-foreground text-sm md:text-base">{method.name}</h4>
        {method.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
        )}
        {method.installment && (
          <p className="text-xs font-medium text-secondary mt-1">{method.installment}</p>
        )}
      </div>

      <div className="flex-shrink-0 ml-4">
        {isSelected ? (
          <CheckCircle2 className="w-6 h-6 text-primary" />
        ) : (
          <Circle className="w-6 h-6 text-muted-foreground/30" />
        )}
      </div>
    </div>
  );
};

export default PaymentMethodCard;
