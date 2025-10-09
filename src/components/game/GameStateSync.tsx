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
      // Wait for auth to be resolved
      if (authLoading) {
        return;
      }

      // If user is logged in and we haven't loaded their state yet
      if (user && !hasLoaded) {
        dispatch(setGameLoadingStatus('loading'));
        setHasLoaded(true); // Mark as loading attempted
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.gameState) {
              // Dispatch the loaded state to Redux
              dispatch(setGameState(userData.gameState));
            }
          } else {
            // This case might happen if the user doc wasn't created on registration
            console.error("User document not found in Firestore!");
            dispatch(setGameLoadingStatus('failed'));
            // Optionally, dispatch resetGame or handle error
          }
        } catch (error) {
          console.error("Error fetching user game state:", error);
          dispatch(setGameLoadingStatus('failed'));
        }
      }
      // If user is logged out, reset the game state and loading flag
      else if (!user) {
        dispatch(resetGame());
        setHasLoaded(false); // Allow reloading for the next user who logs in
      }
    };

    syncGameState();

  }, [user, authLoading, dispatch, hasLoaded]);

  // This component does not render anything
  return null;
};