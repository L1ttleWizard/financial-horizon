'use client';
import { PAYDAY_CYCLE, WEEKLY_SPENDS, MONTHLY_BILLS } from '@/store/slices/gameSlice';

interface WidgetProps {
  currentTurn: number;
}

export function ObligatorySpendsWidget({ currentTurn }: WidgetProps) {
  const turnsLeftForBills = PAYDAY_CYCLE - (currentTurn % PAYDAY_CYCLE);

  const getWeekText = (weeks: number) => {
    if (weeks === 1) return 'через 1 неделю';
    if (weeks > 1 && weeks < 5) return `через ${weeks} недели`;
    return `через ${weeks} недель`;
  }
  
  const billPaymentText = (turnsLeftForBills === PAYDAY_CYCLE && currentTurn > 0) 
    ? "в этом ходу" 
    : getWeekText(turnsLeftForBills);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Обязательные расходы</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Еда и транспорт:</span>
          <span className="font-semibold text-red-600">-${WEEKLY_SPENDS} / неделя</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Аренда и счета:</span>
          <span className="font-semibold text-red-600">-${MONTHLY_BILLS} ({billPaymentText})</span>
        </div>
      </div>
    </div>
  );
}