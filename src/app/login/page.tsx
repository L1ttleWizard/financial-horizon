'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect to home page on successful login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Вход</h2>
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
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Войти
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Нет аккаунта? <Link href="/register" style={{ color: '#0070f3', textDecoration: 'none' }}>Зарегистрируйтесь</Link>
        </p>
      </form>
    </div>
  );
}
