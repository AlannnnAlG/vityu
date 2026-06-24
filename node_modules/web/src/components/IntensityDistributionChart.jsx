import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const IntensityDistributionChart = ({ cravings }) => {
  const getIntensityData = () => {
    const ranges = [
      { range: '1-3', min: 1, max: 3, count: 0, label: 'Low' },
      { range: '4-6', min: 4, max: 6, count: 0, label: 'Medium' },
      { range: '7-10', min: 7, max: 10, count: 0, label: 'High' }
    ];
    
    cravings.forEach(craving => {
      const range = ranges.find(r => craving.intensity >= r.min && craving.intensity <= r.max);
      if (range) range.count++;
    });
    
    return ranges.map(r => ({
      range: r.label,
      count: r.count
    }));
  };

  const data = getIntensityData();

  if (cravings.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4">Intensity distribution</h3>
        <p className="text-muted-foreground text-center py-8">
          No data available yet. Start logging cravings to see intensity patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-1">Intensity distribution</h3>
        <p className="text-sm text-muted-foreground">Breakdown by intensity level</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="range" 
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
            fill="hsl(var(--primary))" 
            radius={[8, 8, 0, 0]}
            name="Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IntensityDistributionChart;