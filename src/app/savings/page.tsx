// src/app/savings/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { openDeposit } from "@/store/slices/gameSlice";
import { BankOffer } from "@/data/bankOffers";
import { ActiveDepositCard } from "@/components/game/ActiveDepositCard";
import { BankOfferCard } from "@/components/game/BankOfferCard";
import { OpenDepositModal } from "@/components/game/OpenDepositModal";

export default function SavingsPage() {
  const dispatch = useAppDispatch();
  const { activeDeposits, availableOffers, turn, balance, debt } =
    useAppSelector((state) => state.game);
  const [selectedOffer, setSelectedOffer] = useState<BankOffer | null>(null);

  const handleConfirmDeposit = (payload: {
    offer: BankOffer;
    amount: number;
    term: number;
  }) => {
    dispatch(openDeposit(payload));
    setSelectedOffer(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-600">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold">Сбережения</h1>
          <p className="text-gray-600 mt-2">
            Управляйте вашими вкладами и приумножайте капитал.
          </p>
        </header>

        {/* НОВЫЙ БЛОК С КЛЮЧЕВЫМИ ПОКАЗАТЕЛЯМИ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-gray-500 uppercase text-sm">Текущий баланс</p>
            <p className="text-4xl font-bold text-green-600">${balance}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-gray-500 uppercase text-sm">Текущий долг</p>
            <p className="text-4xl font-bold text-red-600">${debt}</p>
          </div>
        </div>

        {/* Активные вклады */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Активные вклады</h2>
          {activeDeposits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeDeposits.map((dep) => (
                <ActiveDepositCard
                  key={dep.id}
                  deposit={dep}
                  currentTurn={turn}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl shadow">
              <p className="text-gray-500">У вас пока нет активных вкладов.</p>
            </div>
          )}
        </section>

        {/* Доступные предложения */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Доступные предложения</h2>
          {availableOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableOffers.map((offer) => (
                <BankOfferCard
                  key={offer.id}
                  offer={offer}
                  onSelect={() => setSelectedOffer(offer)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl shadow">
              <p className="text-gray-500">
                В данный момент нет новых предложений от банков.
              </p>
            </div>
          )}
        </section>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg"
          >
            Вернуться к игре
          </Link>
        </div>
      </div>

      {selectedOffer && (
        <OpenDepositModal
          offer={selectedOffer}
          balance={balance}
          debt={debt} // <-- ПЕРЕДАЕМ ДОЛГ
          onClose={() => setSelectedOffer(null)}
          onConfirm={handleConfirmDeposit}
        />
      )}
    </main>
  );
}
