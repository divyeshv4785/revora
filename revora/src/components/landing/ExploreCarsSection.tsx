'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  Car,
  Filter,
} from 'lucide-react';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { Button } from '@/components/common/Button';
import { FEATURED_VEHICLES, RECENT_VEHICLES, CAR_BRANDS_AND_MODELS, INDIAN_LOCATIONS } from '@/data/mockData';
import { Vehicle } from '@/types';

interface ExploreCarsSectionProps {
  onViewDetails: (vehicle: Vehicle) => void;
  onRequireAuth: (action: string) => void;
  onViewAllCars: () => void;
  defaultLocation?: string;
}

export const ExploreCarsSection: React.FC<ExploreCarsSectionProps> = ({
  onViewDetails,
  onRequireAuth,
  onViewAllCars,
  defaultLocation = 'All India',
}) => {
  // Combine mock inventory
  const allInventory = useMemo(() => {
    const combined = [...FEATURED_VEHICLES, ...RECENT_VEHICLES];
    // Deduplicate by ID
    const seen = new Set<string>();
    return combined.filter((v) => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
  }, []);

  // Filter states
  const [keyword, setKeyword] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All India');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Sedan' | 'SUV' | 'Luxury' | 'Electric'>('All');
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Filter logic
  const filteredVehicles = useMemo(() => {
    return allInventory.filter((v) => {
      // Keyword
      if (keyword.trim()) {
        const kw = keyword.toLowerCase();
        const matches =
          v.make.toLowerCase().includes(kw) ||
          v.model.toLowerCase().includes(kw) ||
          v.variant.toLowerCase().includes(kw) ||
          v.location.toLowerCase().includes(kw);
        if (!matches) return false;
      }

      // Brand
      if (selectedBrand && v.make !== selectedBrand) {
        return false;
      }

      // Location
      if (selectedLocation && selectedLocation !== 'All India') {
        const queryCity = selectedLocation.split(',')[0].trim().toLowerCase();
        if (!v.location.toLowerCase().includes(queryCity)) {
          return false;
        }
      }

      // Tab filter
      if (activeTab !== 'All') {
        if (activeTab === 'Sedan' && v.bodyType !== 'Sedan') return false;
        if (activeTab === 'SUV' && v.bodyType !== 'SUV') return false;
        if (activeTab === 'Luxury' && !['BMW', 'Mercedes-Benz', 'Audi'].includes(v.make)) return false;
        if (activeTab === 'Electric' && v.fuelType !== 'Electric') return false;
      }

      // Budget filter
      if (selectedBudget) {
        const price = v.price;
        if (selectedBudget === 'under-15' && price > 1500000) return false;
        if (selectedBudget === '15-30' && (price < 1500000 || price > 3000000)) return false;
        if (selectedBudget === '30-50' && (price < 3000000 || price > 5000000)) return false;
        if (selectedBudget === 'above-50' && price < 5000000) return false;
      }

      // Verified
      if (onlyVerified && !v.isVerified) {
        return false;
      }

      return true;
    });
  }, [allInventory, keyword, selectedBrand, selectedLocation, selectedBudget, activeTab, onlyVerified]);

  const handleReset = () => {
    setKeyword('');
    setSelectedBrand('');
    setSelectedLocation('All India');
    setSelectedBudget('');
    setActiveTab('All');
    setOnlyVerified(false);
  };

  const brands = Object.keys(CAR_BRANDS_AND_MODELS);

  return (
    <section id="explore-cars" className="py-20 sm:py-24 bg-[#FAFAFA] border-b border-gray-200 scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* =========================================================================
            HEADER: Editorial Title & Value Proposition
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-revora-steel/10 text-revora-steel text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#60ADD9]" />
              VERIFIED MOTORING PORTFOLIO
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111214] tracking-tight">
              Explore Cars
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">
              Inspect handpicked used vehicles from trusted individual sellers and certified dealerships across India. Fully documented with comprehensive 200-point inspection reports.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={onViewAllCars}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="text-[#070B0D] font-bold border-gray-300 hover:border-black rounded-xl"
            >
              Browse Complete Inventory ({allInventory.length})
            </Button>
          </div>
        </div>

        {/* =========================================================================
            SEARCH & FILTER CONTROL BAR
            ========================================================================= */}
        <div className="bg-white rounded-3xl shadow-card border border-gray-200/80 p-5 sm:p-7 mb-10">
          
          {/* Quick Body Style Tabs */}
          <div className="flex items-center justify-between pb-5 border-b border-gray-100 flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-none">
              {(['All', 'Sedan', 'SUV', 'Luxury', 'Electric'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-[#070B0D] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-black'
                  }`}
                >
                  {tab === 'All' ? 'All Vehicles' : `${tab}s`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded border-gray-300 text-[#60ADD9] focus:ring-[#60ADD9] w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Only
                </span>
              </label>

              {(keyword || selectedBrand || selectedLocation !== 'All India' || selectedBudget || activeTab !== 'All' || onlyVerified) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Input Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
            
            {/* 1. Keyword search */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Keyword / Model
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Camry, Thar, City, Automatic..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#60ADD9]/40 focus:border-[#60ADD9]"
                />
              </div>
            </div>

            {/* 2. Brand selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Make / Manufacturer
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#60ADD9]/40 focus:border-[#60ADD9] cursor-pointer"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Budget range */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Budget (INR)
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#60ADD9]/40 focus:border-[#60ADD9] cursor-pointer"
              >
                <option value="">Any Budget</option>
                <option value="under-15">Under ₹15 Lakh</option>
                <option value="15-30">₹15 Lakh – ₹30 Lakh</option>
                <option value="30-50">₹30 Lakh – ₹50 Lakh</option>
                <option value="above-50">₹50 Lakh+</option>
              </select>
            </div>

            {/* 4. Location */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                City / Region
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#60ADD9]/40 focus:border-[#60ADD9] cursor-pointer"
              >
                {INDIAN_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Active Filter Counter */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing <strong className="text-black font-bold">{filteredVehicles.length}</strong> verified used vehicles
            </span>
            <span className="text-[11px] text-gray-400 hidden sm:inline">
              Prices in INR • Updated in real-time
            </span>
          </div>

        </div>

        {/* =========================================================================
            VEHICLE CARDS GRID
            ========================================================================= */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onViewDetails={onViewDetails}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-gray-900">No matching vehicles found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Try adjusting your search criteria, price range, or clearing current filters.
            </p>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset All Filters
            </Button>
          </div>
        )}

        {/* View All Cars Button at Bottom */}
        <div className="mt-14 text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onViewAllCars}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="bg-[#070B0D] hover:bg-[#162028] text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-10 py-4 rounded-xl shadow-lg"
          >
            Explore Complete Inventory ({allInventory.length} Cars)
          </Button>
        </div>

      </div>
    </section>
  );
};
