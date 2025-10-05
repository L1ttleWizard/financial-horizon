// src/components/game/RecentLogsWidget.tsx
"use client";
import { LogEntry } from "@/store/slices/gameSlice";
import { LogItem } from "@/components/ui/LogItem";
import Link from "next/link";

export function RecentLogsWidget({ log }: { log: LogEntry[] }) {
  const recentLogs = [...log].reverse().slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Последние операции
      </h2>
      <div className=" flex flex-col gap-y-4 bg-gray-100 rounded-xl p-4">
        <div className="flex flex-col">
          {recentLogs.length > 0 ? (
            recentLogs.map((entry) => <LogItem key={entry.id} entry={entry} />)
          ) : (
            <p className="text-gray-500 text-center">
              История операций пока пуста.
            </p>
          )}
        </div>
        <Link
          href="/log"
          className=" text-center text-blue-600 font-semibold hover:underline"
        >
          Посмотреть весь лог
        </Link>
      </div>
    </div>
  );
}
