// src/components/game/PropertyInvestmentCard.tsx
"use client";

import { PropertyInvestment } from "@/store/slices/gameSlice";
import { formatCurrency } from "@/lib/format";

interface PropertyInvestmentCardProps {
  investment: PropertyInvestment;
  currentTurn: number;
}

export function PropertyInvestmentCard({ investment, currentTurn }: PropertyInvestmentCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'apartment': return '🏠';
      case 'commercial': return '🏢';
      case 'crypto': return '₿';
      case 'stocks': return '📈';
      default: return '💼';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'apartment': return 'Недвижимость';
      case 'commercial': return 'Коммерческая недвижимость';
      case 'crypto': return 'Криптовалюта';
      case 'stocks': return 'Акции';
      default: return 'Инвестиция';
    }
  };

  const monthsOwned = currentTurn - investment.purchaseTurn;
  const totalIncome = monthsOwned * investment.monthlyIncome;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getTypeIcon(investment.type)}</span>
          <div>
            <h3 className="font-semibold text-gray-800">{investment.name}</h3>
            <p className="text-sm text-gray-600">{getTypeName(investment.type)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">
            ₽{formatCurrency(investment.amount)}
          </p>
          <p className="text-sm text-gray-500">Стоимость</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div>
          <p className="text-sm text-gray-600">Ежемесячный доход</p>
          <p className="font-semibold text-green-600">
            +₽{formatCurrency(investment.monthlyIncome)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Общий доход</p>
          <p className="font-semibold text-blue-600">
            +₽{formatCurrency(totalIncome)}
          </p>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Куплено {monthsOwned} недель назад
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {investment.description}
        </p>
      </div>
    </div>
  );
}
