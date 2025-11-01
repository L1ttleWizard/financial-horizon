
// src/app/admin/users/[uid]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { GameState } from '@/store/slices/gameSlice';

interface UserData {
  displayName: string | null;
  email: string | null;
  uid: string;
  gameState?: Partial<GameState>;
}

// A simplified initial state for the form
const initialFormState: Partial<GameState> = {
  balance: 0,
  mood: 0,
  savings: 0,
  debt: 0,
  turn: 0,
};

export default function UserGameManagementPage() {
  const { user } = useAuth();
  const params = useParams();
  const uid = params.uid as string;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [gameState, setGameState] = useState<Partial<GameState>>(initialFormState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !uid) return;

      setLoading(true);
      try {
        const idToken = await user.getIdToken();
        const response = await fetch(`/api/admin/users/${uid}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data.user);
        // Assuming the game state is stored in a 'gameState' field
        // If it's not, we might need to adjust this
        setGameState(data.user.gameState || initialFormState);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, uid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameState(prevState => ({
      ...prevState,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!user) {
      setError('Authentication error.');
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/admin/users/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ gameState }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update game state');
      }

      setMessage('Game state updated successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading user data...</p>;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Manage User Game State</h1>
      {userData && (
        <div className="mb-6">
          <p><span className="font-semibold">User:</span> {userData.displayName || 'No Name'}</p>
          <p><span className="font-semibold">Email:</span> {userData.email}</p>
          <p><span className="font-semibold">UID:</span> {userData.uid}</p>
        </div>
      )}

      {error && <p className="text-red-400 bg-red-900 p-3 rounded-md mb-4">Error: {error}</p>}
      {message && <p className="text-green-400 bg-green-900 p-3 rounded-md mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="balance" className="mb-2 font-semibold">Balance</label>
            <input
              type="number"
              name="balance"
              id="balance"
              value={gameState.balance ?? ''}
              onChange={handleInputChange}
              className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="mood" className="mb-2 font-semibold">Mood</label>
            <input
              type="number"
              name="mood"
              id="mood"
              value={gameState.mood ?? ''}
              onChange={handleInputChange}
              className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="savings" className="mb-2 font-semibold">Savings</label>
            <input
              type="number"
              name="savings"
              id="savings"
              value={gameState.savings ?? ''}
              onChange={handleInputChange}
              className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="debt" className="mb-2 font-semibold">Debt</label>
            <input
              type="number"
              name="debt"
              id="debt"
              value={gameState.debt ?? ''}
              onChange={handleInputChange}
              className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="turn" className="mb-2 font-semibold">Turn</label>
            <input
              type="number"
              name="turn"
              id="turn"
              value={gameState.turn ?? ''}
              onChange={handleInputChange}
              className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
            />
          </div>
        </div>
        <div className="mt-6">
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
