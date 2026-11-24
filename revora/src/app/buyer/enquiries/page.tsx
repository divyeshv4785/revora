'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { EmptyState } from '@/components/buyer/EmptyState';

export default function BuyerEnquiriesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <h1 className="font-heading text-2xl font-bold text-white">My Enquiries</h1>
        <p className="text-xs text-gray-400 mt-1">Direct inquiries, seller responses, and offer negotiations.</p>
      </div>
      <EmptyState
        icon={<MessageSquare className="w-8 h-8 text-[#60ADD9]" />}
        title="No Active Enquiries"
        description="When you enquire about a vehicle, communication history and seller responses will appear here."
        actionText="Browse Vehicles"
        actionHref="/buyer/explore"
      />
    </div>
  );
}
