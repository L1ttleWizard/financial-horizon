import { adminDb } from "@/lib/firebase-admin";

interface UserData {
  uid: string;
  email: string;
  turn: number;
  netWorth: number;
}

async function getLeaderboardData(): Promise<UserData[]> {
  try {
    // We query the users collection, order by the 'turn' field within gameState in descending order, and limit to 20 results.
    const usersSnapshot = await adminDb
      .collection('users')
      .orderBy('gameState.turn', 'desc')
      .limit(20)
      .get();

    if (usersSnapshot.empty) {
      return [];
    }

    const leaderboardData: UserData[] = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      const lastNetWorthPoint = data.gameState.netWorthHistory.slice(-1)[0];
      return {
        uid: doc.id,
        email: data.email,
        turn: data.gameState.turn || 0,
        netWorth: lastNetWorthPoint ? lastNetWorthPoint.netWorth : 0,
      };
    });

    return leaderboardData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return []; // Return empty array on error
  }
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboardData();

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
          Таблица лидеров
        </h1>
        {leaderboard.length > 0 ? (
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
                  {user.email}
                </span>
                <div className="flex flex-col sm:flex-row sm:gap-6 text-right text-sm sm:text-base text-gray-600 w-48">
                  <span className="font-semibold">Неделя: {user.turn}</span>
                  <span className="font-semibold">
                    Капитал: ${user.netWorth.toLocaleString()}
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