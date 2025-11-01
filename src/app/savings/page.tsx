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
import { PropertyInvestmentCard } from "@/components/game/PropertyInvestmentCard";
import { formatCurrency } from "@/lib/format";

export default function SavingsPage() {
  const dispatch = useAppDispatch();

  // 2. Используем useAppSelector для получения всего нужного из state
  const { activeDeposits, propertyInvestments, availableOffers, turn, balance, debt, savings, areOffersInitialized } =
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
    <main className="min-h-screen p-4 sm:p-8 text-gray-600">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-800">
            Сбережения
          </h1>
          <p className="text-gray-600 mt-2">
            Управляйте вашими вкладами и приумножайте капитал.
          </p>
        </header>

        {/* Общая информация о сбережениях */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">Ваши сбережения</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-blue-100">Общая сумма</p>
              <p className="text-3xl font-bold">₽{formatCurrency(savings)}</p>
            </div>
            <div>
              <p className="text-blue-100">Банковские вклады</p>
              <p className="text-xl font-semibold">
                ₽{formatCurrency((activeDeposits || []).reduce((sum, dep) => sum + dep.amount, 0))}
              </p>
            </div>
            <div>
              <p className="text-blue-100">Инвестиции</p>
              <p className="text-xl font-semibold">
                ₽{formatCurrency((propertyInvestments || []).reduce((sum, inv) => sum + inv.amount, 0))}
              </p>
            </div>
            <div>
              <p className="text-blue-100">Текущий баланс</p>
              <p className="text-xl font-semibold">₽{formatCurrency(balance)}</p>
            </div>
          </div>
        </div>

        {/* Секция банковских вкладов */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">🏦 Банковские вклады</h2>
          {(activeDeposits || []).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bgw">
              {(activeDeposits || []).map((deposit) => (
                <ActiveDepositCard
                  key={deposit.id}
                  deposit={deposit}
                  currentTurn={turn}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 rounded-xl shadow bg-white">
              <p className="text-gray-500">У вас пока нет активных вкладов.</p>
            </div>
          )}
        </section>

        {/* Секция инвестиций в недвижимость */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">🏠 Инвестиции в недвижимость</h2>
          {(propertyInvestments || []).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(propertyInvestments || []).map((investment) => (
                <PropertyInvestmentCard
                  key={investment.id}
                  investment={investment}
                  currentTurn={turn}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl shadow">
              <p className="text-gray-500">У вас пока нет инвестиций в недвижимость. Инвестируйте в событиях игры!</p>
            </div>
          )}
        </section>

        {/* Секция доступных предложений */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Доступные предложения</h2>
          {!areOffersInitialized || availableOffers.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow">
              <p className="text-gray-500">
                {!areOffersInitialized ? "Загрузка предложений..." : "В данный момент нет новых предложений от банков."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {availableOffers.map((offer) => (
                <BankOfferCard
                  key={offer.id}
                  offer={offer}
                  onSelect={() => setSelectedOffer(offer)}
                />
              ))}
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
