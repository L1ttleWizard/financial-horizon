// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "../store/StoreProvider";
import "./globals.css";
import { OnboardingController } from "@/components/onboarding/OnboardingController";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Финансовый Горизонт",
  description: "Обучающее приложение по финансовой грамотности",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <StoreProvider>
          {children}
          <OnboardingController />
        </StoreProvider>
      </body>
    </html>
  );
}
