// src/app/savings/page.tsx
"use client";
import { useTheme } from "@/contexts/ThemeContext";
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
  const { theme } = useTheme();
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
    <main className="min-h-screen p-4 sm:p-8">
      <div className={`max-w-7xl mx-auto rounded-xl p-6 sm:p-8 ${theme === 'dark' ? 'bg-[rgba(48,19,110,0.65)] border border-[rgba(255,255,255,0.3)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),_0px_2px_4px_-2px_rgba(0,0,0,0.1)]' : 'bg-white shadow-md'}`}>

        <header className="mb-8 text-center">
          <h1 className={`text-3xl sm:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Сбережения
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            Управляйте вашими вкладами и приумножайте капитал.
          </p>
        </header>

        {/* Общая информация о сбережениях */}
        <div className={`rounded-lg p-6 text-white mb-8 ${theme === 'dark' ? 'bg-[rgba(13,4,32,0.35)]' : 'bg-linear-to-r from-blue-500 to-purple-600'}`}>

          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-white'}`}>Ваши сбережения</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-blue-100'}`}>Общая сумма</p>
              <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-white'}`}>₽{formatCurrency(savings)}</p>
            </div>
            <div>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-blue-100'}`}>Банковские вклады</p>
              <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
                ₽{formatCurrency((activeDeposits || []).reduce((sum, dep) => sum + dep.amount, 0))}
              </p>
            </div>
            <div>
              <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
                ₽{formatCurrency((propertyInvestments || []).reduce((sum, inv) => sum + inv.amount, 0))}
              </p>
            </div>
            <div>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-blue-100'}`}>Текущий баланс</p>
              <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-white'}`}>₽{formatCurrency(balance)}</p>
            </div>
          </div>
        </div>

        {/* Секция банковских вкладов */}
        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>🏦 Банковские вклады</h2>
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
            <div className={`text-center py-10 rounded-xl shadow ${theme === 'dark' ? 'bg-[rgba(13,4,32,0.35)] text-gray-400' : 'bg-white text-gray-500'}`}>
              <p>У вас пока нет активных вкладов.</p>
            </div>
          )}
        </section>

        {/* Секция инвестиций в недвижимость */}
        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>🏠 Инвестиции в недвижимость</h2>
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
            <div className={`text-center py-10 rounded-xl shadow ${theme === 'dark' ? 'bg-[rgba(13,4,32,0.35)] text-gray-400' : 'bg-white text-gray-500'}`}>
              <p>У вас пока нет инвестиций в недвижимость. Инвестируйте в событиях игры!</p>
            </div>
          )}
        </section>

        {/* Секция доступных предложений */}
        <section>
          <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Доступные предложения</h2>
          {!areOffersInitialized && availableOffers.length === 0 ? (
            <div className={`text-center py-10 rounded-xl shadow ${theme === 'dark' ? 'bg-[rgba(13,4,32,0.35)] text-gray-400' : 'bg-white text-gray-500'}`}>
              <p>
                Загрузка предложений...
              </p>
            </div>
          ) : availableOffers.length === 0 ? (
            <div className={`text-center py-10 rounded-xl shadow ${theme === 'dark' ? 'bg-[rgba(13,4,32,0.35)] text-gray-400' : 'bg-white text-gray-500'}`}>
              <p>
                В данный момент нет новых предложений от банков.
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
