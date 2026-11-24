'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Scale,
  Gauge,
  Fuel,
  Cog,
  MapPin,
  ShieldCheck,
  Building2,
  User as UserIcon,
  Check,
} from 'lucide-react';
import { Vehicle } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import {
  isVehicleFavourited,
  addVehicleToFavourites,
  removeVehicleFromFavourites,
} from '@/lib/buyer/favouriteService';
import {
  addVehicleToComparison,
  removeVehicleFromComparison,
  getBuyerComparisons,
} from '@/lib/buyer/comparisonService';
import { useToast } from '@/components/common/Toast';

interface BuyerVehicleCardProps {
  vehicle: Vehicle;
  onFavouriteChange?: (isFav: boolean) => void;
  onCompareChange?: (isCompared: boolean) => void;
}

export const BuyerVehicleCard: React.FC<BuyerVehicleCardProps> = ({
  vehicle,
  onFavouriteChange,
  onCompareChange,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isFav, setIsFav] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);

  // Check favourite & comparison status on mount
  useEffect(() => {
    if (user?.uid) {
      isVehicleFavourited(user.uid, vehicle.id).then(setIsFav);
      getBuyerComparisons(user.uid).then((items) => {
        setIsCompared(items.some((i) => i.vehicleId === vehicle.id));
      });
    }
  }, [user, vehicle.id]);

  // Toggle Favourite
  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Authentication Required', 'Please sign in to save vehicles to your favourites.', 'warning');
      return;
    }

    setFavLoading(true);
    try {
      if (isFav) {
        await removeVehicleFromFavourites(user.uid, vehicle.id);
        setIsFav(false);
        onFavouriteChange?.(false);
        showToast('Removed from Favourites', `${vehicle.make} ${vehicle.model} removed.`, 'info');
      } else {
        await addVehicleToFavourites(user.uid, vehicle);
        setIsFav(true);
        onFavouriteChange?.(true);
        showToast('Saved to Favourites', `${vehicle.make} ${vehicle.model} saved to your favourites.`, 'success');
      }
    } catch (err) {
      console.error('Favourite error:', err);
    } finally {
      setFavLoading(false);
    }
  };

  // Toggle Compare
  const handleToggleCompare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Authentication Required', 'Please sign in to compare vehicles.', 'warning');
      return;
    }

    setCompareLoading(true);
    try {
      if (isCompared) {
        await removeVehicleFromComparison(user.uid, vehicle.id);
        setIsCompared(false);
        onCompareChange?.(false);
        showToast('Removed from Comparison', `${vehicle.make} ${vehicle.model} removed.`, 'info');
      } else {
        const res = await addVehicleToComparison(user.uid, vehicle);
        if (res.success) {
          setIsCompared(true);
          onCompareChange?.(true);
          showToast('Added to Comparison', `${vehicle.make} ${vehicle.model} added (max 4).`, 'success');
        } else {
          showToast('Comparison Limit Reached', res.message || 'Cannot add more vehicles.', 'warning');
        }
      }
    } catch (err) {
      console.error('Compare error:', err);
    } finally {
      setCompareLoading(false);
    }
  };

  // Format Indian Rupee currency
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="group rounded-3xl bg-[#0E151A]/90 border border-white/10 hover:border-[#60ADD9]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-[#60ADD9]/5">
      
      {/* Top Image Section */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
        <Link href={`/buyer/vehicle/${vehicle.id}`} className="block w-full h-full">
          <img
            src={vehicle.image || '/images/cars/camry.jpg'}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E151A] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {vehicle.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#60ADD9] text-[#070B0D] shadow-md shadow-black/50">
                <ShieldCheck className="w-3 h-3" />
                200-Pt Certified
              </span>
            )}
            {vehicle.badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-gray-200 border border-white/10">
                {vehicle.badge}
              </span>
            )}
          </div>

          {/* Quick Actions (Favourite & Compare) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={handleToggleCompare}
              disabled={compareLoading}
              title={isCompared ? 'Remove from comparison' : 'Add to compare'}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                isCompared
                  ? 'bg-[#60ADD9] border-[#60ADD9] text-[#070B0D]'
                  : 'bg-black/50 border-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleToggleFavourite}
              disabled={favLoading}
              title={isFav ? 'Remove from favourites' : 'Save to favourites'}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                isFav
                  ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-black/50 border-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Year Pill bottom left of image */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-white border border-white/10">
            {vehicle.year}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col justify-between flex-1">
        
        {/* Title & Variant */}
        <div>
          <Link href={`/buyer/vehicle/${vehicle.id}`} className="group/title">
            <h3 className="font-heading text-lg font-bold text-white group-hover/title:text-[#60ADD9] transition-colors truncate">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {vehicle.variant}
            </p>
          </Link>

          {/* Specifications Pills */}
          <div className="grid grid-cols-3 gap-2 mt-4 py-3 border-y border-white/5 text-[11px] text-gray-300">
            <div className="flex items-center gap-1.5 truncate">
              <Gauge className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{vehicle.mileage.toLocaleString('en-IN')} km</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Fuel className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Cog className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
          </div>
        </div>

        {/* Location & Seller */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-1 truncate max-w-[50%]">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="truncate">{vehicle.city}, {vehicle.state.split(' ')[0]}</span>
          </div>

          <div className="flex items-center gap-1 truncate max-w-[48%]">
            {vehicle.sellerType === 'Verified Dealership' ? (
              <Building2 className="w-3 h-3 text-[#60ADD9] shrink-0" />
            ) : (
              <UserIcon className="w-3 h-3 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">{vehicle.sellerName || vehicle.sellerType}</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block leading-none">
              Expected Price
            </span>
            <span className="font-heading text-lg font-extrabold text-white leading-tight mt-1 inline-block">
              {formattedPrice}
            </span>
          </div>

          <Link
            href={`/buyer/vehicle/${vehicle.id}`}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#60ADD9] hover:text-[#070B0D] border border-white/10 hover:border-[#60ADD9] text-xs font-bold uppercase tracking-wider text-white transition-all shadow-sm"
          >
            View Details
          </Link>
        </div>

      </div>

    </div>
  );
};
