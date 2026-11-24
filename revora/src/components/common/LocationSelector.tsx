'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check, Crosshair } from 'lucide-react';
import { INDIAN_LOCATIONS } from '@/data/mockData';

interface LocationSelectorProps {
  currentLocation: string;
  onSelectLocation: (loc: string) => void;
  variant?: 'nav' | 'input';
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation,
  onSelectLocation,
  variant = 'nav',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = INDIAN_LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDetectGPS = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Defaulting to Coimbatore, Tamil Nadu for demo if detected
          setTimeout(() => {
            onSelectLocation('Coimbatore, Tamil Nadu');
            setIsDetecting(false);
            setIsOpen(false);
          }, 600);
        },
        () => {
          // Fallback simulation
          setTimeout(() => {
            onSelectLocation('Coimbatore, Tamil Nadu');
            setIsDetecting(false);
            setIsOpen(false);
          }, 600);
        }
      );
    } else {
      setTimeout(() => {
        onSelectLocation('Coimbatore, Tamil Nadu');
        setIsDetecting(false);
        setIsOpen(false);
      }, 500);
    }
  };

  const isNav = variant === 'nav';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-xl transition-all duration-200 focus:outline-none ${
          isNav
            ? 'px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
            : 'w-full px-3.5 py-2.5 text-sm font-medium text-revora-textPrimary bg-white border border-revora-border hover:border-revora-steel/50 shadow-sm'
        }`}
      >
        <MapPin
          className={`shrink-0 ${
            isNav ? 'w-3.5 h-3.5 text-revora-sky' : 'w-4 h-4 text-revora-steel'
          }`}
        />
        <span className="truncate max-w-[150px]">{currentLocation}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isNav ? 'text-gray-400' : 'text-revora-textSecondary'}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-cardHover border border-revora-border py-2 z-50 animate-fade-in text-revora-textPrimary">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-revora-textSecondary uppercase tracking-wider mb-2">
              Select City / Region
            </p>
            <input
              type="text"
              placeholder="Search Indian city or PIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-revora-steel"
              autoFocus
            />
          </div>

          {/* GPS Auto Detect */}
          <div className="px-2 py-1.5 border-b border-gray-100">
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetecting}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-revora-steel hover:bg-revora-steel/5 rounded-xl transition-colors"
            >
              <Crosshair className={`w-4 h-4 text-revora-sky ${isDetecting ? 'animate-spin' : ''}`} />
              <span>{isDetecting ? 'Detecting GPS location...' : 'Use current location (GPS)'}</span>
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filteredLocations.map((loc) => {
              const isSelected = loc === currentLocation;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    onSelectLocation(loc);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-revora-steel/10 text-revora-steel font-semibold'
                      : 'hover:bg-gray-50 text-revora-textPrimary'
                  }`}
                >
                  <span className="truncate">{loc}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-revora-steel shrink-0" />}
                </button>
              );
            })}
            {filteredLocations.length === 0 && (
              <div className="px-4 py-3 text-xs text-center text-gray-400">
                No matching cities found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
