"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingController } from "@/components/onboarding/OnboardingController";
import { Header } from "@/components/layout/Header";
import { GameStateSync } from "@/components/game/GameStateSync";
import { initializeOffers } from '@/store/slices/gameSlice';
import { useLoading } from '@/contexts/LoadingContext';
import StoreProvider from "@/store/StoreProvider";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function ClientSideInitializer() {
  const dispatch = useDispatch();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    dispatch(initializeOffers());
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust this time as needed
  }, [dispatch, setIsLoading]);

  return null;
}

export function App({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

  return (
    <div className={theme}>
      <StoreProvider>
        <ClientSideInitializer />
        <AuthProvider>
          <Header />
          <GameStateSync />
          {children}
          <OnboardingController />
        </AuthProvider>
      </StoreProvider>
    </div>
  );
}
