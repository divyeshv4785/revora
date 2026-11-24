'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { ExploreCarsSection } from '@/components/landing/ExploreCarsSection';
import { CategorySection } from '@/components/landing/CategorySection';
import { DealershipSection } from '@/components/landing/DealershipSection';
import { WhyRevora } from '@/components/landing/WhyRevora';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { SellCarCTA } from '@/components/landing/SellCarCTA';
import { DealerCTA } from '@/components/landing/DealerCTA';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { AuthRequiredModal } from '@/components/common/AuthRequiredModal';
import { VehicleDetailModal } from '@/components/vehicles/VehicleDetailModal';
import { SearchResultsModal } from '@/components/landing/SearchResultsModal';
import { useToast } from '@/components/common/Toast';
import { FEATURED_VEHICLES, RECENT_VEHICLES } from '@/data/mockData';
import { Vehicle, Category, Dealership } from '@/types';

export default function HomePage() {
  const { showToast } = useToast();

  // Location State
  const [currentLocation, setCurrentLocation] = useState('Coimbatore, Tamil Nadu');

  // Authentication Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<'buyer' | 'seller' | 'dealer'>('buyer');
  const [authTitle, setAuthTitle] = useState('Join REVORA to Access Complete Marketplace');
  const [authDescription, setAuthDescription] = useState(
    'Create a free account or sign in to explore detailed vehicle inspection reports, contact verified sellers directly, schedule test drives, and save favorites.'
  );

  // Selected Vehicle Detail Modal State
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Search Results Modal State
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);

  // Helper to open Auth Modal with tailored messaging
  const handleOpenAuth = (
    mode: 'login' | 'register' = 'login',
    role: 'buyer' | 'seller' | 'dealer' = 'buyer',
    title?: string,
    description?: string
  ) => {
    setAuthMode(mode);
    setAuthRole(role);
    if (title) setAuthTitle(title);
    if (description) setAuthDescription(description);
    setAuthModalOpen(true);
  };

  // Restrict protected action helper
  const handleRequireAuth = (actionReason: string) => {
    handleOpenAuth(
      'login',
      'buyer',
      `Sign In Required to ${actionReason}`,
      'To maintain marketplace security, prevent spam, and protect vehicle owners, this feature is exclusively available to signed-in members.'
    );
  };

  // Location selector change
  const handleLocationChange = (newLoc: string) => {
    setCurrentLocation(newLoc);
    showToast('Location Updated', `Showing listings in ${newLoc}`, 'success');
  };

  // Category select handler
  const handleSelectCategory = (cat: Category) => {
    handleOpenAuth(
      'login',
      'buyer',
      `Explore ${cat.name} Portfolio (${cat.count})`,
      `Sign in to view all ${cat.name} available nationwide, view detailed inspection reports, and connect directly with sellers.`
    );
  };

  // Dealership inventory handler
  const handleViewDealerInventory = (dealer: Dealership) => {
    handleOpenAuth(
      'login',
      'buyer',
      `View ${dealer.name} Verified Inventory`,
      `Access all ${dealer.vehicleCount} certified vehicles at ${dealer.location} with direct branch manager contact.`
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-revora-mainBg text-revora-textPrimary">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        onOpenAuth={(mode, role, title) => handleOpenAuth(mode, role, title)}
        currentLocation={currentLocation}
        onSelectLocation={handleLocationChange}
      />

      <main className="flex-1">
        {/* 2. Hero Section: Cinematic White Audi R8 V10 Brand Visual */}
        <HeroSection
          onExploreCars={() => {
            const el = document.getElementById('explore-cars');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onSellCar={() => {
            handleOpenAuth(
              'register',
              'seller',
              'List Your Car on REVORA Free',
              'Create a verified seller profile in under 2 minutes. Connect directly with genuine buyers nationwide.'
            );
          }}
        />

        {/* 3. Section A: EXPLORE CARS (Interactive Vehicle Discovery + Immediate Verified Grid) */}
        <ExploreCarsSection
          onViewDetails={(v) => setSelectedVehicle(v)}
          onRequireAuth={handleRequireAuth}
          onViewAllCars={() =>
            handleOpenAuth(
              'login',
              'buyer',
              'Unlock Complete REVORA Marketplace',
              'Sign in to search across all registered dealerships and verified individual owners throughout India.'
            )
          }
          defaultLocation={currentLocation}
        />

        {/* 4. Section B: FIND YOUR PERFECT CAR (Browse by Body Styles & Categories) */}
        <CategorySection onSelectCategory={handleSelectCategory} />

        {/* 5. Section C: SELL YOUR CAR (Engaging Promotional Showcase) */}
        <SellCarCTA
          onStartSelling={() =>
            handleOpenAuth(
              'register',
              'seller',
              'Start Selling Your Car on REVORA',
              'Sell directly to genuine buyers at true market value with secure title transfer guidance.'
            )
          }
        />

        {/* 6. Section D: TRUSTED DEALERSHIPS (Certified Multi-Branch Network) */}
        <DealershipSection
          onViewDealerInventory={handleViewDealerInventory}
          onRegisterDealership={() =>
            handleOpenAuth(
              'register',
              'dealer',
              'Register Your Dealership with REVORA',
              'Expand your reach nationwide. Manage multi-branch inventory, receive certified customer leads, and integrate with your CRM.'
            )
          }
        />

        {/* 7. Section E: HOW REVORA WORKS (Interactive Guide for Buyers & Sellers) */}
        <HowItWorks onRequireAuth={handleRequireAuth} />

        {/* 8. Why Choose REVORA */}
        <WhyRevora />

        {/* 9. Dealership Network CTA */}
        <DealerCTA
          onRegisterDealership={() =>
            handleOpenAuth(
              'register',
              'dealer',
              'Register Dealership Network',
              'List verified cars, expand customer reach, and access professional automotive trade tools on India’s fastest-growing platform.'
            )
          }
        />

        {/* 10. Section F: FINAL CALL TO ACTION */}
        <FinalCTA
          onCreateAccount={() =>
            handleOpenAuth(
              'register',
              'buyer',
              'Join REVORA Today',
              'Discover your next car or list your vehicle in a secure, transparent automotive marketplace.'
            )
          }
          onExploreRevora={() => {
            const el = document.getElementById('explore-cars');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </main>

      {/* 11. Global Footer */}
      <Footer onOpenAuth={(mode, role, title) => handleOpenAuth(mode, role, title)} />

      {/* MODALS */}
      {/* Authentication Required Modal */}
      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        actionTitle={authTitle}
        actionDescription={authDescription}
        initialMode={authMode}
        initialRole={authRole}
      />

      {/* Vehicle Inspection Detail Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        onRequireAuth={handleRequireAuth}
      />

      {/* Search Results Modal */}
      <SearchResultsModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        filters={null}
        results={searchResults}
        onViewDetails={(v) => {
          setSearchModalOpen(false);
          setSelectedVehicle(v);
        }}
        onRequireAuth={handleRequireAuth}
      />
    </div>
  );
}
