'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import {
  setGameState,
  resetGame,
  setGameLoadingStatus,
} from '@/store/slices/gameSlice';

export const GameStateSync = () => {
  const { user, loading: authLoading } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (authLoading) {
      dispatch(setGameLoadingStatus('loading'));
      return;
    }

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);

      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          if (userData.gameState) {
            dispatch(setGameState(userData.gameState));
          } else {
            dispatch(resetGame());
          }
        } else {
          console.error("User document not found! Starting a new game.");
          dispatch(resetGame());
        }
      }, (error) => {
        console.error("Error fetching user game state:", error);
        dispatch(setGameLoadingStatus('failed'));
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();

    } else {
      // If there is no user, reset the game state
      dispatch(resetGame());
    }
  }, [user, authLoading, dispatch]);

  return null;
};