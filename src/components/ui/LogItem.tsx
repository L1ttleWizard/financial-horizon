// src/components/ui/LogItem.tsx
import { LogEntry } from '@/store/slices/gameSlice';

const typeInfo = {
  income: { icon: '🟢', color: 'text-green-600' },
  expense: { icon: '💰', color: 'text-red-600' },
  savings: { icon: '📈', color: 'text-blue-600' },
  debt: { icon: '💳', color: 'text-orange-600' },
  mood: { icon: '❤️', color: 'text-yellow-600' },
};

export function LogItem({ entry }: { entry: LogEntry }) {
  const { icon, color } = typeInfo[entry.type];
  const sign = entry.amount > 0 ? '+' : '';

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
        {sign}{entry.amount}
      </p>
    </div>
  );
}