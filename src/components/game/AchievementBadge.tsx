// src/components/game/AchievementBadge.tsx
import type { Achievement } from '@/data/achievementsData';

interface BadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

export function AchievementBadge({ achievement, isUnlocked }: BadgeProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow p-4 flex items-center gap-4 transition-all ${
        isUnlocked ? 'opacity-100' : 'opacity-60 grayscale'
      }`}
    >
      <div className="text-4xl">{achievement.icon}</div>
      <div className="text-left">
        <h4 className="font-bold text-gray-800">{achievement.title}</h4>
        <p className="text-sm text-gray-500">{isUnlocked ? 'Получено!' : 'Цель'}</p>
      </div>
    </div>
  );
}