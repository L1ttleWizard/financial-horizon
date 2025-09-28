// src/components/notifications/AchievementToast.tsx
'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { clearNewAchievement } from '@/store/slices/gameSlice';

export function AchievementToast() {
  const dispatch = useDispatch();
  const achievement = useSelector((state: RootState) => state.game.newlyUnlockedAchievement);

  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        dispatch(clearNewAchievement());
      }, 4000); // Уведомление исчезнет через 4 секунды

      return () => clearTimeout(timer);
    }
  }, [achievement, dispatch]);

  if (!achievement) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 bg-white shadow-lg rounded-xl p-4 max-w-sm w-full flex items-center gap-4 z-50 animate-fade-in-up">
      <div className="text-4xl">{achievement.icon}</div>
      <div>
        <h3 className="font-bold text-gray-800">Достижение получено!</h3>
        <p className="text-gray-600">{achievement.title}</p>
      </div>
    </div>
  );
}