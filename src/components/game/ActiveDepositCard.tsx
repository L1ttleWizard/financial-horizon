// src/components/game/ActiveDepositCard.tsx
import { ActiveDeposit } from "@/store/slices/gameSlice";
import { formatCurrency } from "@/lib/format";

export function ActiveDepositCard({
  deposit,
  currentTurn,
}: {
  deposit: ActiveDeposit;
  currentTurn: number;
}) {
  const turnsPassed = currentTurn - deposit.startTurn;
  const progress = (turnsPassed / deposit.term) * 100;
  const turnsLeft = deposit.endTurn - currentTurn;

  return (
    <div className="rounded-xl shadow p-4 bg-white">
      <h3 className="font-bold text-lg text-gray-800">{deposit.bankName}</h3>
      <div className="flex justify-between items-baseline my-2">
        <span className="text-2xl font-bold text-blue-600">
          ₽{formatCurrency(deposit.amount)}
        </span>
        <span className="text-green-600 font-semibold">
          {(deposit.annualRate * 100).toFixed(0)}% годовых
        </span>
      </div>
      <div>
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Прогресс</span>
          <span>Осталось: {turnsLeft} нед.</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
