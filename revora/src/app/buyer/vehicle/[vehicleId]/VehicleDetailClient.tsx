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

export default function VehicleDetailClient() {
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
    try {
      if (isFav) {
        await removeVehicleFromFavourites(user.uid, vehicle.id);
        setIsFav(false);
        showToast('Removed', 'Vehicle removed from favourites.', 'info');
      } else {
        await addVehicleToFavourites(user.uid, vehicle);
        setIsFav(true);
        showToast('Saved', 'Vehicle saved to your favourites!', 'success');
      }
    } catch {
      showToast('Error', 'Could not update favourites. Try again.', 'warning');
    }
  };

  const handleCompare = async () => {
    if (!vehicle) return;
    if (!user) {
      showToast('Login Required', 'Please sign in to compare vehicles.', 'warning');
      return;
    }
    await addVehicleToComparison(user.uid, vehicle);
    showToast('Comparison', `${vehicle.make} ${vehicle.model} added to comparison.`, 'info');
    router.push('/buyer/compare');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#4C6D8B] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-[#585E64]">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-[#111214] mb-2">Vehicle Not Found</h2>
        <p className="text-sm text-[#585E64] mb-6">The listing you are looking for is no longer available.</p>
        <Link href="/buyer/explore">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-[#585E64] hover:text-[#111214] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCompare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111214] hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Scale className="w-3.5 h-3.5" />
              Compare
            </button>
            <button
              onClick={handleToggleFav}
              className={`p-2 rounded-lg border border-[#E5E7EB] transition-colors shadow-sm ${
                isFav ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-[#585E64] hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Visuals & Specifications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Stage */}
            <div className="relative aspect-[16/10] bg-gray-900 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={vehicle.featuredImage || '/images/cars/camry-hero.png'}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
              {vehicle.isInspected && (
                <div className="absolute top-4 left-4 bg-emerald-600/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                  150-Point Certified Inspected
                </div>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
              <h3 className="text-base font-bold text-[#111214] mb-4">Specifications Snapshot</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-[#FAFAFA] rounded-xl flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#4C6D8B]" />
                  <div>
                    <span className="text-xs text-[#585E64] block">Model Year</span>
                    <span className="text-sm font-bold text-[#111214]">{vehicle.year}</span>
                  </div>
                </div>
                <div className="p-3 bg-[#FAFAFA] rounded-xl flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-[#4C6D8B]" />
                  <div>
                    <span className="text-xs text-[#585E64] block">Mileage</span>
                    <span className="text-sm font-bold text-[#111214]">{vehicle.mileageKm.toLocaleString()} km</span>
                  </div>
                </div>
                <div className="p-3 bg-[#FAFAFA] rounded-xl flex items-center gap-3">
                  <Fuel className="w-5 h-5 text-[#4C6D8B]" />
                  <div>
                    <span className="text-xs text-[#585E64] block">Fuel Type</span>
                    <span className="text-sm font-bold text-[#111214]">{vehicle.fuelType}</span>
                  </div>
                </div>
                <div className="p-3 bg-[#FAFAFA] rounded-xl flex items-center gap-3">
                  <Cog className="w-5 h-5 text-[#4C6D8B]" />
                  <div>
                    <span className="text-xs text-[#585E64] block">Transmission</span>
                    <span className="text-sm font-bold text-[#111214]">{vehicle.transmission}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
                <h3 className="text-base font-bold text-[#111214] mb-4">Key Features & Inclusions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-[#111214]">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Seller Overview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-5">
              <div>
                <span className="text-xs font-semibold text-[#4C6D8B] uppercase tracking-wider block mb-1">
                  {vehicle.bodyType}
                </span>
                <h1 className="text-2xl font-black text-[#111214] tracking-tight">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-sm text-[#585E64]">{vehicle.variant}</p>
              </div>

              <div className="flex items-baseline gap-2 pt-2 border-t border-[#E5E7EB]">
                <span className="text-3xl font-black text-[#111214]">
                  ₹{vehicle.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#585E64] font-medium">Estimated on-road price</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#585E64]">
                <MapPin className="w-3.5 h-3.5 text-[#4C6D8B]" />
                {vehicle.city}, {vehicle.state}
              </div>

              {/* CTAs */}
              <div className="space-y-2.5 pt-4">
                <Link href={`/buyer/test-drives?vehicleId=${vehicle.id}`} className="block">
                  <Button variant="primary" className="w-full justify-center py-3">
                    <CalendarCheck className="w-4 h-4 mr-2" />
                    Book Test Drive
                  </Button>
                </Link>
                <Link href={`/buyer/enquiries?vehicleId=${vehicle.id}`} className="block">
                  <Button variant="outline" className="w-full justify-center py-3">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enquire with Seller
                  </Button>
                </Link>
              </div>
            </div>

            {/* Seller Dossier Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm">
              <h4 className="text-xs font-bold text-[#585E64] uppercase tracking-wider mb-3">
                Seller Information
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4C6D8B]/10 text-[#4C6D8B] flex items-center justify-center font-bold">
                  {vehicle.sellerType === 'dealer' ? <Building2 className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-[#111214] block">
                    {vehicle.sellerType === 'dealer' ? vehicle.dealershipName || 'Certified Partner' : 'Individual Seller'}
                  </span>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> REVORA Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
