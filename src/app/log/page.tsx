// src/app/log/page.tsx
"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { LogItem } from "@/components/ui/LogItem";

export default function LogPage() {
  const log = useSelector((state: RootState) => state.game.log);
  const fullLog = [...log].reverse();

  return (
    <main className="min-h-screen p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-800">
            Журнал операций
          </h1>
          <p className="text-gray-600 mt-2">
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
        <div className="rounded-xl shadow-md p-4 sm:p-6">
          {fullLog.length > 0 ? (
            fullLog.map((entry) => <LogItem key={entry.id} entry={entry} />)
          ) : (
            <p className="text-gray-500 text-center py-8">
              История операций пока пуста.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
