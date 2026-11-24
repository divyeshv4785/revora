'use client';

import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  ChevronDown,
  Car,
  MapPin,
  Fuel,
  Settings2,
  Lock,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import {
  INDIAN_LOCATIONS,
  CAR_BRANDS_AND_MODELS,
  PRICE_MIN_OPTIONS,
  PRICE_MAX_OPTIONS,
} from '@/data/mockData';

export interface SearchFilterState {
  keyword: string;
  location: string;
  brand: string;
  model: string;
  minPrice: string;
  maxPrice: string;
  fuelType: string;
  transmission: string;
  sortBy: string;
}

interface VehicleSearchProps {
  onSearchSubmit: (filters: SearchFilterState) => void;
  onClearFilters?: () => void;
  defaultLocation?: string;
}

export const VehicleSearch: React.FC<VehicleSearchProps> = ({
  onSearchSubmit,
  onClearFilters,
  defaultLocation = 'All India',
}) => {
  const [filters, setFilters] = useState<SearchFilterState>({
    keyword: '',
    location: defaultLocation,
    brand: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    fuelType: '',
    transmission: '',
    sortBy: 'relevance',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // Available models dynamically dependent on selected brand
  const availableModels = filters.brand
    ? CAR_BRANDS_AND_MODELS[filters.brand] || []
    : [];

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBrand = e.target.value;
    setFilters((prev) => ({
      ...prev,
      brand: selectedBrand,
      model: '', // Reset model when brand changes
    }));
    setValidationError(null);
  };

  const handleInputChange = (
    field: keyof SearchFilterState,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationError(null);
  };

  const handleClear = () => {
    setFilters({
      keyword: '',
      location: defaultLocation,
      brand: '',
      model: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
      transmission: '',
      sortBy: 'relevance',
    });
    setValidationError(null);
    onClearFilters?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: if minPrice and maxPrice are both provided, check min <= max
    if (filters.minPrice && filters.maxPrice) {
      if (parseInt(filters.minPrice, 10) > parseInt(filters.maxPrice, 10)) {
        setValidationError('Minimum price cannot be greater than Maximum price.');
        return;
      }
    }

    setValidationError(null);
    onSearchSubmit(filters);
  };

  const fuelOptions = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
  const transmissionOptions = ['Manual', 'Automatic'];

  return (
    <section id="explore-cars" className="py-16 sm:py-20 bg-white border-b border-revora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-card border border-revora-border p-6 sm:p-8 lg:p-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-revora-steel/10 text-revora-steel text-xs font-semibold uppercase tracking-wider mb-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Vehicle Discovery Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-revora-textPrimary">
                Find Your Perfect Car
              </h2>
              <p className="text-xs sm:text-sm text-revora-textSecondary mt-1">
                Filter by verified specifications, city, or price to explore pre-owned vehicles across India.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-revora-textSecondary hover:text-revora-textPrimary hover:bg-gray-100 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            </div>
          </div>

          {validationError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {validationError}
            </div>
          )}

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {/* Top Row: Keyword Search and Sort By */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-revora-textSecondary mb-1.5 uppercase tracking-wider">
                  Keyword / Model Variant
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-revora-steel absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Camry, Sunroof, Automatic, Low Mileage..."
                    value={filters.keyword}
                    onChange={(e) => handleInputChange('keyword', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl font-medium text-revora-textPrimary focus:outline-none focus:border-revora-steel focus:ring-1 focus:ring-revora-steel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-revora-textSecondary mb-1.5 uppercase tracking-wider">
                  Sort Results By
                </label>
                <div className="relative">
                  <ArrowUpDown className="w-4 h-4 text-revora-steel absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleInputChange('sortBy', e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl font-medium text-revora-textPrimary focus:outline-none focus:border-revora-steel appearance-none cursor-pointer"
                  >
                    <option value="relevance">Relevance & Verified Match</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Main Grid: 7 Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. Location */}
              <div>
                <label className="block text-xs font-semibold text-revora-textSecondary mb-1.5 uppercase tracking-wider">
                  1. Location (City / State)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-revora-steel absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={filters.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl font-medium text-revora-textPrimary focus:outline-none focus:border-revora-steel focus:ring-1 focus:ring-revora-steel appearance-none cursor-pointer"
                  >
                    {INDIAN_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 2. Brand */}
              <div>
                <label className="block text-xs font-semibold text-revora-textSecondary mb-1.5 uppercase tracking-wider">
                  2. Brand / Make
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 text-revora-steel absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={filters.brand}
                    onChange={handleBrandChange}
                    className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl font-medium text-revora-textPrimary focus:outline-none focus:border-revora-steel focus:ring-1 focus:ring-revora-steel appearance-none cursor-pointer"
                  >
                    <option value="">All Brands (e.g. Toyota, Honda)</option>
                    {Object.keys(CAR_BRANDS_AND_MODELS).map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 3. Model (Dependent on Brand) */}
              <div>
                <label className="block text-xs font-semibold text-revora-textSecondary mb-1.5 uppercase tracking-wider">
                  3. Model
                </label>
                <div className="relative">
                  <select
                    disabled={!filters.brand}
                    value={filters.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl font-medium appearance-none cursor-pointer focus:outline-none ${
                      filters.brand
                        ? 'bg-gray-50 border-gray-200 text-revora-textPrimary focus:border-revora-steel focus:ring-1 focus:ring-revora-steel'
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <option value="">
                      {filters.brand
                        ? `All ${filters.brand} Models`
                        : 'Select a brand first'}
                    </option>
                    {availableModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 4 & 5. Price Range (Min & Max in INR) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-revora-textSecondary mb-1.5 uppercase tracking-wider truncate">
                    4. Min Price
                  </label>
                  <div className="relative">
                    <select
                      value={filters.minPrice}
                      onChange={(e) => handleInputChange('minPrice', e.target.value)}
                      className="w-full px-2.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl font-medium text-revora-textPrimary focus:outline-none focus:border-revora-steel appearance-none cursor-pointer"
                    >
                      {PRICE_MIN_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-revora-textSecondary mb-1.5 uppercase tracking-wider truncate">
                    5. Max Price
                  </label>
                  <div className="relative">
                    <select
                      value={filters.maxPrice}
                      onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                      className="w-full px-2.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl font-medium text-revora-textPrimary focus:outline-none focus:border-revora-steel appearance-none cursor-pointer"
                    >
                      {PRICE_MAX_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 6. Fuel Type */}
              <div>
                <label className="block text-xs font-semibold text-revora-textSecondary mb-1.5 uppercase tracking-wider">
                  6. Fuel Type
                </label>
                <div className="relative">
                  <Fuel className="w-4 h-4 text-revora-steel absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={filters.fuelType}
                    onChange={(e) => handleInputChange('fuelType', e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl font-medium text-revora-textPrimary focus:outline-none focus:border-revora-steel appearance-none cursor-pointer"
                  >
                    <option value="">All Fuel Types</option>
                    {fuelOptions.map((fuel) => (
                      <option key={fuel} value={fuel}>
                        {fuel}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 7. Transmission */}
              <div>
                <label className="block text-xs font-semibold text-revora-textSecondary mb-1.5 uppercase tracking-wider">
                  7. Transmission
                </label>
                <div className="relative">
                  <Settings2 className="w-4 h-4 text-revora-steel absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={filters.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl font-medium text-revora-textPrimary focus:outline-none focus:border-revora-steel appearance-none cursor-pointer"
                  >
                    <option value="">All Transmissions</option>
                    {transmissionOptions.map((tr) => (
                      <option key={tr} value={tr}>
                        {tr}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Access Rule Micro-Notice */}
              <div className="sm:col-span-2 lg:col-span-1 flex items-center">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-revora-textSecondary flex items-center gap-2 w-full">
                  <Lock className="w-4 h-4 text-revora-muted shrink-0" />
                  <span>Sign in required for full vehicle history & contact info.</span>
                </div>
              </div>

              {/* 8. Find Cars Action Button */}
              <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  rightIcon={<Search className="w-4 h-4" />}
                  className="py-3 shadow-md shadow-revora-steel/20"
                >
                  Find Cars
                </Button>
              </div>

            </div>
          </form>

        </div>
      </div>
    </section>
  );
};
