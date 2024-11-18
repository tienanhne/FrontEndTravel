import React from "react";

const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 shadow-lg dark:bg-slate-950 dark:text-white animate-pulse">
      <div className="overflow-hidden bg-gray-300 h-[250px] w-full mb-4"></div>
      <div className="flex justify-between pt-2 text-slate-600">
        <div className="h-4 bg-gray-300 w-1/3"></div>
        <div className="h-4 bg-gray-300 w-1/4"></div>
      </div>
      <div className="space-y-2 py-3">
        <div className="h-6 bg-gray-300 w-2/3"></div>
        <div className="h-4 bg-gray-300 w-full"></div>
        <div className="h-4 bg-gray-300 w-5/6"></div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
