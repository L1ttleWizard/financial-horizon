// src/components/ui/PaydayProgressBar.tsx
'use client';

import { useTheme } from "@/contexts/ThemeContext";

interface ProgressBarProps {
  currentDay: number; // Принимаем day
}

export function PaydayProgressBar({ currentDay }: ProgressBarProps) {
  const { theme } = useTheme();
  const weeksInCycle = 4;
  const turnsPassedInCycle = currentDay % weeksInCycle;
  const turnsLeft = weeksInCycle - turnsPassedInCycle;
  const progressPercentage = (turnsPassedInCycle / weeksInCycle) * 100;

  const getWeekText = (weeks: number) => {
    if (weeks === 1) return '1 неделя';
    if (weeks > 1 && weeks < 5) return `${weeks} недели`;
    return `${weeks} недель`;
  }

  return (
    <div className={`w-full rounded-xl shadow-md p-4 h-full ${
      theme === 'dark'
        ? 'bg-[rgba(60,28,130,0.6)] border border-[rgba(255,255,255,0.3)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),_0px_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-[12px]'
        : 'bg-white'
    }`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Прогресс до зарплаты</h3>
        <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-[#DDD0E8]' : 'text-blue-600'}`}>Осталось: {getWeekText(turnsLeft)}</p>
      </div>
      <div className={`w-full rounded-full h-4 ${theme === 'dark' ? 'bg-[#E5E7EB]' : 'bg-gray-200'}`}>
        <div
          className={`h-4 rounded-full transition-all duration-500 ${theme === 'dark' ? 'bg-[#2B7FFF]' : 'bg-blue-500'}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}