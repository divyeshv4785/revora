'use client';

import React from 'react';
import { X, Search, Lock, ArrowRight, Filter, AlertCircle } from 'lucide-react';
import { Vehicle } from '@/types';
import { SearchFilterState } from './VehicleSearch';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { Button } from '@/components/common/Button';

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilterState | null;
  results: Vehicle[];
  onViewDetails: (vehicle: Vehicle) => void;
  onRequireAuth: (action: string) => void;
}

export const SearchResultsModal: React.FC<SearchResultsModalProps> = ({
  isOpen,
  onClose,
  filters,
  results,
  onViewDetails,
  onRequireAuth,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-revora-steel/10 flex items-center justify-center text-revora-steel">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg text-revora-textPrimary">
                  Search Preview Results
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-revora-steel/10 text-revora-steel">
                  {results.length} Matches Found
                </span>
              </div>
              <p className="text-xs text-revora-textSecondary">
                Showing preview matching: {filters?.brand || 'All Brands'}{' '}
                {filters?.model ? `• ${filters.model}` : ''} in {filters?.location || 'All India'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-revora-textPrimary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Access Barrier Alert */}
        <div className="m-6 p-4 rounded-2xl bg-revora-dark text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/10">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-revora-sky shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-white">
                Guest Preview Mode — Authentication Required for Full Access
              </p>
              <p className="text-gray-300 mt-0.5">
                Join REVORA free to view seller contact details, full inspection dossiers, and unlock 15,000+ unlisted dealer vehicles.
              </p>
            </div>
          </div>

          <Button
            variant="accent"
            size="sm"
            onClick={() => onRequireAuth('Access complete search inventory')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="shrink-0 text-xs font-bold w-full sm:w-auto"
          >
            Sign In / Register
          </Button>
        </div>

        {/* Results Grid */}
        <div className="px-6 pb-8">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onViewDetails={onViewDetails}
                  onRequireAuth={onRequireAuth}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
              <h4 className="font-heading font-bold text-lg text-revora-textPrimary">
                No matching vehicles found for these specific criteria
              </h4>
              <p className="text-xs text-revora-textSecondary max-w-md mx-auto">
                Try adjusting your brand, price range, or location filters to see more results, or view our full curated selection.
              </p>
              <Button
                variant="outline"
                size="md"
                onClick={onClose}
              >
                Modify Search Filters
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
