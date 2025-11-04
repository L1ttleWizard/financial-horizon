// src/components/ui/LogItem.tsx
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { LogEntry } from "@/store/slices/gameSlice";
import { formatCurrency } from "@/lib/format";
import {
  FaArrowUp,
  FaArrowDown,
  FaHeart,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { FcDebt } from "react-icons/fc";
import { RiWallet3Line } from "react-icons/ri";

const typeInfo = {
  income: {
    icon: <FaArrowUp className="text-green-500" />,
    color: "text-green-600",
    isCurrency: true,
  },
  expense: {
    icon: <FaArrowDown className="text-red-500" />,
    color: "text-red-600",
    isCurrency: true,
  },
  savings: {
    icon: <BsGraphUpArrow className="text-blue-500" />,
    color: "text-blue-600",
    isCurrency: true,
  },
  debt: { icon: <FcDebt />, color: "text-orange-600", isCurrency: true },
  mood: {
    icon: <FaHeart className="text-yellow-500" />,
    color: "text-yellow-600",
    isCurrency: false,
  },
};

export function LogItem({ entry }: { entry: LogEntry }) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const { icon, color, isCurrency } = typeInfo[entry.type];

  const finalSign = entry.amount > 0 ? "+" : entry.amount < 0 ? "-" : "";
  const formattedAmount = isCurrency
    ? `₽${formatCurrency(Math.abs(entry.amount))}`
    : `${Math.abs(entry.amount)}`;

  return (
    <div
      className={`py-2 border-b ${
        theme === "dark" ? "border-gray-700" : "border-gray-100"
      } last:border-b-0`}>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div>
            <p
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-700"
              }`}>
              {entry.description}
            </p>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-400"
              }`}>
              День {entry.day}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className={`font-bold text-lg ${color}`}>
            {finalSign}
            {formattedAmount}
          </p>
          <button className="">{isExpanded ? <FaChevronUp color="#364153" /> : <FaChevronDown color="#364153" />}</button>
        </div>
      </div>
      {isExpanded && (
        <div
          className={`mt-2 p-2 rounded-lg grid grid-cols-2 gap-2 text-sm ${
            theme === "dark" ? "bg-[rgba(13,4,32,0.35)]" : "bg-gray-50"
          }`}>
          <div className="flex items-center gap-2">
            <RiWallet3Line
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <span
              className={`${
                theme === "dark" ? "text-[#C6B9D9]" : "text-gray-600"
              }`}>
              Баланс:
            </span>
            <span
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
              ₽{formatCurrency(entry.metrics.balance)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaHeart
              className={`${
                theme === "dark" ? "text-yellow-400" : "text-yellow-500"
              }`}
            />
            <span
              className={`${
                theme === "dark" ? "text-[#C6B9D9]" : "text-gray-600"
              }`}>
              Настроение:
            </span>
            <span
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
              {entry.metrics.mood}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BsGraphUpArrow
              className={`${
                theme === "dark" ? "text-blue-400" : "text-blue-500"
              }`}
            />
            <span
              className={`${
                theme === "dark" ? "text-[#C6B9D9]" : "text-gray-600"
              }`}>
              Сбережения:
            </span>
            <span
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
              ₽{formatCurrency(entry.metrics.savings)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FcDebt
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <span
              className={`${
                theme === "dark" ? "text-[#C6B9D9]" : "text-gray-600"
              }`}>
              Долг:
            </span>
            <span
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
              ₽{formatCurrency(entry.metrics.debt)}
            </span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <BsGraphUpArrow
              className={`${
                theme === "dark" ? "text-purple-400" : "text-purple-500"
              }`}
            />
            <span
              className={`${
                theme === "dark" ? "text-[#C6B9D9]" : "text-gray-600"
              }`}>
              Чистый капитал:
            </span>
            <span
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
              ₽{formatCurrency(entry.metrics.netWorth)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
