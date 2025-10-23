"use client";
import { PAYDAY_CYCLE } from "@/store/slices/gameSlice";
import { formatCurrency } from "@/lib/format";

interface WidgetProps {
  currentTurn: number;
  weeklySpends: number;
  monthlyBills: number;
}

export function ObligatorySpendsWidget({
  currentTurn,
  weeklySpends,
  monthlyBills,
}: WidgetProps) {
  const turnsLeftForBills = PAYDAY_CYCLE - (currentTurn % PAYDAY_CYCLE);

  const getWeekText = (weeks: number) => {
    if (weeks === 1) return "через 1 неделю";
    if (weeks > 1 && weeks < 5) return `через ${weeks} недели`;
    return `через ${weeks} недель`;
  };

  const billPaymentText =
    turnsLeftForBills === PAYDAY_CYCLE && currentTurn > 0
      ? "в этом ходу"
      : getWeekText(turnsLeftForBills);

  return (
    <div className="rounded-xl shadow-md p-6 h-full bg-white">
      <h2 className="text-2xl font-bold text-gray-700">
        Обязательные расходы
      </h2>
      <div className="flex"></div>
      <div className=" bg-gray-100 p-4 rounded-xl mt-4">
        <div className="space-y-3 justify-between">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Еда и транспорт:</span>
            <span className="font-semibold text-red-600 ml-auto">
              -₽{formatCurrency(weeklySpends)} / неделя
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Аренда и счета:</span>
            <span className="font-semibold text-red-600">
              -₽{formatCurrency(monthlyBills)} ({billPaymentText})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
