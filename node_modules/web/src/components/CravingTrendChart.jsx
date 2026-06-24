import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

const CravingTrendChart = ({ cravings }) => {
  const getLast7DaysData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dayData = {
        date: format(date, 'MMM d'),
        count: 0,
        avgIntensity: 0
      };
      
      const dayCravings = cravings.filter(c => {
        const cravingDate = startOfDay(new Date(c.timestamp));
        return cravingDate.getTime() === date.getTime();
      });
      
      if (dayCravings.length > 0) {
        dayData.count = dayCravings.length;
        dayData.avgIntensity = dayCravings.reduce((sum, c) => sum + c.intensity, 0) / dayCravings.length;
      }
      
      days.push(dayData);
    }
    return days;
  };

  const data = getLast7DaysData();

  return (
    <div className="rounded-2xl border bg-card p-6 space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-1">Craving frequency</h3>
        <p className="text-sm text-muted-foreground">Last 7 days</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
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
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            name="Cravings"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CravingTrendChart;