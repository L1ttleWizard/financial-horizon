"use client";
import { PAYDAY_CYCLE } from "@/store/slices/gameSlice";
import { formatCurrency } from "@/lib/format";

import { useTheme } from "@/contexts/ThemeContext";

interface WidgetProps {
  currentDay: number;
  weeklySpends: number;
  monthlyBills: number;
}

export function ObligatorySpendsWidget({
  currentDay,
  weeklySpends,
  monthlyBills,
}: WidgetProps) {
  const { theme } = useTheme();
  const turnsLeftForBills = PAYDAY_CYCLE - (currentDay % PAYDAY_CYCLE);

  const getWeekText = (weeks: number) => {
    if (weeks === 1) return "через 1 неделю";
    if (weeks > 1 && weeks < 5) return `через ${weeks} недели`;
    return `через ${weeks} недель`;
  };

  const billPaymentText =
    turnsLeftForBills === PAYDAY_CYCLE && currentDay > 0
      ? "в этом ходу"
      : getWeekText(turnsLeftForBills);

  return (
    <div className={`flex flex-col justify-center rounded-xl shadow-md p-6 h-full ${
      theme === 'dark'
        ? 'bg-[rgba(48,19,110,0.65)] border border-[rgba(255,255,255,0.3)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),_0px_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-xl'
        : 'bg-white'
    }`}>
      <h2 className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
        Обязательные расходы
      </h2>
      <div className="flex"></div>
      <div className={`p-4 rounded-xl mt-4 ${theme === 'dark' ? 'bg-[rgba(13,4,32,0.35)]' : 'bg-gray-100'}`}>
        <div className="space-y-3 justify-between">
          <div className="flex justify-between items-center text-sm">
            <span className={`${theme === 'dark' ? 'text-[#C6B9D9]' : 'text-gray-600'}`}>Еда и транспорт:</span>
            <span className="font-semibold text-red-600 ml-auto">
              -₽{formatCurrency(weeklySpends)} / неделя
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className={`${theme === 'dark' ? 'text-[#C6B9D9]' : 'text-gray-600'}`}>Аренда и счета:</span>
            <span className="font-semibold text-red-600">
              -₽{formatCurrency(monthlyBills)} ({billPaymentText})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}