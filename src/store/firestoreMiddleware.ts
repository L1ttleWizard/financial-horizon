import { Middleware } from '@reduxjs/toolkit';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase-client';

// Debounce utility
let debounceTimer: NodeJS.Timeout;

const debounce = (func: () => void, delay: number) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(func, delay);
};

export const firestoreMiddleware: Middleware = store => next => action => {
  // First, let the action pass through and update the state
  const result = next(action);

  // Now, get the current user and the new state
  const user = auth.currentUser;
  const state = store.getState();

  // We only want to save the state if a user is logged in
  // and the action is related to the game slice
  if (
    user &&
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof (action as { type: string }).type === 'string' &&
    ((action as { type: string }).type.startsWith('game/') || (action as { type: string }).type.startsWith('onboarding/'))
  ) {
    debounce(() => {
      const userDocRef = doc(db, 'users', user.uid);
      // We update both gameState and onboardingState fields
      updateDoc(userDocRef, { 
        gameState: state.game,
        onboardingState: state.onboarding 
      }).catch(error => {
        console.error("Failed to save state to Firestore:", error);
      });
    }, 1500); // Debounce for 1.5 seconds
  }

  return result;
};
