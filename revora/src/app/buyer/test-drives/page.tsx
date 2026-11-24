'use client';

import React from 'react';
import { CalendarCheck } from 'lucide-react';
import { EmptyState } from '@/components/buyer/EmptyState';

export default function BuyerTestDrivesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <h1 className="font-heading text-2xl font-bold text-white">Test Drive Bookings</h1>
        <p className="text-xs text-gray-400 mt-1">Doorstep test drives and verified dealership appointments.</p>
      </div>
      <EmptyState
        icon={<CalendarCheck className="w-8 h-8 text-amber-400" />}
        title="No Test Drives Scheduled"
        description="Select any verified car from the catalogue to schedule a convenient doorstep or showroom test drive."
        actionText="Browse Vehicles"
        actionHref="/buyer/explore"
      />
    </div>
  );
}
