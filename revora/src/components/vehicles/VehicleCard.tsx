'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  ShieldCheck,
  Fuel,
  Settings2,
  Calendar,
  Gauge,
  MapPin,
  Building2,
  User,
  ArrowRight,
} from 'lucide-react';
import { Vehicle } from '@/types';
import { FORMAT_INR } from '@/data/mockData';

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (vehicle: Vehicle) => void;
  onRequireAuth: (action: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onViewDetails,
  onRequireAuth,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onRequireAuth(isFavorite ? 'Remove vehicle from saved shortlist' : 'Save vehicle to your personal shortlist');
  };

  const isDealership = vehicle.sellerType === 'Verified Dealership';

  return (
    <div
      onClick={() => onViewDetails(vehicle)}
      className="group relative rounded-3xl bg-white border border-revora-border shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Media & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={vehicle.image}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant}`}
          fill
          className="object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {vehicle.badge && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-revora-dark/80 text-white backdrop-blur-md border border-white/10 shadow-sm">
                {vehicle.badge}
              </span>
            )}
            {vehicle.isRecent && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-revora-sky text-revora-dark shadow-sm">
                Recently Added
              </span>
            )}
          </div>

          {/* Favourite button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label="Save to Favourites"
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center transition-all backdrop-blur-sm shadow-sm hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
            />
          </button>
        </div>

        {/* Verification Tag at Bottom Left of Image */}
        {vehicle.isVerified && (
          <div className="absolute bottom-3 left-3.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white backdrop-blur-md">
              <ShieldCheck className="w-3 h-3" />
              REVORA Verified Inspection
            </span>
          </div>
        )}
      </div>

      {/* Vehicle Info Content */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Location & Year */}
          <div className="flex items-center justify-between text-xs text-revora-textSecondary mb-1.5">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-revora-steel shrink-0" />
              <span className="truncate max-w-[170px]">{vehicle.location}</span>
            </span>
            <span className="font-semibold text-revora-textPrimary">
              {vehicle.year} Model
            </span>
          </div>

          {/* Vehicle Title & Variant */}
          <h3 className="font-heading text-lg font-bold text-revora-textPrimary leading-tight group-hover:text-revora-steel transition-colors">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-xs text-revora-textSecondary mt-0.5 font-medium line-clamp-1">
            {vehicle.variant}
          </p>

          {/* Specifications Pills */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 text-center text-xs">
            <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-center gap-1 text-[11px] text-revora-textSecondary">
                <Gauge className="w-3 h-3 text-revora-steel" />
                <span className="truncate">{vehicle.mileage.toLocaleString('en-IN')} km</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-center gap-1 text-[11px] text-revora-textSecondary">
                <Fuel className="w-3 h-3 text-revora-steel" />
                <span className="truncate">{vehicle.fuelType}</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-center gap-1 text-[11px] text-revora-textSecondary">
                <Settings2 className="w-3 h-3 text-revora-steel" />
                <span className="truncate">{vehicle.transmission}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Seller Section */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-revora-textSecondary">
              Asking Price
            </p>
            <p className="font-heading text-xl font-extrabold text-revora-textPrimary leading-tight">
              {FORMAT_INR(vehicle.price)}
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-[11px] font-semibold text-revora-textPrimary">
              {isDealership ? (
                <Building2 className="w-3 h-3 text-revora-steel" />
              ) : (
                <User className="w-3 h-3 text-revora-muted" />
              )}
              <span className="truncate max-w-[120px]">{vehicle.sellerName}</span>
            </div>
            <p className="text-[10px] text-revora-textSecondary">
              {vehicle.sellerType}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-4 pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(vehicle);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-revora-steel hover:text-white font-heading font-semibold text-xs text-revora-textPrimary transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>View Details & History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
