'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-client'; // Using alias based on tsconfig.json

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listener for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Syncs the Firebase auth state with the server-side session cookie
  useEffect(() => {
    const syncSession = async () => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          });
        } catch (error) {
          console.error('Failed to sync session on login:', error);
        }
      } else {
        try {
          await fetch('/api/auth/session', {
            method: 'DELETE',
          });
        } catch (error) {
          console.error('Failed to sync session on logout:', error);
        }
      }
    };

    syncSession();
  }, [user]);

  const value = {
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
