import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TriggerAnalysisChart = ({ cravings }) => {
  const getTriggerData = () => {
    const triggerCounts = {};
    
    cravings.forEach(craving => {
      triggerCounts[craving.trigger] = (triggerCounts[craving.trigger] || 0) + 1;
    });
    
    return Object.entries(triggerCounts)
      .map(([trigger, count]) => ({
        trigger: trigger.charAt(0).toUpperCase() + trigger.slice(1),
        count
      }))
      .sort((a, b) => b.count - a.count);
  };

  const data = getTriggerData();

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4">Trigger analysis</h3>
        <p className="text-muted-foreground text-center py-8">
          No data available yet. Start logging cravings to see your trigger patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-1">Trigger analysis</h3>
        <p className="text-sm text-muted-foreground">Most common craving triggers</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="trigger" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.75rem',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Bar 
            dataKey="count" 
            fill="hsl(var(--secondary))" 
            radius={[8, 8, 0, 0]}
            name="Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TriggerAnalysisChart;