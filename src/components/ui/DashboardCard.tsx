// src/components/ui/DashboardCard.tsx
import Link from "next/link";
import React from "react";

interface CardProps {
  title: string;
  value: string;
  icon: string;
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
      className={` rounded-xl   p-4 sm:p-6 flex flex-col justify-end h-full transition-all ${
        linkTo ? "hover:shadow-lg hover:scale-105" : ""
      }`}
    >
      <div className="flex-grow flex justify-between mb-6">
        <div className=" mt-6  flex flex-col justify-baseline pb-4 sm:pb-6">
          <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
          {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
          {actionLabel && (
            <button
              onClick={onAction}
              disabled={actionDisabled}
              className="mt-4 w-full bg-blue-100 text-blue-700 font-semibold py-2 rounded-lg text-sm hover:bg-blue-200 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {actionLabel}
            </button>
          )}
        </div>
        <div className="flex items-end mb-4">
          <div className="sm:text-4xl text-6xl">{icon}</div>
        </div>
      </div>
Z    </>
  );

  if (linkTo) {
    return <Link href={linkTo}>{content}</Link>;
  }

  return content;
}
