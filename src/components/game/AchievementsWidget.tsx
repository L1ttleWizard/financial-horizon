// src/components/game/AchievementsWidget.tsx
'use client';

import type { Achievement } from '@/data/achievementsData';
import { AchievementBadge } from './AchievementBadge';

interface WidgetProps {
  unlockedIds: string[];
  allAchievements: Achievement[];
}

export function AchievementsWidget({ unlockedIds, allAchievements }: WidgetProps) {
  // Получаем последние 3 разблокированные ачивки и переворачиваем, чтобы новые были первыми
  const recentUnlocked = allAchievements
    .filter(ach => unlockedIds.includes(ach.id))
    .slice(-3)
    .reverse();

  // Если ничего не открыто, показываем первые 3 заблокированные как тизер
  const lockedTeasers = allAchievements
    .filter(ach => !unlockedIds.includes(ach.id))
    .slice(0, 3);
  
  const achievementsToShow = recentUnlocked.length > 0 ? recentUnlocked : lockedTeasers;
  const isShowingUnlocked = recentUnlocked.length > 0;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center sm:text-left">
        {isShowingUnlocked ? 'Недавние достижения' : 'Ближайшие цели'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievementsToShow.map(ach => (
          <AchievementBadge
            key={ach.id}
            achievement={ach}
            isUnlocked={isShowingUnlocked}
          />
        ))}
      </div>
    </div>
  );
}