// src/components/ui/LogItem.tsx
import { useState } from 'react';
import { LogEntry } from '@/store/slices/gameSlice';
import { formatCurrency } from '@/lib/format';
import { FaArrowUp, FaArrowDown, FaHeart, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BsGraphUpArrow } from 'react-icons/bs';
import { FcDebt } from 'react-icons/fc';
import { RiWallet3Line } from 'react-icons/ri';

const typeInfo = {
  income: { icon: <FaArrowUp className="text-green-500" />, color: 'text-green-600', isCurrency: true },
  expense: { icon: <FaArrowDown className="text-red-500" />, color: 'text-red-600', isCurrency: true },
  savings: { icon: <BsGraphUpArrow className="text-blue-500" />, color: 'text-blue-600', isCurrency: true },
  debt: { icon: <FcDebt />, color: 'text-orange-600', isCurrency: true },
  mood: { icon: <FaHeart className="text-yellow-500" />, color: 'text-yellow-600', isCurrency: false },
};

export function LogItem({ entry }: { entry: LogEntry }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { icon, color, isCurrency } = typeInfo[entry.type];
  
  const finalSign = entry.amount > 0 ? '+' : (entry.amount < 0 ? '-' : '');
  const formattedAmount = isCurrency
    ? `₽${formatCurrency(Math.abs(entry.amount))}`
    : `${Math.abs(entry.amount)}`;

  return (
    <div className="py-2 border-b border-gray-100 last:border-b-0">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div>
            <p className="font-semibold text-gray-700">{entry.description}</p>
            <p className="text-xs text-gray-400">День {entry.day}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className={`font-bold text-lg ${color}`}>
            {finalSign}{formattedAmount}
          </p>
          <button>
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-2 p-2 bg-gray-50 rounded-lg grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <RiWallet3Line className="text-gray-500" />
            <span>Баланс:</span>
            <span className="font-semibold">₽{formatCurrency(entry.metrics.balance)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaHeart className="text-yellow-500" />
            <span>Настроение:</span>
            <span className="font-semibold">{entry.metrics.mood}</span>
          </div>
          <div className="flex items-center gap-2">
            <BsGraphUpArrow className="text-blue-500" />
            <span>Сбережения:</span>
            <span className="font-semibold">₽{formatCurrency(entry.metrics.savings)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FcDebt />
            <span>Долг:</span>
            <span className="font-semibold">₽{formatCurrency(entry.metrics.debt)}</span>
          </div>
           <div className="flex items-center gap-2 col-span-2">
            <BsGraphUpArrow className="text-purple-500" />
            <span>Чистый капитал:</span>
            <span className="font-semibold">₽{formatCurrency(entry.metrics.netWorth)}</span>
          </div>
        </div>
      )}
    </div>
  );
}