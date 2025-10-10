'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import {
  setGameState,
  resetGame,
  setGameLoadingStatus,
} from '@/store/slices/gameSlice';

export const GameStateSync = () => {
  const { user, loading: authLoading } = useAuth();
  const dispatch = useDispatch();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const syncGameState = async () => {
      if (authLoading) {
        return;
      }

      if (user && !hasLoaded) {
        dispatch(setGameLoadingStatus('loading'));
        setHasLoaded(true);
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // If user has a game state, load it
            if (userData.gameState) {
              dispatch(setGameState(userData.gameState));
            } else {
              // If user exists but has no game state (new user), start a new game.
              // resetGame sets the status to 'succeeded', which will hide the loader.
              dispatch(resetGame());
            }
          } else {
            // If the user document doesn't exist at all, also start a new game.
            console.error("User document not found in Firestore! Starting a new game.");
            dispatch(resetGame());
          }
        } catch (error) {
          console.error("Error fetching user game state:", error);
          dispatch(setGameLoadingStatus('failed')); // Set to failed on error
        }
      }
      else if (!user) {
        dispatch(resetGame());
        setHasLoaded(false);
      }
    };

    syncGameState();

  }, [user, authLoading, dispatch, hasLoaded]);

  return null;
};