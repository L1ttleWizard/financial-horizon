// src/store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import { loadState } from './localStorage';
import onboardingReducer from './slices/onboardingSlice'; 
import { storageMiddleware } from './storageMiddleware';

// 1. Создаем корневой редьюсер. Это позволяет нам вывести тип RootState до создания store.
const rootReducer = combineReducers({
  game: gameReducer,
  onboarding: onboardingReducer,
});

// 2. Теперь RootState определяется явно и без циклических зависимостей.
export type RootState = ReturnType<typeof rootReducer>;

// 3. Загружаем сохраненное состояние. Теперь TypeScript знает, какой тип ожидать.
const preloadedState = loadState();

// 4. Создаем функцию для генерации store
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer, // Используем наш корневой редьюсер
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storageMiddleware),
  });
};

// 5. Типы для хуков теперь выводятся корректно.
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];