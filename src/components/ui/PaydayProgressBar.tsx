// src/components/ui/PaydayProgressBar.tsx
'use client';

interface ProgressBarProps {
  currentTurn: number; // Принимаем turn
}

export function PaydayProgressBar({ currentTurn }: ProgressBarProps) {
  const weeksInCycle = 4;
  const turnsPassedInCycle = currentTurn % weeksInCycle;
  const turnsLeft = weeksInCycle - turnsPassedInCycle;
  const progressPercentage = (turnsPassedInCycle / weeksInCycle) * 100;

  const getWeekText = (weeks: number) => {
    if (weeks === 1) return '1 неделя';
    if (weeks > 1 && weeks < 5) return `${weeks} недели`;
    return `${weeks} недель`;
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-700">Прогресс до зарплаты</h3>
        <p className="text-sm font-semibold text-blue-600">Осталось: {getWeekText(turnsLeft)}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}