// src/components/ui/LogItem.tsx
import { LogEntry } from '@/store/slices/gameSlice';
import { formatCurrency } from '@/lib/format';
import { FaArrowUp, FaArrowDown, FaHeart } from 'react-icons/fa';
import { BsGraphUpArrow } from 'react-icons/bs';
import { FcDebt } from 'react-icons/fc';

const typeInfo = {
  income: { icon: <FaArrowUp className="text-green-500" />, color: 'text-green-600', isCurrency: true },
  expense: { icon: <FaArrowDown className="text-red-500" />, color: 'text-red-600', isCurrency: true },
  savings: { icon: <BsGraphUpArrow className="text-blue-500" />, color: 'text-blue-600', isCurrency: true },
  debt: { icon: <FcDebt />, color: 'text-orange-600', isCurrency: true },
  mood: { icon: <FaHeart className="text-yellow-500" />, color: 'text-yellow-600', isCurrency: false },
};

export function LogItem({ entry }: { entry: LogEntry }) {
  const { icon, color, isCurrency } = typeInfo[entry.type];
  
  const finalSign = entry.amount > 0 ? '+' : (entry.amount < 0 ? '-' : '');
  const formattedAmount = isCurrency
    ? `₽${formatCurrency(Math.abs(entry.amount))}`
    : `${Math.abs(entry.amount)}`;

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="font-semibold text-gray-700">{entry.description}</p>
          <p className="text-xs text-gray-400">Неделя {entry.week}</p>
        </div>
      </div>
      <p className={`font-bold text-lg ${color}`}>
        {finalSign}{formattedAmount}
      </p>
    </div>
  );
}