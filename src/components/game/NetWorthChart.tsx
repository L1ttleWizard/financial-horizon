// src/components/game/NetWorthChart.tsx
'use client';
import { NetWorthHistoryPoint } from '@/store/slices/gameSlice';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function NetWorthChart({ data }: { data: NetWorthHistoryPoint[] }) {
  return (
    // 1. Делаем этот контейнер flex-колонкой, чтобы управлять высотой дочерних элементов
    <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Динамика капитала</h2>
      
      
      <div className="w-full flex-grow">
        <ResponsiveContainer>
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
      </div>
    </div>
  );
}