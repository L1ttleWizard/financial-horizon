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
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Таблица лидеров</h1>
        {leaderboard.length > 0 ? (
          <ol style={listStyle}>
            {leaderboard.map((user, index) => (
              <li key={user.uid} style={listItemStyle}>
                <span style={rankStyle}>{index + 1}</span>
                <span style={emailStyle}>{user.email}</span>
                <div style={statsStyle}>
                  <span>Неделя: {user.turn}</span>
                  <span>Капитал: ${user.netWorth.toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p>Таблица лидеров пока пуста. Станьте первым!</p>
        )}
      </div>
    </div>
  );
}

// Styles
const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: '2rem',
  backgroundColor: '#f9fafb',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '800px',
  padding: '2rem',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '1.5rem',
  textAlign: 'center',
  color: '#1f2937',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
};

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '1rem 0.5rem',
  borderBottom: '1px solid #e5e7eb',
  gap: '1rem',
};

const rankStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '#6b7280',
  width: '40px',
  textAlign: 'center',
};

const emailStyle: React.CSSProperties = {
  fontWeight: '500',
  color: '#111827',
  flexGrow: 1,
};

const statsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1.5rem',
  color: '#4b5563',
  minWidth: '200px',
  justifyContent: 'space-between',
};
