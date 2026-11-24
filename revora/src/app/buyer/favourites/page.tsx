'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { EmptyState } from '@/components/buyer/EmptyState';

export default function BuyerFavouritesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <h1 className="font-heading text-2xl font-bold text-white">My Favourites</h1>
        <p className="text-xs text-gray-400 mt-1">Vehicles you have bookmarked for price monitoring and inspection tracking.</p>
      </div>
      <EmptyState
        icon={<Heart className="w-8 h-8 text-rose-400" />}
        title="No Saved Cars Yet"
        description="Click the heart icon on any vehicle card to save it here for instant access."
        actionText="Explore Cars"
        actionHref="/buyer/explore"
      />
    </div>
  );
}
