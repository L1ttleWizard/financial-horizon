import { Achievement } from "@/data/achievementsData";
import { AchievementBadge } from "./AchievementBadge";

import { useState } from "react";

import { useTheme } from "@/contexts/ThemeContext";

interface AchievementsWidgetProps {
  unlockedIds: string[];
  allAchievements: Achievement[];
}

export function AchievementsWidget({ unlockedIds, allAchievements }: AchievementsWidgetProps) {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const unlockedCount = unlockedIds.length;
  const totalCount = allAchievements.length;

  const recentAchievements = allAchievements
    .filter(ach => unlockedIds.includes(ach.id))
    .slice(-5)
    .reverse();



  return (
    <div className={`rounded-xl shadow-lg p-5 flex flex-col pb-8 ${
      theme === 'dark'
        ? 'bg-[rgba(48,19,110,0.75)]  bg-opacity-50 ${theme==="dark" ?"bg-[rgba(48,19,110,0.65)] border-2 border-[rgba(255,255,255,0.3)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-xl'
        : 'bg-white'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-7 ">
        <div>
          <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Недавние достижения</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{`${unlockedCount} / ${totalCount} разблокировано`}</p>
        </div>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className={`hover:text-gray-700 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-6 h-6 transition-transform duration-300 ${
              !isCollapsed ? "rotate-180" : ""
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 9-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className=" overflow-y-auto">
        {recentAchievements.length > 0 ? (
          <div>
            {/* Always show the latest achievement */}
            <AchievementBadge
              key={recentAchievements[0].id}
              achievement={recentAchievements[0]}
              isUnlocked={true}
            />

            {/* The collapsible part with the rest of the achievements */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isCollapsed ? "max-h-0" : "max-h-[1000px]"
              }`}
            >
              <div className="flex flex-col gap-3 pt-3">
                {recentAchievements.slice(1).map((ach) => (
                  <AchievementBadge
                    key={ach.id}
                    achievement={ach}
                    isUnlocked={true}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
              Вы еще не открыли ни одного достижения.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
