"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

interface UserData {
  uid: string;
  nickname: string;
  turn: number;
  netWorth: number;
}

async function getLeaderboardData(): Promise<UserData[]> {
  try {
    const usersRef = collection(db, "users");
    // Fetch more users than needed to account for potential filtering in the future
    // or for users with incomplete data.
    const q = query(
      usersRef,
      orderBy("gameState.turn", "desc"),
      limit(40)
    );

    const usersSnapshot = await getDocs(q);

    if (usersSnapshot.empty) {
      return [];
    }

    // Use a Map to filter out duplicate UIDs and ensure data integrity.
    const uniqueUsers = new Map<string, UserData>();

    usersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const uid = doc.id;

      // Basic validation to ensure essential data exists
      if (data.gameState && data.gameState.netWorthHistory && !uniqueUsers.has(uid)) {
        const lastNetWorthPoint = data.gameState.netWorthHistory.slice(-1)[0];

        uniqueUsers.set(uid, {
          uid: uid,
          nickname: data.nickname || data.email || "Anonymous",
          turn: data.gameState.turn || 0,
          netWorth: lastNetWorthPoint ? lastNetWorthPoint.netWorth : 0,
        });
      }
    });

    // Return the top 20 unique users
    return Array.from(uniqueUsers.values()).slice(0, 20);

  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLeaderboardData().then((data) => {
      setLeaderboard(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen p-4 sm:p-6 flex justify-center">
      <div className="w-full max-w-4xl rounded-xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
          Таблица лидеров
        </h1>
        {isLoading ? (
          <div className="text-center text-gray-500">Загрузка...</div>
        ) : leaderboard.length > 0 ? (
          <ol className="space-y-4">
            {leaderboard.map((user, index) => (
              <li
                key={user.uid}
                className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md"
              >
                <span className="text-xl sm:text-2xl font-bold text-gray-500 w-12 text-center">
                  {index + 1}
                </span>
                <span className="text-base sm:text-lg font-medium text-gray-700 flex-grow px-4">
                  {user.nickname}
                </span>
                <div className="flex flex-col sm:flex-row sm:gap-6 text-right text-sm sm:text-base text-gray-600 w-48">
                  <span className="font-semibold">Неделя: {user.turn}</span>
                  <span className="font-semibold">
                    Капитал: ₽{user.netWorth.toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            Таблица лидеров пока пуста. Станьте первым!
          </p>
        )}
      </div>
    </main>
  );
}
