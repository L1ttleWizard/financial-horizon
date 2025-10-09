export const DashboardCardSkeleton = () => {
  return (
    <div className="bg-white p-6 sm:p-6 rounded-3xl shadow-md flex flex-col justify-end h-full animate-pulse">
      <div className="flex-grow flex justify-between mb-8">
        <div className="flex flex-col justify-baseline pb-10 sm:pb-6 pt-2">
          <div className="h-4 bg-gray-300 rounded w-20 mb-4"></div> {/* Skeleton for title */}
          <div className="h-8 bg-gray-300 rounded w-32 mb-2"></div> {/* Skeleton for value */}
          <div className="h-3 bg-gray-300 rounded w-24"></div>      {/* Skeleton for subValue */}
        </div>
        <div className="flex items-end">
          <div className="w-15 h-15 bg-gray-300 rounded-full"></div> {/* Skeleton for icon */}
        </div>
      </div>
    </div>
  );
};