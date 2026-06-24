import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

const CravingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    time: new Date().toISOString().slice(0, 16),
    intensity: 5,
    trigger: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggers = [
    { value: 'stress', label: 'Stress' },
    { value: 'boredom', label: 'Boredom' },
    { value: 'habit', label: 'Habit' },
    { value: 'social', label: 'Social situation' },
    { value: 'fatigue', label: 'Fatigue' },
    { value: 'emotional', label: 'Emotional' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.trigger) {
      toast.error('Please select a trigger');
      return;
    }

    setIsSubmitting(true);
    const craving = {
      id: Date.now(),
      timestamp: new Date(formData.time).toISOString(),
      intensity: formData.intensity,
      trigger: formData.trigger,
      notes: formData.notes
    };

    try {
      await onSubmit(craving);
      setFormData({
        time: new Date().toISOString().slice(0, 16),
        intensity: 5,
        trigger: '',
        notes: ''
      });
      toast.success('Craving logged successfully');
    } catch (error) {
      toast.error('Failed to log craving');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="time" className="text-base font-medium">Time of craving</Label>
        <input
          id="time"
          type="datetime-local"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="w-full min-h-[48px] px-4 py-2 rounded-xl border bg-background text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          required
        />
      </div>

      <div className="flex flex-col gap-4 bg-muted/30 p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Intensity level</Label>
          <span className="text-2xl font-bold text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formData.intensity}/10
          </span>
        </div>
        <div className="pt-2 pb-1 px-1">
          <Slider
            value={[formData.intensity]}
            onValueChange={(value) => setFormData({ ...formData, intensity: value[0] })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>Mild</span>
          <span>Moderate</span>
          <span>Severe</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="trigger" className="text-base font-medium">What triggered this?</Label>
        <Select value={formData.trigger} onValueChange={(value) => setFormData({ ...formData, trigger: value })}>
          <SelectTrigger id="trigger" className="min-h-[48px] text-base rounded-xl">
            <SelectValue placeholder="Select a trigger" />
          </SelectTrigger>
          <SelectContent>
            {triggers.map((trigger) => (
              <SelectItem key={trigger.value} value={trigger.value} className="min-h-[44px]">
                {trigger.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes" className="text-base font-medium">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="How did you feel? What were you doing?"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="resize-none text-base min-h-[80px] rounded-xl"
        />
      </div>

      <Button
        type="submit"
        className="w-full min-h-[48px] text-base rounded-xl font-semibold mt-2 active:scale-[0.98] transition-transform"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging...' : 'Log Craving'}
      </Button>
    </form>
  );
};

export default CravingForm;