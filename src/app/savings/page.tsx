// src/app/savings/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
// 1. Убедитесь, что используются правильные типизированные хуки
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { openDeposit } from "@/store/slices/gameSlice";
import { BankOffer } from "@/data/bankOffers";
import { ActiveDepositCard } from "@/components/game/ActiveDepositCard";
import { BankOfferCard } from "@/components/game/BankOfferCard";
import { OpenDepositModal } from "@/components/game/OpenDepositModal";

export default function SavingsPage() {
  const dispatch = useAppDispatch();

  // 2. Используем useAppSelector для получения всего нужного из state
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
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-800">
            Сбережения
          </h1>
          <p className="text-gray-600 mt-2">
            Управляйте вашими вкладами и приумножайте капитал.
          </p>
        </header>

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

        {/* Секция активных вкладов */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Активные вклады</h2>
          {/* 3. Надежная проверка на длину массива */}
          {activeDeposits && activeDeposits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 4. Проходим по массиву и рендерим карточки */}
              {activeDeposits.map((deposit) => (
                <ActiveDepositCard
                  key={deposit.id}
                  deposit={deposit}
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

        {/* Секция доступных предложений */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Доступные предложения</h2>
          {availableOffers && availableOffers.length > 0 ? (
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

      {/* Модальное окно */}
      {selectedOffer && (
        <OpenDepositModal
          offer={selectedOffer}
          balance={balance}
          debt={debt}
          onClose={() => setSelectedOffer(null)}
          onConfirm={handleConfirmDeposit}
        />
      )}
    </main>
  );
}
