// src/components/game/RecentLogsWidget.tsx
"use client";
import { LogEntry } from "@/store/slices/gameSlice";
import { formatCurrency } from "@/lib/format";
import { FaHeart } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { FcDebt } from "react-icons/fc";
import { RiWallet3Line } from "react-icons/ri";
import Link from "next/link";

import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme } = useTheme();
  const lastLog = log.length > 0 ? log[log.length - 1] : null;
  const lastDay = lastLog ? lastLog.day : 0;
  const logsForLastDay = log.filter(entry => entry.day === lastDay);

  if (logsForLastDay.length === 0) {
    return (
      <Link href="/log" className="text-center">
        <div className={`rounded-xl shadow-md p-6 h-full flex flex-col hover:scale-105 transition-all duration-125 justify-center ${
          theme === 'dark'
            ? 'bg-[rgba(48,19,110,0.65)] border border-[rgba(255,255,255,0.3)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),_0px_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-[12px]'
            : 'bg-white'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            Последние изменения
          </h2>
          <div className={`flex flex-col gap-y-4 rounded-xl p-4 ${theme === 'dark' ? 'bg-[rgba(13,4,32,0.5)]' : 'bg-gray-100'}`}>
            <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
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
      <div className={`rounded-xl shadow-md p-6 h-full flex flex-col hover:scale-105 transition-all duration-125 justify-center ${
        theme === 'dark'
          ? 'bg-[rgba(48,19,110,0.65)] border border-[rgba(255,255,255,0.3)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),_0px_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-[12px]'
          : 'bg-white'
      }`}>
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
          Изменения за день {lastDay}
        </h2>
        <div className={`grid grid-cols-4 gap-4 text-center p-2 rounded-2xl ${theme === 'dark' ? 'bg-[rgba(13,4,32,0.5)]' : 'bg-gray-100'}`}>
            <div className="flex flex-col items-center ">
                <RiWallet3Line size={24} className="text-gray-500" />
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#C6B9D9]' : 'text-gray-600'}`}>Баланс</p>
                <DeltaIndicator delta={balanceDelta} isCurrency={true} />
            </div>
            <div className="flex flex-col items-center">
                <FaHeart size={24} className="text-red-500" />
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#C6B9D9]' : 'text-gray-600'}`}>Настроение</p>
                <DeltaIndicator delta={moodDelta} />
            </div>
            <div className="flex flex-col items-center">
                <BsGraphUpArrow size={24} className="text-blue-500" />
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#C6B9D9]' : 'text-gray-600'}`}>Сбережения</p>
                <DeltaIndicator delta={savingsDelta} isCurrency={true} />
            </div>
            <div className="flex flex-col items-center">
                <FcDebt size={24} />
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#C6B9D9]' : 'text-gray-600'}`}>Долг</p>
                <DeltaIndicator delta={debtDelta} isCurrency={true} />
            </div>
        </div>
      </div>
    </Link>
  );
}