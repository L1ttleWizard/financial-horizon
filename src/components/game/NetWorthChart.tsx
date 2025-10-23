'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { memo } from 'react';
import { NetWorthHistoryPoint } from '@/store/slices/gameSlice';


const Chart = ({ data }: { data: NetWorthHistoryPoint[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="week" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
            contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem'
            }}
        />
        <Area type="monotone" dataKey="netWorth" stroke="#10b981" fillOpacity={1} fill="url(#colorNetWorth)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export const NetWorthChart = memo(Chart);