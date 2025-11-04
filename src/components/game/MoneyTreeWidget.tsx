// src/components/game/MoneyTreeWidget.tsx
"use client";

import Image from "next/image";
import { treeData } from "@/data/treeData";
import { formatCurrency } from "@/lib/format";



interface WidgetProps {
  balance: number;
  savings: number;
  debt: number;
  currentStage: number;
  badnessFactor?: number;
}

import { useTheme } from "@/contexts/ThemeContext";

const basePath = "";

interface WidgetProps {
  balance: number;
  savings: number;
  debt: number;
  currentStage: number;
  badnessFactor?: number;
}

export function MoneyTreeWidget({
  balance,
  savings,
  debt,
  currentStage,
}: WidgetProps) {
  const { theme } = useTheme();

  const netWorth = balance + savings - debt;
  const tree = treeData.find((t) => t.stage === currentStage) || treeData[0];

  return (
    <div
      className={`relative rounded-xl shadow-md p-6 flex flex-col items-center justify-between h-full transition-all border-2 ${
        theme === 'dark'
          ? 'bg-[rgba(48,19,110,0.6)] border-[rgba(255,255,255,0.3)] shadow-[0_0_15px_5px_rgba(239,68,68,0.082)]'
          : 'bg-white'
      }`}>
      <div>
        <h2 className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
          Денежное дерево
        </h2>
        <p className={`text-center mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Ваш финансовый рост</p>
      </div>

      <div className="relative w-45 h-45 sm:w-60 sm:h-60">
        <Image
          src={`${basePath}/tree/stage-${tree.stage + 1}.png`}
          alt={`Дерево на стадии ${tree.stage}`}
          fill
          style={{ objectFit: "contain" }}
          className="transition-transform duration-500 hover:scale-105"
          priority
        />
      </div>

      <div className="text-center mt-4">
        <p className={`text-sm uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Чистый капитал</p>
        <p
          className={`text-3xl font-bold ${
            netWorth < 0 ? "text-red-500" : "text-green-600"
          }`}
        >
          ₽{formatCurrency(netWorth)}
        </p>
      </div>
    </div>
  );
}