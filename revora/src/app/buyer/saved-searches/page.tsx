'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';
import { EmptyState } from '@/components/buyer/EmptyState';

export default function BuyerSavedSearchesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <h1 className="font-heading text-2xl font-bold text-white">Saved Searches & Alerts</h1>
        <p className="text-xs text-gray-400 mt-1">Get real-time notification alerts when new vehicles match your saved search criteria.</p>
      </div>
      <EmptyState
        icon={<Bookmark className="w-8 h-8 text-[#60ADD9]" />}
        title="No Saved Searches"
        description="Save your favorite search filters from the Explore page to receive automatic price drop and arrival notifications."
        actionText="Search Cars"
        actionHref="/buyer/explore"
      />
    </div>
  );
}
