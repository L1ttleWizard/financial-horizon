// src/store/StoreProvider.tsx
'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // 1. Инициализируем ref с null и указываем, что он может быть AppStore или null
  const storeRef = useRef<AppStore | null>(null);

  // 2. Логика создания store остается той же
  if (!storeRef.current) {
    // Создаем store только если он еще не существует
    storeRef.current = makeStore();
  }

  // 3. Передаем store в Provider.
  // Используем `!` (non-null assertion), чтобы сказать TypeScript, что мы уверены,
  // что к моменту рендера storeRef.current уже не будет null.
  return <Provider store={storeRef.current!}>{children}</Provider>;
}