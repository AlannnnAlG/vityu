import React from 'react';
import { Switch } from '@/components/ui/switch';

const SettingToggle = ({ icon: Icon, label, description, checked, onCheckedChange }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-card border rounded-2xl shadow-sm">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-foreground">{label}</span>
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-primary" 
      />
    </div>
  );
};

export default SettingToggle;