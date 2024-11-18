

const TravelCardSkeleton = () => {
  return (
    <div className="relative shadow-lg transition-all duration-500 hover:shadow-xl dark:bg-slate-950 dark:text-white cursor-pointer rounded-lg overflow-hidden">
      <div className="skeleton h-56 w-full bg-gray-300 dark:bg-gray-700"></div>
      <div className="space-y-2 p-4">
        <div className="skeleton h-6 w-3/4 bg-gray-300 dark:bg-gray-700"></div>
        <div className="flex items-center gap-2 opacity-70">
          <div className="skeleton h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="skeleton h-6 w-1/2 bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <div className="flex justify-between">
          <div className="skeleton h-6 w-1/3 bg-gray-300 dark:bg-gray-700"></div>
          <div className="skeleton h-6 w-1/3 bg-gray-300 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export default TravelCardSkeleton;
