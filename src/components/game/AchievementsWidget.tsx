import { Achievement } from "@/data/achievementsData";
import { AchievementBadge } from "./AchievementBadge";
import Link from "next/link";

interface AchievementsWidgetProps {
  unlockedIds: string[];
  allAchievements: Achievement[];
}

export function AchievementsWidget({ unlockedIds, allAchievements }: AchievementsWidgetProps) {
  const unlockedCount = unlockedIds.length;
  const totalCount = allAchievements.length;

  const recentAchievements = allAchievements
    .filter(ach => unlockedIds.includes(ach.id))
    .slice(-5)
    .reverse();

  return (
    <div className="rounded-xl shadow-lg p-5 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Недавние достижения</h3>
          <p className="text-sm text-gray-500">{`${unlockedCount} / ${totalCount} разблокировано`}</p>
        </div>
        <Link href="/achievements" className="text-sm text-blue-600 hover:underline whitespace-nowrap">
          Все
        </Link>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto">
        {recentAchievements.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentAchievements.map((ach) => (
              <AchievementBadge key={ach.id} achievement={ach} isUnlocked={true} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500">Вы еще не открыли ни одного достижения.</p>
          </div>
        )}
      </div>
    </div>
  );
}