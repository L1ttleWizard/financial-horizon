// src/components/game/BankOfferCard.tsx
import { BankOffer } from "@/data/bankOffers";
import { formatCurrency } from "@/lib/format";

export function BankOfferCard({
  offer,
  onSelect,
}: {
  offer: BankOffer;
  onSelect: () => void;
}) {
  return (
    <div className="rounded-xl shadow p-6 flex flex-col transition-all hover:shadow-lg bg-white">
      <h3 className="text-xl font-bold text-gray-800">{offer.bankName}</h3>
      <p className="text-gray-500 text-sm mb-4 flex-grow">
        {offer.description}
      </p>

      {/* НОВЫЙ БЛОК С ИНФОРМАЦИЕЙ */}
      <div className="space-y-2 text-sm text-gray-700 border-t border-b py-3 my-3">
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
        <span className="text-4xl font-bold text-green-600">
          {(offer.annualRate * 100).toFixed(0)}%
        </span>
        <span className="text-gray-500"> годовых</span>
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
