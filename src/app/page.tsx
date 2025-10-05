// src/app/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { achievementsData } from "@/data/achievementsData";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { PaydayProgressBar } from "@/components/ui/PaydayProgressBar";
import { EventModal } from "@/components/game/EventModal";
import { ResultModal } from "@/components/game/ResultModal";
import { useDispatch } from "react-redux";
import { startNextTurn, resetGame, payDebt } from "@/store/slices/gameSlice";
import { AchievementToast } from "@/components/notifications/AchievementToast";
import { AchievementsWidget } from "@/components/game/AchievementsWidget";
import { MoneyTreeWidget } from "@/components/game/MoneyTreeWidget";
import { NetWorthChart } from "@/components/game/NetWorthChart";
import { GameOverModal } from "@/components/game/GameOverModal";
import { PayDebtModal } from "@/components/game/PayDebtModal";
import { ObligatorySpendsWidget } from "@/components/game/ObligatorySpendsWidget";
import { useAppSelector } from "@/store/hooks";
import { RecentLogsWidget } from "@/components/game/RecentLogsWidget";
import { ForcedGlossaryModal } from "@/components/game/ForcedGlossaryModal";

export default function HomePage() {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useDispatch();
  const [isPayDebtModalOpen, setIsPayDebtModalOpen] = useState(false);
  const [isChartExpanded, setIsChartExpanded] = useState(false); // State for chart visibility

  const monthlyInterestRate = 0.1;
  const turnsInMonth = 4;
  const turnsPassedInMonth = gameState.turn % turnsInMonth;
  const accruedInterest = Math.ceil(
    gameState.debt * monthlyInterestRate * (turnsPassedInMonth / turnsInMonth)
  );

  if (!gameState) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_380px] gap-6 max-w-[1920px] mx-auto">
          
          {/* --- Left Sidebar (Money Tree) --- */}
          <aside className="hidden xl:block">
            <div className="sticky top-6">
              <MoneyTreeWidget
                balance={gameState.balance}
                savings={gameState.savings}
                debt={gameState.debt}
                currentStage={gameState.treeStage}
              />
            </div>
          </aside>

          {/* --- Main Content --- */}
          <div className="flex flex-col gap-6">
            <div
              className="flex flex-wrap items-center justify-center gap-4 p-4 rounded-xl bg-white shadow"
              id="conrols-panel"
            >
              <div id="start-turn-button">
                <button
                  onClick={() => dispatch(startNextTurn())}
                  disabled={
                    gameState.isEventModalOpen ||
                    gameState.isResultModalOpen ||
                    gameState.gameOverState?.isGameOver
                  }
                  className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition"
                >
                  {gameState.turn === 0 ? "Начать игру" : `Следующая неделя`}
                </button>
              </div>
              <button
                onClick={() => dispatch(resetGame())}
                className="w-full sm:w-auto bg-gray-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition"
              >
                Начать игру заново
              </button>
              <Link
                href="/achievements"
                className="w-full sm:w-auto text-center bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition"
              >
                Все достижения
              </Link>
              <Link
                id="glossary-button"
                href="/glossary"
                className="w-full sm:w-auto text-center bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition"
              >
                Глоссарий
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div id="balance-card"><DashboardCard title="Баланс" value={`₽${gameState.balance}`} icon="💰" /></div>
                <div id="mood-card"><DashboardCard title="Настроение" value={`${gameState.mood} / 100`} icon="❤️" /></div>
                <div id="savings-card"><DashboardCard title="Сбережения" value={`₽${gameState.savings}`} icon="📈" subValue={`Активных вкладов: ${gameState.activeDeposits.length}`} linkTo="/savings" /></div>
                <div id="debt-card"><DashboardCard title="Долг" value={`₽${gameState.debt}`} icon="💳" subValue={`Проценты: +₽${accruedInterest}`} actionLabel="Погасить" onAction={() => setIsPayDebtModalOpen(true)} actionDisabled={gameState.debt === 0} /></div>
            </div>

            <div className="mb-6">
              <PaydayProgressBar currentTurn={gameState.turn} />
            </div>

            {/* Collapsible Net Worth Chart */}
            <div className="bg-white rounded-xl shadow-lg">
              <div 
                className="flex justify-between items-center p-5 cursor-pointer"
                onClick={() => setIsChartExpanded(!isChartExpanded)}
              >
                <h3 className="text-xl font-bold text-gray-800">Динамика капитала</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 transition-transform ${isChartExpanded ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              {isChartExpanded && (
                <div className="p-5 pt-0">
                  <NetWorthChart data={gameState.netWorthHistory} />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div id="obligatory-spends-widget"><ObligatorySpendsWidget currentTurn={gameState.turn} weeklySpends={gameState.weeklySpends} monthlyBills={gameState.monthlyBills} /></div>
                <div id="recent-logs-widget"><RecentLogsWidget log={gameState.log} /></div>
            </div>

            {/* On smaller screens, show Tree and Achievements here */}
            <div className="flex flex-col xl:hidden gap-6">
                <MoneyTreeWidget balance={gameState.balance} savings={gameState.savings} debt={gameState.debt} currentStage={gameState.treeStage} />
                <AchievementsWidget unlockedIds={gameState.unlockedAchievements} allAchievements={achievementsData} />
            </div>
          </div>

          {/* --- Right Sidebar (Achievements) --- */}
          <aside className="hidden xl:block">
            <div className="sticky top-6">
              <AchievementsWidget
                unlockedIds={gameState.unlockedAchievements}
                allAchievements={achievementsData}
              />
            </div>
          </aside>
        </div>
      </main>

      {/* --- Modals --- */}
      <AchievementToast />
      {gameState.isEventModalOpen && gameState.currentEvent && <EventModal event={gameState.currentEvent} />}
      {gameState.isResultModalOpen && gameState.lastChoiceResult && <ResultModal result={gameState.lastChoiceResult} />}
      {isPayDebtModalOpen && (
        <PayDebtModal
          currentDebt={gameState.debt}
          currentBalance={gameState.balance}
          onClose={() => setIsPayDebtModalOpen(false)}
          onConfirm={(amount) => {
            dispatch(payDebt(amount));
            setIsPayDebtModalOpen(false);
          }}
        />
      )}
      {gameState.gameOverState?.isGameOver && <GameOverModal reason={gameState.gameOverState.reason} message={gameState.gameOverState.message} />}
      {gameState.isGlossaryForced && <ForcedGlossaryModal term={gameState.forcedGlossaryTerm!} />}
    </>
  );
}
