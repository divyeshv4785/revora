'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Heart,
  MessageSquare,
  CalendarCheck,
  Clock,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building2,
  Compass,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { BuyerVehicleCard } from '@/components/buyer/VehicleCard';
import { EmptyState } from '@/components/buyer/EmptyState';
import { VehicleCardSkeleton, DashboardStatsSkeleton } from '@/components/buyer/LoadingSkeleton';
import { Vehicle, Dealership } from '@/types';
import {
  getRecommendedVehicles,
  getRecentlyAddedVehicles,
  getPopularNearLocation,
  getApprovedDealerships,
} from '@/lib/buyer/vehicleService';
import { getBuyerProfile } from '@/lib/buyer/buyerService';
import { getBuyerFavourites } from '@/lib/buyer/favouriteService';
import { getBuyerEnquiries } from '@/lib/buyer/enquiryService';
import { getBuyerTestDrives } from '@/lib/buyer/testDriveService';
import { getRecentlyViewedVehicles } from '@/lib/buyer/recentlyViewedService';
import { BuyerProfile, RecentlyViewedItem } from '@/types/buyer';

function BuyerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | null>(null);

  // Stats Counts
  const [stats, setStats] = useState({
    savedCars: 0,
    activeEnquiries: 0,
    upcomingTestDrives: 0,
    recentlyViewed: 0,
  });

  // Content Sections Data
  const [recommendedCars, setRecommendedCars] = useState<Vehicle[]>([]);
  const [recentlyAddedCars, setRecentlyAddedCars] = useState<Vehicle[]>([]);
  const [popularNearYou, setPopularNearYou] = useState<Vehicle[]>([]);
  const [featuredDealerships, setFeaturedDealerships] = useState<Dealership[]>([]);
  const [recentlyViewedList, setRecentlyViewedList] = useState<RecentlyViewedItem[]>([]);

  // Search input state
  const [quickSearch, setQuickSearch] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.uid && !isPreview) return;
      setLoading(true);

      try {
        if (isPreview && !user?.uid) {
          // Preview fallback data
          setStats({
            savedCars: 4,
            activeEnquiries: 2,
            upcomingTestDrives: 1,
            recentlyViewed: 3,
          });

          const [recommended, recentCars, popular, dealers] = await Promise.all([
            getRecommendedVehicles(null),
            getRecentlyAddedVehicles(),
            getPopularNearLocation('Coimbatore', 'Tamil Nadu'),
            getApprovedDealerships(),
          ]);

          setRecommendedCars(recommended);
          setRecentlyAddedCars(recentCars);
          setPopularNearYou(popular);
          setFeaturedDealerships(dealers);
          setLoading(false);
          return;
        }

        if (!user) return;

        // 1. Load Buyer Profile
        const bp = await getBuyerProfile(user.uid);
        setBuyerProfile(bp);

        // 2. Load Stats
        const [favs, enquiries, testDrives, recentViews] = await Promise.all([
          getBuyerFavourites(user.uid),
          getBuyerEnquiries(user.uid),
          getBuyerTestDrives(user.uid),
          getRecentlyViewedVehicles(user.uid),
        ]);

        const activeEnqCount = enquiries.filter((e) => e.status !== 'closed' && e.status !== 'unsuccessful').length;
        const upcomingTdCount = testDrives.filter((td) => td.status === 'requested' || td.status === 'confirmed').length;

        setStats({
          savedCars: favs.length,
          activeEnquiries: activeEnqCount,
          upcomingTestDrives: upcomingTdCount,
          recentlyViewed: recentViews.length,
        });
        setRecentlyViewedList(recentViews.slice(0, 4));

        // 3. Load Vehicles Sections
        const [recommended, recentCars, popular, dealers] = await Promise.all([
          getRecommendedVehicles(bp),
          getRecentlyAddedVehicles(),
          getPopularNearLocation(bp?.city || profile?.city, bp?.state || profile?.state),
          getApprovedDealerships(),
        ]);

        setRecommendedCars(recommended);
        setRecentlyAddedCars(recentCars);
        setPopularNearYou(popular);
        setFeaturedDealerships(dealers);
      } catch (err) {
        console.error('Error loading buyer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user, profile]);

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      router.push(`/buyer/explore?keyword=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      router.push('/buyer/explore');
    }
  };

  const displayName = profile?.fullName || buyerProfile?.fullName || user?.email?.split('@')[0] || 'Buyer';
  const displayCity = buyerProfile?.city || profile?.city || 'India';

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      
      {/* 1. TOP HERO SECTION */}
      <div className="relative rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-[#0E151A] via-[#0E151A]/90 to-[#142028] border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Subtle Ambient Glow */}
        <div
          className="absolute -right-20 -top-20 w-96 h-96 rounded-full pointer-events-none blur-[120px] opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(96, 173, 217, 0.5) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#60ADD9]">
            <Sparkles className="w-3.5 h-3.5" />
            BUYER PORTAL • 200-POINT CERTIFIED MARKETPLACE
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-[#60ADD9]">{displayName}</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
            Discover verified used vehicles across India. Book doorstep test drives, review comprehensive 200-point inspection findings, and connect directly with certified sellers.
          </p>

          {/* Quick Search Input */}
          <form onSubmit={handleQuickSearchSubmit} className="pt-2 flex items-center gap-3 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search make, model, variant, or city..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#070B0D]/80 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9] transition-all"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#60ADD9]/20"
            >
              Search
            </button>
          </form>

          {/* Location Badge */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
            <MapPin className="w-3.5 h-3.5 text-[#60ADD9]" />
            <span>Showing verified inventory near: <strong className="text-white">{displayCity}</strong></span>
          </div>
        </div>

      </div>

      {/* 2. SUMMARY METRICS CARDS */}
      {loading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Saved Cars */}
          <Link
            href="/buyer/favourites"
            className="p-5 rounded-2xl bg-[#0E151A]/80 hover:bg-white/[0.06] border border-white/10 hover:border-[#60ADD9]/40 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <Heart className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="font-heading text-2xl font-black text-white">{stats.savedCars}</span>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Saved Cars</p>
            </div>
          </Link>

          {/* Card 2: Active Enquiries */}
          <Link
            href="/buyer/enquiries"
            className="p-5 rounded-2xl bg-[#0E151A]/80 hover:bg-white/[0.06] border border-white/10 hover:border-[#60ADD9]/40 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#60ADD9]/10 text-[#60ADD9] flex items-center justify-center border border-[#60ADD9]/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="font-heading text-2xl font-black text-white">{stats.activeEnquiries}</span>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Active Enquiries</p>
            </div>
          </Link>

          {/* Card 3: Upcoming Test Drives */}
          <Link
            href="/buyer/test-drives"
            className="p-5 rounded-2xl bg-[#0E151A]/80 hover:bg-white/[0.06] border border-white/10 hover:border-[#60ADD9]/40 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="font-heading text-2xl font-black text-white">{stats.upcomingTestDrives}</span>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Upcoming Test Drives</p>
            </div>
          </Link>

          {/* Card 4: Recently Viewed */}
          <Link
            href="/buyer/recently-viewed"
            className="p-5 rounded-2xl bg-[#0E151A]/80 hover:bg-white/[0.06] border border-white/10 hover:border-[#60ADD9]/40 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="font-heading text-2xl font-black text-white">{stats.recentlyViewed}</span>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Recently Viewed</p>
            </div>
          </Link>

        </div>
      )}

      {/* 3. SECTION A: RECOMMENDED CARS */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#60ADD9]" />
              <h2 className="font-heading text-xl font-bold text-white">
                Recommended For You
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Curated based on your location ({displayCity}), preferred brands, and budget preferences.
            </p>
          </div>

          <Link
            href="/buyer/explore"
            className="text-xs font-bold uppercase tracking-wider text-[#60ADD9] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : recommendedCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendedCars.map((v) => (
              <BuyerVehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Compass className="w-8 h-8" />}
            title="No Recommended Cars Found"
            description="Adjust your preferences or explore our complete certified catalogue across India."
            actionText="Explore All Cars"
            actionHref="/buyer/explore"
          />
        )}
      </section>

      {/* 4. SECTION B: RECENTLY ADDED CARS */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-white">
              Recently Added Vehicles
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Freshly listed and certified pre-owned arrivals on the REVORA platform.
            </p>
          </div>

          <Link
            href="/buyer/explore?sort=recent"
            className="text-xs font-bold uppercase tracking-wider text-[#60ADD9] hover:underline flex items-center gap-1"
          >
            <span>View Recent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : recentlyAddedCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentlyAddedCars.map((v) => (
              <BuyerVehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Clock className="w-8 h-8" />}
            title="No Recent Arrivals"
            description="Check back shortly as new certified pre-owned vehicles are added daily."
            actionText="Explore Marketplace"
            actionHref="/buyer/explore"
          />
        )}
      </section>

      {/* 5. SECTION C: POPULAR NEAR YOU */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-white">
              Popular in {displayCity}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Top-evaluated certified vehicles available for prompt doorstep inspection and test drives.
            </p>
          </div>

          <Link
            href={`/buyer/explore?location=${encodeURIComponent(displayCity)}`}
            className="text-xs font-bold uppercase tracking-wider text-[#60ADD9] hover:underline flex items-center gap-1"
          >
            <span>View City Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : popularNearYou.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularNearYou.map((v) => (
              <BuyerVehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<MapPin className="w-8 h-8" />}
            title={`No Vehicles Found in ${displayCity}`}
            description="Broaden your search to state-wide or national certified inventory."
            actionText="Explore National Inventory"
            actionHref="/buyer/explore"
          />
        )}
      </section>

      {/* 6. SECTION D: FEATURED APPROVED DEALERSHIPS */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#60ADD9]" />
              <h2 className="font-heading text-xl font-bold text-white">
                Featured Certified Dealerships
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              REVORA-verified automotive partners with physical multi-branch showrooms and verified warranties.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredDealerships.slice(0, 3).map((dealership) => (
            <div
              key={dealership.id}
              className="p-5 rounded-3xl bg-[#0E151A]/80 border border-white/10 hover:border-[#60ADD9]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#60ADD9]" />
                  </div>
                  {dealership.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Dealer
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-base font-bold text-white">
                  {dealership.name}
                </h3>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  <span>{dealership.location}</span>
                </p>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  {dealership.tagline}
                </p>

                {/* Brands pills */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {dealership.brands?.slice(0, 3).map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 text-gray-300 font-semibold border border-white/5"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  <strong className="text-white font-bold">{dealership.vehicleCount}</strong> Cars in Stock
                </span>
                <Link
                  href={`/buyer/explore?dealer=${encodeURIComponent(dealership.name)}`}
                  className="font-bold text-[#60ADD9] hover:underline"
                >
                  View Inventory →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SECTION E: RECENTLY VIEWED CARS */}
      {recentlyViewedList.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <h2 className="font-heading text-xl font-bold text-white">
                  Recently Viewed by You
                </h2>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Vehicles you have previously inspected on the REVORA marketplace.
              </p>
            </div>

            <Link
              href="/buyer/recently-viewed"
              className="text-xs font-bold uppercase tracking-wider text-[#60ADD9] hover:underline flex items-center gap-1"
            >
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentlyViewedList.map((item) => (
              <BuyerVehicleCard key={item.vehicleId} vehicle={item.vehicle} />
            ))}
          </div>
        </section>
      )}

      {/* 8. SECTION F: CONTINUE YOUR SEARCH (QUICK FILTERS) */}
      <section className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gray-400">
          Continue Your Search (Popular Quick Filters)
        </h3>

        <div className="flex flex-wrap gap-2.5">
          {[
            { label: 'Automatic Sedans under ₹15L', href: '/buyer/explore?body=Sedan&trans=Automatic&maxPrice=1500000' },
            { label: 'Certified Hybrid Cars', href: '/buyer/explore?fuel=Hybrid' },
            { label: 'SUVs under ₹25L', href: '/buyer/explore?body=SUV&maxPrice=2500000' },
            { label: 'Single Owner Verified Cars', href: '/buyer/explore?owners=1' },
            { label: 'Electric Vehicles (EVs)', href: '/buyer/explore?fuel=Electric' },
            { label: 'Luxury Sedans in Mumbai', href: '/buyer/explore?body=Sedan&location=Mumbai' },
          ].map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}

export default function BuyerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-[#60ADD9] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Loading Buyer Dashboard...
            </p>
          </div>
        </div>
      }
    >
      <BuyerDashboardContent />
    </Suspense>
  );
}
