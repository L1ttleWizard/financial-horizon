"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect, useCallback } from "react";

interface UserData {
  uid: string;
  nickname: string;
  week: number;
  netWorth: number;
}

async function getLeaderboardData(): Promise<UserData[]> {
  try {
    const response = await fetch('/api/leaderboard', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }
}

export default function LeaderboardPage() {
  const { theme } = useTheme();
  const [leaderboard, setLeaderboard] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    const data = await getLeaderboardData();
    setLeaderboard(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeaderboard();
    setIsRefreshing(false);
  };

  return (
    <main className="h-fit p-4 sm:p-6 flex justify-center">
      <div
        className={`w-full max-w-4xl rounded-xl p-6 sm:p-8 h-fit ${
          theme === "dark"
            ? "bg-[rgba(48,19,110,0.65)] border border-[rgba(255,255,255,0.3)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
            : "bg-white shadow-md"
        }`}>
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1
            className={`text-3xl sm:text-4xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}>
            Таблица лидеров
          </h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className={`py-2 px-4 rounded-md text-white font-semibold transition-colors ${
              isRefreshing || isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}>
            {isRefreshing ? "Обновление..." : "Обновить"}
          </button>
        </div>
        {isLoading && !isRefreshing ? (
          <div
            className={`text-center text-gray-500 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
            Загрузка...
          </div>
        ) : leaderboard.length > 0 ? (
          <ol className="space-y-4">
            {leaderboard.map((user, index) => (
              <li
                key={user.uid}
                className={`flex items-center p-4 rounded-lg shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md ${
                  theme === "dark" ? "bg-[rgba(13,4,32,0.35)]" : "bg-gray-50"
                }`}>
                <span
                  className={`text-xl sm:text-2xl font-bold w-12 text-center ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}>
                  {index + 1}
                </span>
                <span
                  className={`text-base sm:text-lg font-medium grow px-4 ${
                    theme === "dark" ? "text-white" : "text-gray-700"
                  }`}>
                  {user.nickname}
                </span>
                <div
                  className={`flex flex-col sm:flex-row sm:gap-6 text-right text-sm sm:text-base w-48 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Неделя: {user.week}</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Капитал: ₽{user.netWorth.toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p
            className={`text-center text-gray-500 mt-8 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
            Таблица лидеров пока пуста. Станьте первым!
          </p>
        )}
      </div>
    </main>
  );
}
