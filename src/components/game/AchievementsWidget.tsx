import { Achievement } from "@/data/achievementsData";
import { AchievementBadge } from "./AchievementBadge";
import Link from "next/link";
import { useState } from "react";

interface AchievementsWidgetProps {
  unlockedIds: string[];
  allAchievements: Achievement[];
}

export function AchievementsWidget({ unlockedIds, allAchievements }: AchievementsWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const unlockedCount = unlockedIds.length;
  const totalCount = allAchievements.length;

  const recentAchievements = allAchievements
    .filter(ach => unlockedIds.includes(ach.id))
    .slice(-5)
    .reverse();

  const latestAchievement = recentAchievements.length > 0 ? recentAchievements[0] : null;

  return (
    <div className="rounded-xl shadow-lg p-5 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Недавние достижения</h3>
          <p className="text-sm text-gray-500">{`${unlockedCount} / ${totalCount} разблокировано`}</p>
        </div>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-500 hover:text-gray-700">
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
      <div className="flex-grow overflow-y-auto">
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
            <p className="text-center text-gray-500">
              Вы еще не открыли ни одного достижения.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
