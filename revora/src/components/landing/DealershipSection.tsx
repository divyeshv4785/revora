'use client';

import React from 'react';
import Image from 'next/image';
import {
  Building2,
  ShieldCheck,
  Star,
  MapPin,
  Car,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';
import { DEALERSHIPS } from '@/data/mockData';
import { Dealership } from '@/types';

interface DealershipSectionProps {
  onViewDealerInventory: (dealer: Dealership) => void;
  onRegisterDealership: () => void;
}

export const DealershipSection: React.FC<DealershipSectionProps> = ({
  onViewDealerInventory,
  onRegisterDealership,
}) => {
  return (
    <section id="dealerships" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            eyebrow="Certified Multi-Branch Network"
            title="Discover Trusted Dealerships"
            description="Connect with audited automotive dealerships across India offering pre-vetted inventories, formal inspection reports, and structured warranties."
            align="left"
          />

          <div className="shrink-0">
            <Button
              variant="accent"
              size="md"
              onClick={onRegisterDealership}
              rightIcon={<Building2 className="w-4 h-4" />}
            >
              Register Your Dealership
            </Button>
          </div>
        </div>

        {/* Dealership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DEALERSHIPS.map((dealer) => (
            <div
              key={dealer.id}
              className="group rounded-3xl bg-white border border-revora-border shadow-card hover:shadow-cardHover transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Dealership Showroom Image */}
              <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                <Image
                  src={dealer.image}
                  alt={dealer.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Rating Badge */}
                <div className="absolute top-3.5 right-3.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-revora-textPrimary shadow-sm backdrop-blur-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{dealer.rating}</span>
                    <span className="text-[10px] text-gray-400 font-normal">({dealer.reviewsCount})</span>
                  </span>
                </div>

                {/* Verification Badge */}
                {dealer.isVerified && (
                  <div className="absolute bottom-3 left-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 text-white backdrop-blur-md">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Audited Dealership
                    </span>
                  </div>
                )}
              </div>

              {/* Dealership Details */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-heading text-xl font-bold text-revora-textPrimary group-hover:text-revora-steel transition-colors">
                    {dealer.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-revora-textSecondary mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-revora-steel shrink-0" />
                    <span className="truncate">{dealer.location}</span>
                  </div>

                  <p className="text-xs text-revora-textSecondary mt-3 leading-relaxed">
                    {dealer.tagline}
                  </p>

                  {/* Brand specializations */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {dealer.brands.map((brand) => (
                      <span
                        key={brand}
                        className="px-2 py-0.5 rounded-lg bg-gray-50 text-[11px] font-medium text-revora-textSecondary border border-gray-100"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-revora-textPrimary font-semibold">
                    <Car className="w-4 h-4 text-revora-steel" />
                    <span>{dealer.vehicleCount} Vehicles Available</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onViewDealerInventory(dealer)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-revora-steel hover:text-[#3D5870] group-hover:underline"
                  >
                    <span>View Inventory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
