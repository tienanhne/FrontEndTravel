const PlaceCardSkeleton = () => {
    return (
      <div className="p-4 shadow-lg dark:bg-slate-950 dark:text-white animate-pulse">
        <div className="overflow-hidden">
          <div className="bg-gray-300 h-[220px] w-full"></div>
        </div>
  
        <div className="space-y-2 p-3">
          <div className="bg-gray-300 h-6 w-3/4"></div>
          <div className="flex items-center gap-2 opacity-70">
            <div className="bg-gray-300 h-4 w-1/4"></div>
          </div>
          <div className="bg-gray-300 h-4 w-full"></div>
          <div className="flex items-center justify-between border-t-2 py-3 !mt-3">
            <div className="bg-gray-300 h-4 w-1/4"></div>
            <div className="flex items-center ml-2 space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-300 w-5 h-5"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default PlaceCardSkeleton;
  