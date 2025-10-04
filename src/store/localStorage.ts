// src/store/localStorage.ts
import { RootState } from './store';
import { auth } from '@/lib/firebase-client';

// Функция для загрузки состояния из Local Storage
export const loadState = (): RootState | undefined => {
  // If a user is logged in, do not load from localStorage.
  // The state will be loaded from Firestore by GameStateSync.
  if (auth.currentUser) {
    return undefined;
  }

  // Проверяем, что мы находимся в браузере, а не на сервере
  if (typeof window === 'undefined') {
    return undefined;
  }
  try {
    const serializedState = localStorage.getItem('gameState');
    if (serializedState === null) {
      return undefined; // Нет сохраненного состояния
    }
    return JSON.parse(serializedState) as RootState;
  } catch (err) {
    console.error("Could not load state from local storage", err);
    return undefined;
  }
};

// Функция для сохранения состояния в Local Storage
export const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('gameState', serializedState);
  } catch (err) {
    console.error("Could not save state to local storage", err);
  }
};