'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase-client';
import { bankOffersPool } from '@/data/bankOffers';
import { useAppSelector } from '@/store/hooks';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onboardingCompleted = useAppSelector((state) => state.onboarding.hasCompleted);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create initial game state for the new user
      const initialGameState = {
        balance: 500,
        mood: 70,
        savings: 0,
        debt: 0,
        treeStage: 1,
        turn: 0,
        activeDeposits: [],
        propertyInvestments: [],
        availableOffers: [...bankOffersPool].sort(() => 0.5 - Math.random()).slice(0, 3),
        moodAtZeroTurns: 0,
        gameOverState: { isGameOver: false },
        currentEvent: null,
        log: [],
        netWorthHistory: [{ week: 0, netWorth: 500 }],
        lastChoiceResult: null,
        isEventModalOpen: false,
        isResultModalOpen: false,
        unlockedAchievements: [],
        newlyUnlockedAchievement: null,
        isGlossaryForced: false,
        forcedGlossaryTerm: null,
        monthlyBills: 600,
        weeklySpends: 100,
        monthlySalary: 1600,
      };

      // Create a new document in Firestore for the user
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        gameState: initialGameState,
      });

      router.push('/'); // Redirect to home page

        } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!onboardingCompleted) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Регистрация пока недоступна</h2>
        <p>Пожалуйста, пройдите обучение в игре, чтобы открыть возможность регистрации.</p>
        <Link href="/" style={{ color: '#0070f3', marginTop: '1rem', display: 'inline-block' }}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Регистрация</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
          style={{ marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '10px', backgroundColor: isLoading ? '#ccc' : '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
}
