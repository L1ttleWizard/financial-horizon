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
  badnessFactor?: number;
  highlightColor?: string;
  optionalStyles?:string;
}

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
  badnessFactor,
  highlightColor,
  optionalStyles
}: CardProps) {
  let dynamicStyle = {};
  if (highlightColor) {
    dynamicStyle = {
      borderColor: highlightColor,
      backgroundColor: hexToRgba(highlightColor, 0.1),
      boxShadow: `0 0 15px 5px ${hexToRgba(highlightColor, 0.5)}`,
    };
  } else if (badnessFactor && badnessFactor > 0) {
    const intensity = Math.min(badnessFactor, 1);
    dynamicStyle = {
      backgroundColor: `rgba(239, 68, 68, ${intensity * 0.2})`,
      borderColor: `rgba(239, 68, 68, ${intensity})`,
      boxShadow: `0 0 15px 5px rgba(239, 68, 68, ${intensity * 0.75})`,
    };
  } else {
    dynamicStyle = {
      borderColor: "transparent",
    };
  }

  const cardStyle = {
    ...(backgroundImage
      ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {}),
    ...dynamicStyle,
  };

  const baseClasses =
    "group relative w-full rounded-xl p-4 sm:p-6 flex flex-col justify-end h-full transition-all border-2";
  const linkClasses = linkTo ? "hover:scale-105" : "mb-6";

  const content = (
    <>
      <div className="flex-grow flex justify-between">
        <div className="flex flex-col justify-baseline pb-4 sm:pb-6 pt2">
          <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
          {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
        </div>
        <div className="flex items-end">
          <div className="">
            <span className={`${optionalStyles}`}>
              {icon}
            </span>
          </div>
        </div>
      </div>
      {actionLabel && (
        <div className="absolute bottom-3 left-2 -translate-x-1/2 translate-y-[0calc(-100%+1rem)] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none :opacity-100">
          <button
            onClick={onAction}
            disabled={actionDisabled}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed pointer-events-auto"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </>
  );

  if (linkTo) {
    return (
      <Link
        href={linkTo}
        style={cardStyle}
        className={`${baseClasses} ${linkClasses}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div style={cardStyle} className={`${baseClasses} ${linkClasses}`}>
      {content}
    </div>
  );
}
