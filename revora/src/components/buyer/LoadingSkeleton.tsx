'use client';

import React from 'react';

export const VehicleCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-[#0E151A]/80 border border-white/5 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-white/5" />

      {/* Body Skeleton */}
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded-md w-3/4" />
          <div className="h-3 bg-white/5 rounded-md w-1/2" />
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5">
          <div className="h-6 bg-white/5 rounded-lg" />
          <div className="h-6 bg-white/5 rounded-lg" />
          <div className="h-6 bg-white/5 rounded-lg" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-white/10 rounded-md w-1/3" />
          <div className="h-8 bg-white/5 rounded-xl w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5 rounded-2xl bg-[#0E151A]/80 border border-white/5 h-28">
          <div className="w-8 h-8 rounded-xl bg-white/5 mb-3" />
          <div className="h-5 bg-white/10 rounded w-1/2 mb-1.5" />
          <div className="h-3 bg-white/5 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
};
