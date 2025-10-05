// src/components/game/MoneyTreeWidget.tsx
'use client';

import Image from 'next/image';
import { treeData } from '@/data/treeData';

interface WidgetProps {
  balance: number;
  savings: number;
  debt: number;
  currentStage: number;
}

export function MoneyTreeWidget({ balance, savings, debt, currentStage }: WidgetProps) {
  const netWorth = balance + savings - debt;
  const tree = treeData.find(t => t.stage === currentStage) || treeData[0];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-between h-full">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 text-center">Денежное дерево</h2>
        <p className="text-center text-gray-500 mb-4">Ваш финансовый рост</p>
      </div>
      
      <div className="relative w-48 h-48 sm:w-64 sm:h-64">
        <Image
          src={tree.imagePath}
          alt={`Дерево на стадии ${tree.stage}`}
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 uppercase">Чистый капитал</p>
        <p className={`text-3xl font-bold ${netWorth < 0 ? 'text-red-500' : 'text-green-600'}`}>
          ₽{netWorth}
        </p>
      </div>
    </div>
  );
}