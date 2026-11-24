'use client';

import React, { Suspense } from 'react';
import { Compass } from 'lucide-react';
import { EmptyState } from '@/components/buyer/EmptyState';

export default function BuyerExplorePage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <h1 className="font-heading text-2xl font-bold text-white">Explore Certified Cars</h1>
        <p className="text-xs text-gray-400 mt-1">Multi-brand pre-owned vehicles verified under REVORA 200-point inspection.</p>
      </div>
      <EmptyState
        icon={<Compass className="w-8 h-8" />}
        title="Explore Cars Catalog"
        description="Comprehensive search and multi-facet filtering is being finalized in Phase 2."
        actionText="Return to Overview"
        actionHref="/buyer/dashboard"
      />
    </div>
  );
}
