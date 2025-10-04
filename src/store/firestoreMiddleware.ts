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
  if (user && action.type.startsWith('game/')) {
    debounce(() => {
      const userDocRef = doc(db, 'users', user.uid);
      // We update only the gameState field, leaving other fields (like email, createdAt) untouched
      updateDoc(userDocRef, { gameState: state.game }).catch(error => {
        console.error("Failed to save game state to Firestore:", error);
      });
    }, 1500); // Debounce for 1.5 seconds
  }

  return result;
};
