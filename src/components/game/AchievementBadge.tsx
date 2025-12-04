// src/components/game/AchievementBadge.tsx
import type { Achievement } from "@/data/achievementsData";
import { useTheme } from "@/contexts/ThemeContext";

interface BadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

export function AchievementBadge({ achievement, isUnlocked }: BadgeProps) {
  const { theme } = useTheme();
  return (
    <div
      className={` rounded-lg  p-3 flex items-center gap-4 transition-all ${
        isUnlocked ? "opacity-100" : "opacity-60 grayscale"
      } ${
        theme === "dark"
          ? "bg-[rgba(48,19,110,0.65)] border border-[rgba(255,255,255,0.3)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-xl"
          : "bg-gray-100"
      }`}>
      <div className="text-3xl ">{achievement.icon}</div>
      <div className="text-left grow">
        <h4
          className={`font-bold ${
            theme === "dark" ? "text-white" : " text-gray-800"
          }`}>
          {achievement.title}
        </h4>
        <p className="text-sm text-gray-500">{achievement.description}</p>
      </div>
    </div>
  );
}
