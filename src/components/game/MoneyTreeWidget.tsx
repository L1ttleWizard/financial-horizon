// src/components/game/MoneyTreeWidget.tsx
"use client";

import Image from "next/image";
import { treeData } from "@/data/treeData";
import { formatCurrency } from "@/lib/format";


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
  badnessFactor,
}: WidgetProps) {
  const netWorth = balance + savings - debt;
  const tree = treeData.find((t) => t.stage === currentStage) || treeData[0];

  let dynamicStyle = {};
  if (badnessFactor && badnessFactor > 0) {
    const intensity = Math.min(badnessFactor, 1);
    dynamicStyle = {
      backgroundColor: `white`,
      borderColor: `rgba(239, 68, 68, ${intensity})`,
      boxShadow: `0 0 15px 5px rgba(239, 68, 68, ${intensity * 0.75})`,
    };
  } else {
    dynamicStyle = {
      borderColor: "transparent",
    };
  }

  return (
    <div
      className="relative rounded-xl shadow-md p-6 flex flex-col items-center justify-between h-full bg-white transition-all border-2"
      style={dynamicStyle}>
      <div>
        <h2 className="text-2xl font-bold text-gray-700 text-center">
          Денежное дерево
        </h2>
        <p className="text-center text-gray-500 mb-4">Ваш финансовый рост</p>
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
        <p className="text-sm text-gray-500 uppercase">Чистый капитал</p>
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