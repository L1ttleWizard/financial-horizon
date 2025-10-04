'use client';

import StoreProvider from "../store/StoreProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingController } from "@/components/onboarding/OnboardingController";
import { Header } from "@/components/layout/Header";
import { GameStateSync } from "@/components/game/GameStateSync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AuthProvider>
        <Header />
        <GameStateSync />
        {children}
        <OnboardingController />
      </AuthProvider>
    </StoreProvider>
  );
}
