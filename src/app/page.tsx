// src/app/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { RootState } from '@/store/store';
import { achievementsData } from '@/data/achievementsData';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { PaydayProgressBar } from '@/components/ui/PaydayProgressBar';
import { EventModal } from '@/components/game/EventModal';
import { ResultModal } from '@/components/game/ResultModal';
import { useDispatch, useSelector } from 'react-redux';
import { startNextTurn, resetGame, payDebt } from '@/store/slices/gameSlice';
import { AchievementToast } from '@/components/notifications/AchievementToast';
import { AchievementsWidget } from '@/components/game/AchievementsWidget';
import { MoneyTreeWidget } from '@/components/game/MoneyTreeWidget';
import { NetWorthChart } from '@/components/game/NetWorthChart';
import { RecentLogsWidget } from '@/components/game/RecentLogsWidget';
import { PayDebtModal } from '@/components/game/PayDebtModal';

export default function HomePage() {
  const gameState = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const [isPayDebtModalOpen, setIsPayDebtModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <header className="mb-8 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-800">Финансовый Горизонт</h1>
            <p className="text-gray-600 mt-2">Неделя: {gameState.turn + 1}</p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <DashboardCard title="Баланс" value={`$${gameState.balance}`} icon="💰" />
          <DashboardCard title="Настроение" value={`${gameState.mood} / 100`} icon="❤️" />
          <DashboardCard title="Сбережения" value={`$${gameState.savings}`} icon="📈" />
          <DashboardCard 
            title="Долг" 
            value={`$${gameState.debt}`} 
            icon="💳" 
            actionLabel="Погасить"
            onAction={() => setIsPayDebtModalOpen(true)}
            actionDisabled={gameState.debt === 0}
          />
        </div>
        
        <div className="mb-10">
            <PaydayProgressBar currentTurn={gameState.turn} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            <NetWorthChart data={gameState.netWorthHistory} />
            <RecentLogsWidget log={gameState.log} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 my-10">
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
        
        <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => dispatch(startNextTurn())}
              disabled={gameState.isEventModalOpen || gameState.isResultModalOpen}
              className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
              {gameState.turn === 0 ? "Начать игру" : `Следующая неделя`}
            </button>
            <button 
              onClick={() => dispatch(resetGame())}
              className="w-full sm:w-auto bg-gray-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition"
            >
              Начать заново
            </button>
            <Link href="/achievements" className="w-full sm:w-auto text-center bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition">
                Все достижения
            </Link>
            <Link href="/glossary" className="w-full sm:w-auto text-center bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition">
                Глоссарий
            </Link>
            <Link href="/log" className="w-full sm:w-auto text-center bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition">
                Полный лог
            </Link>
        </div>

      </div>
      
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
    </main>
  );
}