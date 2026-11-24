'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { EmptyState } from '@/components/buyer/EmptyState';

export default function BuyerRecentlyViewedPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <h1 className="font-heading text-2xl font-bold text-white">Recently Viewed Vehicles</h1>
        <p className="text-xs text-gray-400 mt-1">History of vehicles you have inspected on the REVORA platform.</p>
      </div>
      <EmptyState
        icon={<Clock className="w-8 h-8 text-purple-400" />}
        title="No Viewing History"
        description="Vehicles you inspect will automatically be saved here so you can easily resume evaluation."
        actionText="Browse Vehicles"
        actionHref="/buyer/explore"
      />
    </div>
  );
}
