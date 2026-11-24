'use client';

import React from 'react';
import { FileCheck2 } from 'lucide-react';
import { EmptyState } from '@/components/buyer/EmptyState';

export default function BuyerInspectionsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <h1 className="font-heading text-2xl font-bold text-white">Inspections & Reports</h1>
        <p className="text-xs text-gray-400 mt-1">Download official REVORA 200-point inspection certificates and mechanical health audits.</p>
      </div>
      <EmptyState
        icon={<FileCheck2 className="w-8 h-8 text-emerald-400" />}
        title="No Inspection Reports"
        description="Completed vehicle inspection certificates for your shortlisted and booked cars will be available for download here."
        actionText="Explore 200-Pt Certified Cars"
        actionHref="/buyer/explore"
      />
    </div>
  );
}
