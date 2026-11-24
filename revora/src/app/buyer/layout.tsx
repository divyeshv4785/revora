'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { BuyerNavbar } from '@/components/buyer/BuyerNavbar';
import { BuyerSidebar } from '@/components/buyer/BuyerSidebar';

function BuyerLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, isAuthenticated, isEmailVerified, isPhoneVerified, hasRole } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isOnboardingPage = pathname === '/buyer/onboarding';

  // Route protection guards
  useEffect(() => {
    if (loading || isPreview) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isEmailVerified) {
      router.push(`/verify-email?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isPhoneVerified) {
      router.push(`/verify-phone?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Role check: must have 'buyer' role or admin
    if (!hasRole('buyer')) {
      router.push('/onboarding');
      return;
    }

    // Check if buyer profile onboarding is completed
    const hasCompletedBuyerOnboarding =
      profile?.buyerOnboardingCompleted ||
      (profile?.profileCompleted && profile?.city);

    if (!hasCompletedBuyerOnboarding && !isOnboardingPage) {
      router.push(`/buyer/onboarding?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
  }, [
    loading,
    isAuthenticated,
    isEmailVerified,
    isPhoneVerified,
    hasRole,
    profile,
    isOnboardingPage,
    pathname,
    router,
    isPreview,
  ]);

  if (loading && !isPreview) {
    return (
      <div className="min-h-screen bg-[#070B0D] flex items-center justify-center p-6 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#60ADD9] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Loading REVORA Buyer Workspace...
          </p>
        </div>
      </div>
    );
  }

  // If on onboarding page, render full width without sidebar
  if (isOnboardingPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#070B0D] text-white flex flex-col">
      {/* Top Navigation */}
      <BuyerNavbar
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        isSidebarOpen={mobileSidebarOpen}
      />

      <div className="flex flex-1">
        {/* Collapsible / Responsive Sidebar */}
        <BuyerSidebar
          isOpenOnMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070B0D] flex items-center justify-center p-6 text-white">
          <div className="w-8 h-8 rounded-full border-2 border-[#60ADD9] border-t-transparent animate-spin" />
        </div>
      }
    >
      <BuyerLayoutContent>{children}</BuyerLayoutContent>
    </Suspense>
  );
}
