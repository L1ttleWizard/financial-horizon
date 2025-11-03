
// src/app/admin/users/[uid]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { achievementsData } from '@/data/achievementsData';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Create a deep copy of the state to modify
    setGameState(prevState => {
      const newState = JSON.parse(JSON.stringify(prevState));
      let current = newState;
      
      const keys = name.split('.');
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      const finalKey = keys[keys.length - 1];
      
      if (type === 'checkbox') {
        current[finalKey] = checked;
      } else if (type === 'number') {
        current[finalKey] = value === '' ? null : Number(value);
      } else {
        current[finalKey] = value;
      }

      return newState;
    });
  };

  const handleAchievementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setGameState(prevState => {
      const unlockedAchievements = prevState.unlockedAchievements || [];
      if (checked) {
        return { ...prevState, unlockedAchievements: [...unlockedAchievements, value] };
      } else {
        return { ...prevState, unlockedAchievements: unlockedAchievements.filter(id => id !== value) };
      }
    });
  };

  const handleDepositChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameState(prevState => {
        const newDeposits = [...(prevState.activeDeposits || [])];
        newDeposits[index] = { ...newDeposits[index], [name]: name === 'bankName' ? value : Number(value) };
        return { ...prevState, activeDeposits: newDeposits };
    });
  };

  const handleAddDeposit = () => {
    setGameState(prevState => ({
        ...prevState,
        activeDeposits: [...(prevState.activeDeposits || []), {
            id: `new-${Date.now()}`,
            bankId: '',
            bankName: '',
            amount: 0,
            annualRate: 0,
            term: 0,
            startTurn: 0,
            endTurn: 0,
        }]
    }));
  };

  const handleRemoveDeposit = (index: number) => {
    setGameState(prevState => ({
        ...prevState,
        activeDeposits: (prevState.activeDeposits || []).filter((_, i) => i !== index)
    }));
  };

  const handlePropertyInvestmentChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGameState(prevState => {
        const newInvestments = [...(prevState.propertyInvestments || [])];
        newInvestments[index] = { ...newInvestments[index], [name]: name === 'name' || name === 'type' || name === 'description' ? value : Number(value) };
        return { ...prevState, propertyInvestments: newInvestments };
    });
  };

  const handleAddPropertyInvestment = () => {
    setGameState(prevState => ({
        ...prevState,
        propertyInvestments: [...(prevState.propertyInvestments || []), {
            id: `new-${Date.now()}`,
            name: '',
            type: 'stocks',
            amount: 0,
            monthlyIncome: 0,
            purchaseTurn: 0,
            description: '',
        }]
    }));
  };

  const handleRemovePropertyInvestment = (index: number) => {
    setGameState(prevState => ({
        ...prevState,
        propertyInvestments: (prevState.propertyInvestments || []).filter((_, i) => i !== index)
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Metrics */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Core Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label htmlFor="balance" className="mb-2 font-semibold">Balance</label>
              <input type="number" name="balance" id="balance" value={gameState.balance ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="mood" className="mb-2 font-semibold">Mood</label>
              <input type="number" name="mood" id="mood" value={gameState.mood ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="savings" className="mb-2 font-semibold">Savings</label>
              <input type="number" name="savings" id="savings" value={gameState.savings ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="debt" className="mb-2 font-semibold">Debt</label>
              <input type="number" name="debt" id="debt" value={gameState.debt ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="day" className="mb-2 font-semibold">Day</label>
              <input type="number" name="day" id="day" value={gameState.day ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
            </div>
             <div className="flex flex-col">
              <label htmlFor="treeStage" className="mb-2 font-semibold">Tree Stage</label>
              <input type="number" name="treeStage" id="treeStage" value={gameState.treeStage ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
            </div>
          </div>
        </div>

        {/* System Variables */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 class="text-xl font-bold mb-4">System Variables</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label htmlFor="monthlyBills" className="mb-2 font-semibold">Monthly Bills</label>
              <input type="number" name="monthlyBills" id="monthlyBills" value={gameState.monthlyBills ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="weeklySpends" className="mb-2 font-semibold">Weekly Spends</label>
              <input type="number" name="weeklySpends" id="weeklySpends" value={gameState.weeklySpends ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="monthlySalary" className="mb-2 font-semibold">Monthly Salary</label>
              <input type="number" name="monthlySalary" id="monthlySalary" value={gameState.monthlySalary ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 class="text-xl font-bold mb-4">Game Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                    <label htmlFor="status" className="mb-2 font-semibold">Status</label>
                    <select name="status" id="status" value={gameState.status ?? 'idle'} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
                        <option value="idle">Idle</option>
                        <option value="loading">Loading</option>
                        <option value="succeeded">Succeeded</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="moodAtZeroTurns" className="mb-2 font-semibold">Mood at Zero Turns</label>
                    <input type="number" name="moodAtZeroTurns" id="moodAtZeroTurns" value={gameState.moodAtZeroTurns ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="negativeEventCounter" className="mb-2 font-semibold">Negative Event Counter</label>
                    <input type="number" name="negativeEventCounter" id="negativeEventCounter" value={gameState.negativeEventCounter ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="lastEventId" className="mb-2 font-semibold">Last Event ID</label>
                    <input type="text" name="lastEventId" id="lastEventId" value={gameState.lastEventId ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                </div>
            </div>
        </div>

        {/* Game Over */}
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 class="text-xl font-bold mb-4">Game Over</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                    <input type="checkbox" name="gameOverState.isGameOver" id="isGameOver" checked={gameState.gameOverState?.isGameOver ?? false} onChange={handleInputChange} className="h-5 w-5 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500" />
                    <label htmlFor="isGameOver" className="ml-3 font-semibold">Is Game Over</label>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="gameOverReason" className="mb-2 font-semibold">Game Over Reason</label>
                    <select name="gameOverState.reason" id="gameOverReason" value={gameState.gameOverState?.reason ?? ''} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" disabled={!gameState.gameOverState?.isGameOver}>
                        <option value="">None</option>
                        <option value="DEBT_SPIRAL">Debt Spiral</option>
                        <option value="EMOTIONAL_BURNOUT">Emotional Burnout</option>
                        <option value="BANKRUPTCY">Bankruptcy</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 class="text-xl font-bold mb-4">Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {achievementsData.map(achievement => (
                    <div key={achievement.id} className="flex items-center">
                        <input
                            type="checkbox"
                            id={`achieve-${achievement.id}`}
                            value={achievement.id}
                            checked={gameState.unlockedAchievements?.includes(achievement.id) ?? false}
                            onChange={handleAchievementChange}
                            className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor={`achieve-${achievement.id}`} className="ml-2 text-sm text-gray-300">{achievement.title}</label>
                    </div>
                ))}
            </div>
        </div>

        {/* Active Deposits */}
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 class="text-xl font-bold mb-4">Active Deposits</h2>
            <div className="space-y-4">
                {(gameState.activeDeposits || []).map((deposit, index) => (
                    <div key={deposit.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-700 rounded-md">
                        <input type="text" name="bankName" placeholder="Bank Name" value={deposit.bankName} onChange={e => handleDepositChange(index, e)} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                        <input type="number" name="amount" placeholder="Amount" value={deposit.amount} onChange={e => handleDepositChange(index, e)} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                        <input type="number" name="annualRate" placeholder="Rate" value={deposit.annualRate} onChange={e => handleDepositChange(index, e)} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                        <input type="number" name="term" placeholder="Term" value={deposit.term} onChange={e => handleDepositChange(index, e)} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                        <button onClick={() => handleRemoveDeposit(index)} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md">Remove</button>
                    </div>
                ))}
            </div>
            <button onClick={handleAddDeposit} className="mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md">Add Deposit</button>
        </div>

        {/* Property Investments */}
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 class="text-xl font-bold mb-4">Property Investments</h2>
            <div className="space-y-4">
                {(gameState.propertyInvestments || []).map((investment, index) => (
                    <div key={investment.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-700 rounded-md">
                        <input type="text" name="name" placeholder="Name" value={investment.name} onChange={e => handlePropertyInvestmentChange(index, e)} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                        <select name="type" value={investment.type} onChange={e => handlePropertyInvestmentChange(index, e)} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
                            <option value="apartment">Apartment</option>
                            <option value="commercial">Commercial</option>
                            <option value="crypto">Crypto</option>
                            <option value="stocks">Stocks</option>
                        </select>
                        <input type="number" name="amount" placeholder="Amount" value={investment.amount} onChange={e => handlePropertyInvestmentChange(index, e)} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                        <button onClick={() => handleRemovePropertyInvestment(index)} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md">Remove</button>
                    </div>
                ))}
            </div>
            <button onClick={handleAddPropertyInvestment} className="mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md">Add Investment</button>
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
