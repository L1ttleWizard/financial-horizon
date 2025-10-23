// src/components/ui/DashboardCard.tsx
import Link from "next/link";
import { ReactNode } from "react";
interface CardProps {
  title: string;
  value: string;
  icon: string | ReactNode;
  subValue?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  linkTo?: string; // <-- НОВОЕ
  backgroundImage?: string;
}

export function DashboardCard({
  title,
  value,
  icon,
  subValue,
  actionLabel,
  onAction,
  actionDisabled = false,
  linkTo,
  backgroundImage,
}: CardProps) {
  const cardStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  const content = (
    <div
      style={cardStyle}
      className={` ${
        linkTo
          ? " hover:scale-105"
          : "group relative w-full rounded-xl p-4 sm:p-6 flex flex-col justify-end h-full transition-all"
      }`}>
      <div className="flex-grow flex justify-between mb-6">
        <div className="flex flex-col justify-baseline pb-4 sm:pb-6 pt2">
          <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
          {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
        </div>
        <div className="flex items-end">
          <div className="sm:text-4xl text-6xl">{icon}</div>
        </div>
      </div>
      {actionLabel && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+0.5rem)] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none">
          <button
            onClick={onAction}
            disabled={actionDisabled}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed pointer-events-auto">
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link
        href={linkTo}
        className={`group relative w-full rounded-xl p-4 sm:p-6 flex flex-col justify-end h-full transition-all ${
          linkTo ? " hover:scale-105" : ""
        }`}>
        {content}
      </Link>
    );
  }

  return content;
}
