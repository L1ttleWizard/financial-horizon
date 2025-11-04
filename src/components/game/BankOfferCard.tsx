// src/components/game/BankOfferCard.tsx
import { BankOffer } from "@/data/bankOffers";
import { formatCurrency } from "@/lib/format";
import { useTheme } from "@/contexts/ThemeContext";

export function BankOfferCard({
  offer,
  onSelect,
}: {
  offer: BankOffer;
  onSelect: () => void;
}) {
  const { theme } = useTheme();
  return (
    <div className={`rounded-xl shadow p-6 flex flex-col transition-all hover:shadow-lg ${theme === 'dark' ? 'bg-[rgba(13,4,32,0.35)]' : 'bg-white'}`}>

      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{offer.bankName}</h3>
      <p className={`text-sm mb-4 flex-grow ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        {offer.description}
      </p>

      {/* НОВЫЙ БЛОК С ИНФОРМАЦИЕЙ */}
      <div className={`space-y-2 text-sm border-t border-b py-3 my-3 ${theme === 'dark' ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200'}`}>
        <div className="flex justify-between">
          <span>Доступные сроки (нед):</span>
          <span className="font-semibold">{offer.termOptions.join(", ")}</span>
        </div>
        <div className="flex justify-between">
          <span>Мин. вклад:</span>
          <span className="font-semibold">₽{formatCurrency(offer.minDeposit)}</span>
        </div>
      </div>

      <div className="my-4 text-center">
        <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
          {(offer.annualRate * 100).toFixed(0)}%  
        </span>
        <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}> годовых</span>
      </div>
      <button
        onClick={onSelect}
        className="w-full mt-auto bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Открыть вклад
      </button>
    </div>
  );
}
