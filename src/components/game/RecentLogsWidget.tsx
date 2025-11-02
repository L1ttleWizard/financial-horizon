// src/components/game/RecentLogsWidget.tsx
"use client";
import { LogEntry } from "@/store/slices/gameSlice";
import { formatCurrency } from "@/lib/format";
import { FaHeart } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { FcDebt } from "react-icons/fc";
import { RiWallet3Line } from "react-icons/ri";
import Link from "next/link";

const DeltaIndicator = ({ delta, isCurrency = false }: { delta: number, isCurrency?: boolean }) => {
    const sign = delta > 0 ? '+' : delta < 0 ? '-' : '';
    const color = delta > 0 ? 'text-green-500' : delta < 0 ? 'text-red-500' : 'text-gray-500';
    const formattedDelta = isCurrency ? `₽${formatCurrency(Math.abs(delta))}` : Math.abs(delta);

    if (delta === 0) {
        return <span className="text-gray-500">-</span>;
    }

    return (
        <span className={`${color} font-semibold`}>
            {sign}{formattedDelta}
        </span>
    );
};

export function RecentLogsWidget({ log }: { log: LogEntry[] }) {
  const lastLog = log.length > 0 ? log[log.length - 1] : null;
  const lastDay = lastLog ? lastLog.day : 0;
  const logsForLastDay = log.filter(entry => entry.day === lastDay);

  if (logsForLastDay.length === 0) {
    return (
      <Link href="/log" className="text-center">
        <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col hover:scale-105 transition-all duration-125 justify-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Последние изменения
          </h2>
          <div className="flex flex-col gap-y-4 bg-gray-100 rounded-xl p-4">
            <p className="text-gray-500 text-center">
              Нет данных для отображения.
            </p>
          </div>
        </div>
      </Link>
    );
  }

  const balanceDelta = logsForLastDay
    .filter(entry => entry.type === 'income' || entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const moodDelta = logsForLastDay
    .filter(entry => entry.type === 'mood')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const savingsDelta = logsForLastDay
    .filter(entry => entry.type === 'savings')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const debtDelta = logsForLastDay
    .filter(entry => entry.type === 'debt')
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <Link href="/log" className="text-center">
      <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col hover:scale-105 transition-all duration-125 justify-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Изменения за день {lastDay}
        </h2>
        <div className="grid grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
                <RiWallet3Line size={24} className="text-gray-500" />
                <p className="text-sm text-gray-600 mt-1">Баланс</p>
                <DeltaIndicator delta={balanceDelta} isCurrency={true} />
            </div>
            <div className="flex flex-col items-center">
                <FaHeart size={24} className="text-red-500" />
                <p className="text-sm text-gray-600 mt-1">Настроение</p>
                <DeltaIndicator delta={moodDelta} />
            </div>
            <div className="flex flex-col items-center">
                <BsGraphUpArrow size={24} className="text-blue-500" />
                <p className="text-sm text-gray-600 mt-1">Сбережения</p>
                <DeltaIndicator delta={savingsDelta} isCurrency={true} />
            </div>
            <div className="flex flex-col items-center">
                <FcDebt size={24} />
                <p className="text-sm text-gray-600 mt-1">Долг</p>
                <DeltaIndicator delta={debtDelta} isCurrency={true} />
            </div>
        </div>
      </div>
    </Link>
  );
}