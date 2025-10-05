// src/app/achievements/page.tsx
'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { achievementsData } from '@/data/achievementsData';

export default function AchievementsPage() {
  const unlockedAchievements = useSelector((state: RootState) => state.game.unlockedAchievements);

  return (
    <main className="min-h-screen p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-800">Достижения</h1>
          <p className="text-gray-600 mt-2">Ваши трофеи на пути к финансовой грамотности.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievementsData.map((ach) => {
            const isUnlocked = unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition-all ${
                  isUnlocked ? 'opacity-100' : 'opacity-50 grayscale'
                }`}
              >
                <div className="text-6xl mb-4">{ach.icon}</div>
                <h3 className="text-xl font-bold text-gray-800">{ach.title}</h3>
                <p className="text-gray-600 mt-2">{isUnlocked ? ach.description : '???'}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition">
              Вернуться к игре
          </Link>
        </div>
      </div>
    </main>
  );
}