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
import { MascotWidget } from "@/components/game/MascotWidget";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardCardSkeleton } from "@/components/ui/DashboardCardSkeleton";
import { getMoodEmoji } from "@/data/moodEmojis";
import { formatCurrency } from "@/lib/format";
import { NetWorthHistoryPoint } from "@/store/slices/gameSlice";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { FcDebt } from "react-icons/fc";

const basePath = '/financial-horizon';

// Function to downsample chart data for performance
const summarizeNetWorthHistory = (history: NetWorthHistoryPoint[]): NetWorthHistoryPoint[] => {
  if (history.length <= 52) {
    return history; // Return weekly data for the first year
  }

  const monthlyData: NetWorthHistoryPoint[] = [];
  let monthSum = 0;
  let monthCount = 0;
  let monthWeek = 4;

  history.forEach((point, index) => {
    monthSum += point.netWorth;
    monthCount++;

    // Average every 4 weeks (a month)
    if ((index + 1) % 4 === 0) {
      monthlyData.push({
        week: monthWeek,
        netWorth: Math.round(monthSum / monthCount),
      });
      monthSum = 0;
      monthCount = 0;
      monthWeek += 4;
    }
  });

  // Add any remaining weeks as the last month
  if (monthCount > 0) {
    monthlyData.push({
      week: monthWeek,
      netWorth: Math.round(monthSum / monthCount),
    });
  }

  return monthlyData;
};

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const gameState = useAppSelector((state) => state.game);
  const gameStatus = useAppSelector((state) => state.game.status);
  const dispatch = useDispatch();
  const [isPayDebtModalOpen, setIsPayDebtModalOpen] = useState(false);
  const [isChartExpanded, setIsChartExpanded] = useState(false); // State for chart visibility

  const monthlyInterestRate = 0.1;
  const turnsInMonth = 4;
  const turnsPassedInMonth = gameState.turn % turnsInMonth;
  const accruedInterest = Math.ceil(
    gameState.debt * monthlyInterestRate * (turnsPassedInMonth / turnsInMonth)
  );

  const isLoading = authLoading || (user && gameStatus === 'loading');

  return (
    <>
      <main className="min-h-screen p-4 sm:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_380px] gap-6 max-w-[1920px] mx-auto">
          {/* --- Left Sidebar (Controls) --- */}
          <aside className="xl:block">
            <div className="sticky top-6 flex flex-col gap-6">
            <div
              className="flex flex-wrap items-stretch justify-center gap-6 rounded-xl justify-items-stretch w-full"
              id="conrols-panel"
            >
              <div className="w-full">
                <button
                  onClick={() => dispatch(startNextTurn())}
                  disabled={
                    gameState.isEventModalOpen ||
                    gameState.isResultModalOpen ||
                    gameState.gameOverState?.isGameOver
                  }
                  className=" start-turn-button w-full h-full bg-blue-600 text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:bg-blue-700 transition"
                >
                  {gameState.turn === 0 ? "Начать игру" : `Следующая неделя`}
                </button>
              </div>
              <button
                onClick={() => dispatch(resetGame())}
                className=" new-game-button w-full h-full bg-gray-700 text-white font-bold py-3 px-12 rounded-lg hover:bg-gray-800 transition"
              >
                Начать игру заново
              </button>
              <Link
                href="/achievements"
                className=" all-achievements-button w-full  h-full text-center bg-yellow-500 text-white font-bold py-3 px-12 rounded-lg hover:bg-yellow-600 transition flex items-center justify-center"
              >
                Все достижения
              </Link>
              <Link
                id="glossary-button"
                href="/glossary"
                className="glossary-button w-full  h-full text-center bg-yellow-500 text-white font-bold py-3 px-12 rounded-lg hover:bg-yellow-600 transition flex flex-col items-center justify-center"
              >
                <span>Словарь терминов</span>
              </Link>
            </div>
              <div className="flex-1">
                <MascotWidget />
              </div>
            </div>
          </aside>

          {/* --- Main Content --- */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* --- Top Cards --- */}
            {isLoading ? (
              <>
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
              </>
            ) : (
              <>
                <div
                  id="balance-card"
                  className="lg:col-span-1 rounded-xl flex"
                >
                  <DashboardCard
                    title="Баланс"
                    value={`₽${formatCurrency(gameState.balance)}`}
                    icon={<FaRegMoneyBillAlt color="green" />}
                  />
                </div>
                <div id="mood-card" className="lg:col-span-1 rounded-xl flex">
                  <DashboardCard
                    title="Настроение"
                    value={`${gameState.mood} / 100`}
                    icon={getMoodEmoji(gameState.mood)}
                  />
                </div>
                <div
                  id="savings-card"
                  className="lg:col-span-1 hover:scale-105 transition-all rounded-xl flex"
                >
                  <DashboardCard
                    title="Сбережения"
                    value={`₽${formatCurrency(gameState.savings)}`}
                    icon={<BsGraphUpArrow color="blue" />}
                    subValue={`Активных вкладов: ${gameState.activeDeposits.length}`}
                    linkTo="/savings"
                  />
                </div>
                <div id="debt-card" className="lg:col-span-1 rounded-xl flex">
                  <DashboardCard
                    title="Долг"
                    value={`₽${formatCurrency(gameState.debt)}`}
                    icon={<FcDebt />}
                    subValue={`Проценты: +₽${formatCurrency(accruedInterest)}`}
                    actionLabel="Погасить"
                    onAction={() => setIsPayDebtModalOpen(true)}
                    actionDisabled={gameState.debt === 0}
                  />
                </div>
              </>
            )}

            {/* --- Progress Bar --- */}
            <div className="lg:col-span-4">
              <PaydayProgressBar currentTurn={gameState.turn} />
            </div>

            {/* --- Collapsible Net Worth Chart --- */}
            <div className="lg:col-span-4 bg-white rounded-xl shadow-lg">
              <div
                className="flex justify-between items-center p-5 cursor-pointer"
                onClick={() => setIsChartExpanded(!isChartExpanded)}
              >
                <h3 className="text-xl font-bold text-gray-800">
                  Динамика капитала
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-6 h-6 transition-transform ${
                    isChartExpanded ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              {isChartExpanded && (
                <div className="p-5 pt-0">
                  <NetWorthChart data={summarizeNetWorthHistory(gameState.netWorthHistory)} />
                </div>
              )}
            </div>

            {/* --- Widgets --- */}
            <div className="lg:col-span-2">
              <ObligatorySpendsWidget
                currentTurn={gameState.turn}
                weeklySpends={gameState.weeklySpends}
                monthlyBills={gameState.monthlyBills}
              />
            </div>
            <div className="lg:col-span-2">
              <RecentLogsWidget log={gameState.log} />
            </div>

            {/* On smaller screens, show Tree and Achievements here */}
            <div className="flex flex-col xl:hidden gap-6">
              <MoneyTreeWidget
                balance={gameState.balance}
                savings={gameState.savings}
                debt={gameState.debt}
                currentStage={gameState.treeStage}
              />
              <AchievementsWidget
                unlockedIds={gameState.unlockedAchievements}
                allAchievements={achievementsData}
              />
            </div>
          </div>

          {/* --- Right Sidebar (Achievements & Tree) --- */}
          <aside className="hidden xl:block">
            <div className="sticky top-4 flex flex-col gap-6 h-full">
              <div className="flex-1">
                <AchievementsWidget
                  unlockedIds={gameState.unlockedAchievements}
                  allAchievements={achievementsData}
                />
              </div>
              <div className="flex-1">
                <MoneyTreeWidget
                  balance={gameState.balance}
                  savings={gameState.savings}
                  debt={gameState.debt}
                  currentStage={gameState.treeStage}
                />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* --- Modals --- */}
      <AchievementToast />
      {gameState.isEventModalOpen && gameState.currentEvent && (
        <EventModal event={gameState.currentEvent} />
      )}
      {gameState.isResultModalOpen && gameState.lastChoiceResult && (
        <ResultModal result={gameState.lastChoiceResult} />
      )}
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
      {gameState.gameOverState?.isGameOver && (
        <GameOverModal
          reason={gameState.gameOverState.reason}
          message={gameState.gameOverState.message}
        />
      )}
      {gameState.isGlossaryForced && (
        <ForcedGlossaryModal term={gameState.forcedGlossaryTerm!} />
      )}
    </>
  );
}
