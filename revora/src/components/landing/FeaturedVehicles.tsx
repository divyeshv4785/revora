'use client';

import React from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { FEATURED_VEHICLES } from '@/data/mockData';
import { Vehicle } from '@/types';

interface FeaturedVehiclesProps {
  onViewDetails: (vehicle: Vehicle) => void;
  onRequireAuth: (action: string) => void;
  onViewAllCars: () => void;
}

export const FeaturedVehicles: React.FC<FeaturedVehiclesProps> = ({
  onViewDetails,
  onRequireAuth,
  onViewAllCars,
}) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with View All action on Desktop */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            eyebrow="Curated Portfolio"
            title="Handpicked Cars for Your Next Journey"
            description="Exemplary vehicles from certified individual owners and verified dealership partners across major Indian cities."
            align="left"
          />

          <div className="shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={onViewAllCars}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="text-revora-steel border-revora-steel/30 hover:border-revora-steel"
            >
              Browse Complete Inventory
            </Button>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURED_VEHICLES.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onViewDetails={onViewDetails}
              onRequireAuth={onRequireAuth}
            />
          ))}
        </div>

        {/* Disclaimer Note */}
        <div className="mt-12 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start sm:items-center gap-3 text-xs text-revora-textSecondary">
          <Info className="w-4 h-4 text-revora-muted shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong className="font-semibold text-revora-textPrimary">Illustrative Showcase:</strong> Vehicle specifications, pricing, and locations shown here are illustrative sample records representing platform capabilities. Sample listings do not represent verified inventory.
          </p>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onViewAllCars}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Complete Inventory
          </Button>
        </div>

      </div>
    </section>
  );
};
