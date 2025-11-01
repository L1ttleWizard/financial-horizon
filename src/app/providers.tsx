'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import StoreProvider from "../store/StoreProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingController } from "@/components/onboarding/OnboardingController";
import { Header } from "@/components/layout/Header";
import { GameStateSync } from "@/components/game/GameStateSync";
import { initializeOffers } from '@/store/slices/gameSlice';

function ClientSideInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeOffers());
  }, [dispatch]);

  return null; // This component doesn't render anything
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ClientSideInitializer />
      <AuthProvider>
        <Header />
        <GameStateSync />
        {children}
        <OnboardingController />
      </AuthProvider>
    </StoreProvider>
  );
}