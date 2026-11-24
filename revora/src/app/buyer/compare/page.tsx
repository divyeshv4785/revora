'use client';

import React from 'react';
import { Scale } from 'lucide-react';
import { EmptyState } from '@/components/buyer/EmptyState';

export default function BuyerComparePage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <h1 className="font-heading text-2xl font-bold text-white">Compare Vehicles</h1>
        <p className="text-xs text-gray-400 mt-1">Side-by-side comparison of technical specifications, pricing, and inspection findings.</p>
      </div>
      <EmptyState
        icon={<Scale className="w-8 h-8" />}
        title="No Vehicles in Comparison"
        description="Select up to 4 vehicles from the Explore Cars catalogue to compare specifications side-by-side."
        actionText="Explore Cars"
        actionHref="/buyer/explore"
      />
    </div>
  );
}
