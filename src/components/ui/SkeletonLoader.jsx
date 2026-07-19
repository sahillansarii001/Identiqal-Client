import React from "react";

export function SkeletonLoader({ type = "table", rows = 5 }) {
  if (type === "card") {
    return (
      <div className="bg-white dark:bg-[#1A1116] rounded-xl border border-gray-100 dark:border-white/5 p-5 w-full animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-white/5 rounded-lg" />
          <div className="w-20 h-6 bg-gray-200 dark:bg-white/5 rounded-full" />
        </div>
        <div className="w-1/3 h-4 bg-gray-200 dark:bg-white/5 rounded mb-2" />
        <div className="w-1/2 h-6 bg-gray-200 dark:bg-white/5 rounded mb-6" />
        <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded" />
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="w-full bg-white dark:bg-[#1A1116] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
          <div className="w-48 h-8 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="w-24 h-8 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex p-4 items-center gap-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 dark:bg-white/5 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/4" />
                <div className="h-3 bg-gray-200 dark:bg-white/5 rounded w-1/3" />
              </div>
              <div className="w-20 h-6 bg-gray-200 dark:bg-white/5 rounded-full" />
              <div className="w-24 h-6 bg-gray-200 dark:bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[100px] bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse" />
  );
}
