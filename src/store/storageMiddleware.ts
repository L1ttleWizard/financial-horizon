// src/store/storageMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from './store';
import { saveState } from './localStorage';
import { auth } from '@/lib/firebase-client'; // Import Firebase auth

// Middleware to save state to localStorage for anonymous users
export const storageMiddleware: Middleware<Record<string, never>, RootState> = store => next => action => {
  const result = next(action);

  // Only save to localStorage if the user is NOT logged in.
  // For logged-in users, firestoreMiddleware will handle persistence.
  if (!auth.currentUser) {
    const state = store.getState();
    saveState(state);
  }

  return result;
};