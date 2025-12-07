import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LoadingProvider } from "@/contexts/LoadingContext";
import CurtainController from "./CurtainController";
import { App } from "./App";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
        <ThemeProvider>
          <LoadingProvider>
            <CurtainController />
            <App>{children}</App>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
