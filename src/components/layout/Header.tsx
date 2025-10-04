'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase-client';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export const Header = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const onboardingCompleted = useAppSelector((state) => state.onboarding.hasCompleted);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/'); // Redirect to home after logout
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <Link href="/" style={logoStyle}>
          Финансовый Горизонт
        </Link>
        <nav style={navStyle}>
          <Link href="/leaderboard" style={linkStyle}>
            Таблица лидеров
          </Link>
          {loading ? (
            <div>Загрузка...</div>
          ) : user ? (
            <>
              <Link href="/profile" style={linkStyle}>
                Профиль
              </Link>
              <button onClick={handleLogout} style={buttonStyle}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={linkStyle}>
                Войти
              </Link>
              {onboardingCompleted && (
                <Link href="/register" style={linkStyle}>
                  Регистрация
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

// Basic styles
const headerStyle: React.CSSProperties = {
  width: '100%',
  padding: '1rem 2rem',
  backgroundColor: '#fff',
  borderBottom: '1px solid #eaeaea',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
};

const logoStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#333',
  textDecoration: 'none',
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
};

const linkStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#0070f3',
  textDecoration: 'none',
  fontWeight: '500',
};

const buttonStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#0070f3',
  fontWeight: '500',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
};
