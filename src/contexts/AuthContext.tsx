'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase-client';

const basePath = '';

// Extend the Firebase User type to include our custom role
export interface UserWithRole extends User {
  role?: 'admin' | 'user';
}

interface AuthContextType {
  user: UserWithRole | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Listener for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, now fetch their role from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userWithRole: UserWithRole = Object.assign(firebaseUser, { role: (userData.role as 'admin' | 'user') || 'user' });
          setUser(userWithRole);
        } else {
          // Handle case where user exists in Auth but not in Firestore
          const userWithRole: UserWithRole = Object.assign(firebaseUser, { role: 'user' as 'admin' | 'user' });
          setUser(userWithRole);
        }
      } else {
        setUser(null);
      }
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
          await fetch(`${basePath}/api/auth/session`, {
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
          await fetch(`${basePath}/api/auth/session`, {
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
