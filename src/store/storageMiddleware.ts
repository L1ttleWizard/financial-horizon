// src/store/storageMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from './store';
import { saveState } from './localStorage';

// Middleware - это функция, которая "перехватывает" каждое действие
// ИСПРАВЛЕНО: Заменили {} на Record<string, never> для удовлетворения ESLint
export const storageMiddleware: Middleware<Record<string, never>, RootState> = store => next => action => {
  // Сначала позволяем действию дойти до редьюсера и обновить состояние
  const result = next(action);

  // После того как состояние обновилось, мы получаем его и сохраняем
  const state = store.getState();
  saveState(state);

  return result;
};