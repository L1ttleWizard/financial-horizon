// src/components/game/ActiveDepositCard.tsx
import { ActiveDeposit } from "@/store/slices/gameSlice";
import { formatCurrency } from "@/lib/format";
import { useTheme } from "@/contexts/ThemeContext";

import { useAppSelector } from "@/store/hooks";
export function ActiveDepositCard({
  deposit,
  
}: {
  deposit: ActiveDeposit;
  
}) {
  const { theme } = useTheme();
  const currentTurn:number = useAppSelector((state) => state.turn);
  console.log(currentTurn,deposit.startTurn,deposit.endTurn,deposit.term);
  const actualTurnsPassed = currentTurn - deposit.startTurn;
  const turnsPassedForProgress = Math.min(actualTurnsPassed, deposit.term);
  const turnsLeft = Math.max(0, deposit.endTurn - currentTurn);
  const progress = (turnsPassedForProgress / deposit.term) * 100;
  
  return (
    <div className={`rounded-xl shadow p-4 ${theme === 'dark' ? 'bg-[rgba(13,4,32,0.35)]' : 'bg-white'}`}>

      <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{deposit.bankName}</h3>
      <div className="flex justify-between items-baseline my-2">
        <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
          ₽{formatCurrency(deposit.amount)}
        </span>
        <span className={`font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
          {(deposit.annualRate * 100).toFixed(0)}% годовых
        </span>
      </div>
      <div>
        <div className={`flex justify-between text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>Прогресс</span>
          <span>Осталось: {turnsLeft} нед.</span>
        </div>
        <div className={`w-full rounded-full h-2.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div className={`${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'} h-2.5 rounded-full`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
