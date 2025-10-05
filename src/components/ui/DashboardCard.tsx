// src/components/ui/DashboardCard.tsx
import Link from "next/link";
interface CardProps {
  title: string;
  value: string;
  icon: string;
  subValue?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  linkTo?: string; // <-- НОВОЕ
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
}: CardProps) {
  const content = (
    <div
      className={` rounded-xl  p-4 sm:p-6 flex flex-col justify-between h-full transition-all ${
        linkTo ? "hover:shadow-lg hover:scale-105" : ""
      }`}
    >
      <div>
        <div className="text-3xl sm:text-4xl mb-3">{icon}</div>
        <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">
          {title}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
        {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
      </div>
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
  );

  if (linkTo) {
    return <Link href={linkTo}>{content}</Link>;
  }

  return content;
}
