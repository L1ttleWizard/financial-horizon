import { adminDb, adminAuth } from "@/lib/firebase-admin";

interface UserData {
  uid: string;
  email: string;
  nickname: string;
  turn: number;
  netWorth: number;
}

async function getLeaderboardData(): Promise<UserData[]> {
  try {
    const usersSnapshot = await adminDb
      .collection("users")
      .orderBy("gameState.turn", "desc")
      .limit(40) // Fetch more to account for filtering
      .get();

    if (usersSnapshot.empty) {
      return [];
    }

    const userPromises = usersSnapshot.docs.map(async (doc) => {
      try {
        // Verify user exists in Firebase Auth
        await adminAuth.getUser(doc.id);

        const data = doc.data();
        const lastNetWorthPoint = data.gameState.netWorthHistory.slice(-1)[0];

        return {
          uid: doc.id,
          email: data.email,
          nickname: data.nickname || data.email,
          turn: data.gameState.turn || 0,
          netWorth: lastNetWorthPoint ? lastNetWorthPoint.netWorth : 0,
        };
      } catch {
        // If getUser fails, the user doesn't exist in Auth.
        console.log(
          `User with UID ${doc.id} not found in Auth, filtering from leaderboard.`
        );
        return null;
      }
    });

    const settledUsers = await Promise.all(userPromises);

    // Filter out nulls (deleted users) and limit to the top 20 valid users
    const validUsers = settledUsers.filter(
      (user): user is UserData => user !== null
    );

    return validUsers.slice(0, 20);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboardData();

  return (
    <main className="min-h-screen p-4 sm:p-6 flex justify-center">
      <div className="w-full max-w-4xl rounded-xl p-6 sm:p-8">
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
