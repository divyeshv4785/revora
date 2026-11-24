'use client';

import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { RECENT_VEHICLES } from '@/data/mockData';
import { Vehicle } from '@/types';

interface RecentVehiclesProps {
  onViewDetails: (vehicle: Vehicle) => void;
  onRequireAuth: (action: string) => void;
  onViewAllRecent: () => void;
}

export const RecentVehicles: React.FC<RecentVehiclesProps> = ({
  onViewDetails,
  onRequireAuth,
  onViewAllRecent,
}) => {
  return (
    <section className="py-20 bg-revora-mainBg border-t border-b border-revora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            eyebrow="Marketplace Velocity"
            title="Fresh Arrivals"
            description="The latest certified cars listed across our network within the past 48 hours. Stay ahead of market opportunities with real-time updates."
            align="left"
          />

          <div className="shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={onViewAllRecent}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="text-revora-steel border-revora-steel/30 hover:border-revora-steel"
            >
              Browse Latest Additions
            </Button>
          </div>
        </div>

        {/* 4-column Grid on desktop for fresh arrivals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RECENT_VEHICLES.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onViewDetails={onViewDetails}
              onRequireAuth={onRequireAuth}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
