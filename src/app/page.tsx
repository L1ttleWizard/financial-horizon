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

  // --- ЛОГИКА ДЛЯ КАРТОЧКИ ДОЛГА ---
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
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl">

        <div
          className="flex flex-wrap items-center justify-center gap-4 mb-6 p-4 rounded-xl"
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
          <Link
            href="/log"
            className="w-full sm:w-auto text-center bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition"
          >
            Полный лог действий
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
          <div id="balance-card">
            <DashboardCard
              title="Баланс"
              value={`$${gameState.balance}`}
              icon="💰"
            />
          </div>
          <div id="mood-card">
            <DashboardCard
              title="Настроение"
              value={`${gameState.mood} / 100`}
              icon="❤️"
            />
          </div>
          <div id="savings-card">
            <DashboardCard
              title="Сбережения"
              value={`$${gameState.savings}`}
              icon="📈"
              subValue={`Активных вкладов: ${gameState.activeDeposits.length}`}
              linkTo="/savings"
            />
          </div>
          <div id="debt-card">
            <DashboardCard
              title="Долг"
              value={`$${gameState.debt}`}
              icon="💳"
              subValue={`Проценты в этом месяце: +$${accruedInterest}`}
              actionLabel="Погасить"
              onAction={() => setIsPayDebtModalOpen(true)}
              actionDisabled={gameState.debt === 0}
            />
          </div>
        </div>

        <div className="mb-6">
          <PaydayProgressBar currentTurn={gameState.turn} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <NetWorthChart data={gameState.netWorthHistory} />
          {/* Новая колонка с двумя виджетами */}
          <div className="flex flex-col gap-6" id="obligatory-spends-widget">
            <div id="obligatory-spends-widget">
              <ObligatorySpendsWidget 
              currentTurn={gameState.turn} 
              weeklySpends={gameState.weeklySpends}
              monthlyBills={gameState.monthlyBills}
            />
            </div>
            <div id="recent-logs-widget">
              <RecentLogsWidget log={gameState.log} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <MoneyTreeWidget
              balance={gameState.balance}
              savings={gameState.savings}
              debt={gameState.debt}
              currentStage={gameState.treeStage}
            />
          </div>
          <div className="lg:col-span-2">
            <AchievementsWidget
              unlockedIds={gameState.unlockedAchievements}
              allAchievements={achievementsData}
            />
          </div>
        </div>
      </div>

      <AchievementToast />

      {gameState.isEventModalOpen && gameState.currentEvent && (
        <div id="event-modal">
          <EventModal event={gameState.currentEvent} />
        </div>
      )}

      {gameState.isResultModalOpen && gameState.lastChoiceResult && (
        <div id="result-modal">
          <ResultModal result={gameState.lastChoiceResult} />
        </div>
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

      {/* РЕНДЕР МОДАЛЬНОГО ОКНА ПРОИГРЫША */}
      {gameState.gameOverState?.isGameOver && (
        <GameOverModal
          reason={gameState.gameOverState.reason}
          message={gameState.gameOverState.message}
        />
      )}
      {/*  МОДАЛЬНОЕ ОКНО ДЛЯ ГЛОССАРИЯ */}
      {gameState.isGlossaryForced && (
        <ForcedGlossaryModal term={gameState.forcedGlossaryTerm!} />
      )}
    </main>
  );
}
