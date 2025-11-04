// src/app/log/page.tsx
"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { LogItem } from "@/components/ui/LogItem";

export default function LogPage() {
  const { theme } = useTheme();
  const log = useSelector((state: RootState) => state.game.log);
  const fullLog = [...log].reverse();

  return (
    <main className="min-h-screen p-4 sm:p-8 flex justify-center">
      <div className={`w-full max-w-4xl rounded-xl p-6 sm:p-8 ${theme === 'dark' ? 'bg-[rgba(48,19,110,0.65)] border border-[rgba(255,255,255,0.3)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),_0px_2px_4px_-2px_rgba(0,0,0,0.1)]' : 'bg-white shadow-md'}`}>

        <header className="mb-8 text-center">
          <h1 className={`text-3xl sm:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Журнал операций
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            Полная история ваших финансовых решений.
          </p>
        </header>
        <div className="mt-8 text-center mb-6">
          <Link
            href="/"
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            Вернуться к игре
          </Link>
        </div>
        <div className={`rounded-xl shadow-md p-4 sm:p-6 ${theme === 'dark' ? 'bg-[rgba(13,4,32,0.35)]' : 'bg-gray-100'}`}>

          {fullLog.length > 0 ? (
            fullLog.map((entry) => <LogItem key={entry.id} entry={entry} />)
          ) : (
            <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              История операций пока пуста.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
