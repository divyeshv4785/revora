'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireEmailVerified?: boolean;
  requirePhoneVerified?: boolean;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireEmailVerified = false,
  requirePhoneVerified = false,
  requiredRole,
  redirectTo = '/login',
}) => {
  const { user, profile, loading, isAuthenticated, isEmailVerified, isPhoneVerified, hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requireAuth && requireEmailVerified && !isEmailVerified) {
      router.push(`/verify-email?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requireAuth && requirePhoneVerified && !isPhoneVerified) {
      router.push(`/verify-phone?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/onboarding');
      return;
    }
  }, [
    loading,
    isAuthenticated,
    isEmailVerified,
    isPhoneVerified,
    hasRole,
    requireAuth,
    requireEmailVerified,
    requirePhoneVerified,
    requiredRole,
    redirectTo,
    pathname,
    router,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B0D] flex items-center justify-center p-6 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-revora-sky border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
