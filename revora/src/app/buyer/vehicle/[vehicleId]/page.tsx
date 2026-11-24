'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Scale,
  ShieldCheck,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Cog,
  Building2,
  User as UserIcon,
  MessageSquare,
  CalendarCheck,
  Check,
} from 'lucide-react';
import { getVehicleById } from '@/lib/buyer/vehicleService';
import { Vehicle } from '@/types';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { isVehicleFavourited, addVehicleToFavourites, removeVehicleFromFavourites } from '@/lib/buyer/favouriteService';
import { addVehicleToComparison } from '@/lib/buyer/comparisonService';
import { trackVehicleView } from '@/lib/buyer/recentlyViewedService';
import { useToast } from '@/components/common/Toast';

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const vehicleId = params.vehicleId as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (vehicleId) {
      setLoading(true);
      getVehicleById(vehicleId).then((v) => {
        setVehicle(v);
        setLoading(false);
        if (v && user?.uid) {
          trackVehicleView(user.uid, v);
          isVehicleFavourited(user.uid, v.id).then(setIsFav);
        }
      });
    }
  }, [vehicleId, user]);

  const handleToggleFav = async () => {
    if (!user || !vehicle) {
      showToast('Login Required', 'Please sign in to save favourites.', 'warning');
      return;
    }
    if (isFav) {
      await removeVehicleFromFavourites(user.uid, vehicle.id);
      setIsFav(false);
      showToast('Removed from Favourites', '', 'info');
    } else {
      await addVehicleToFavourites(user.uid, vehicle);
      setIsFav(true);
      showToast('Saved to Favourites', '', 'success');
    }
  };

  const handleCompare = async () => {
    if (!user || !vehicle) return;
    const res = await addVehicleToComparison(user.uid, vehicle);
    if (res.success) {
      showToast('Added to Comparison', '', 'success');
      router.push('/buyer/compare');
    } else {
      showToast('Limit Reached', res.message || 'Max 4 vehicles.', 'warning');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#60ADD9] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Vehicle Not Found</h2>
        <p className="text-xs text-gray-400">The requested car listing is not available or has been removed.</p>
        <Link href="/buyer/explore">
          <Button variant="primary" size="md">Back to Explore Cars</Button>
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous page</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Columns: Image & Overview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl">
            <img
              src={vehicle.image || '/images/cars/camry.jpg'}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            {vehicle.isVerified && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#60ADD9] text-[#070B0D] shadow-lg">
                  <ShieldCheck className="w-4 h-4" />
                  REVORA 200-Pt Certified
                </span>
              </div>
            )}
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-4 gap-3 p-5 rounded-2xl bg-[#0E151A]/80 border border-white/10 text-center">
            <div>
              <Calendar className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Year</span>
              <span className="text-xs font-bold text-white">{vehicle.year}</span>
            </div>
            <div>
              <Gauge className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Driven</span>
              <span className="text-xs font-bold text-white">{vehicle.mileage.toLocaleString('en-IN')} km</span>
            </div>
            <div>
              <Fuel className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Fuel</span>
              <span className="text-xs font-bold text-white">{vehicle.fuelType}</span>
            </div>
            <div>
              <Cog className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Transmission</span>
              <span className="text-xs font-bold text-white">{vehicle.transmission}</span>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Vehicle Info & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0E151A]/90 border border-white/10 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#60ADD9]">
                  {vehicle.sellerType}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-500" />
                  {vehicle.city}, {vehicle.state}
                </span>
              </div>

              <h1 className="font-heading text-2xl font-extrabold text-white mt-2">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-sm text-gray-400">{vehicle.variant}</p>
            </div>

            {/* Price */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Certified Asking Price
              </span>
              <span className="font-heading text-3xl font-black text-white mt-1 block">
                {formattedPrice}
              </span>
            </div>

            {/* Seller info */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#60ADD9]/10 text-[#60ADD9] flex items-center justify-center">
                {vehicle.sellerType === 'Verified Dealership' ? <Building2 className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">{vehicle.sellerName || 'Verified Seller'}</p>
                <p className="text-gray-400 text-[11px]">{vehicle.sellerType}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => router.push(`/buyer/test-drives?vehicleId=${vehicle.id}`)}
                className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-[#60ADD9]/20"
                rightIcon={<CalendarCheck className="w-4 h-4" />}
              >
                Request Doorstep Test Drive
              </Button>

              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => router.push(`/buyer/enquiries?vehicleId=${vehicle.id}`)}
                className="border-white/20 text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider py-3"
                leftIcon={<MessageSquare className="w-4 h-4 text-[#60ADD9]" />}
              >
                Send Seller Enquiry
              </Button>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleToggleFav}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    isFav
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-rose-400' : ''}`} />
                  <span>{isFav ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompare}
                  className="py-2.5 px-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
