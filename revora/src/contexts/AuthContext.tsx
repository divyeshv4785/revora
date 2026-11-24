'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase/config';
import { getUserProfileDocument } from '@/lib/firebase/firestore';
import { logoutFromFirebase } from '@/lib/firebase/auth';
import { UserProfile, UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isFullyVerified: boolean;
  roles: UserRole[];
  activeRole: UserRole;
  isConfigured: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  canAccess: (feature: RestrictedFeature) => boolean;
}

export type RestrictedFeature =
  | 'view_home'
  | 'view_about'
  | 'view_how_it_works'
  | 'view_dealerships'
  | 'explore_categories'
  | 'featured_previews'
  | 'complete_car_search'
  | 'advanced_filters'
  | 'full_vehicle_details'
  | 'favourite_cars'
  | 'compare_vehicles'
  | 'contact_seller'
  | 'enquire_vehicle'
  | 'request_test_drive'
  | 'sell_car'
  | 'submit_vehicle_listing'
  | 'register_dealership';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Refresh profile manually
  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    try {
      await user.reload();
      const updatedProfile = await getUserProfileDocument(user.uid);
      setProfile(updatedProfile);
    } catch (e) {
      console.warn('Error refreshing profile:', e);
    }
  }, [user]);

  // Listen to Firebase Auth state
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser && db) {
        // Subscribe to real-time profile updates from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribeProfile = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
            } else {
              setProfile(null);
            }
            setLoading(false);
          },
          (err) => {
            console.warn('Profile snapshot error:', err);
            setLoading(false);
          }
        );

        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const logout = async () => {
    await logoutFromFirebase();
    setUser(null);
    setProfile(null);
  };

  const isEmailVerified = Boolean(user?.emailVerified || profile?.emailVerified);
  const isPhoneVerified = Boolean(profile?.phoneVerified);
  const isFullyVerified = isEmailVerified && isPhoneVerified;
  const isAuthenticated = Boolean(user);
  const roles: UserRole[] = profile?.roles || (isAuthenticated ? ['buyer'] : []);
  const activeRole: UserRole = profile?.activeRole || 'buyer';

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return roles.includes(role) || roles.includes('admin') || roles.includes('super_admin');
    },
    [roles]
  );

  // Access control matrix evaluation
  const canAccess = useCallback(
    (feature: RestrictedFeature): boolean => {
      // 1. Completely public features
      if (
        feature === 'view_home' ||
        feature === 'view_about' ||
        feature === 'view_how_it_works' ||
        feature === 'view_dealerships' ||
        feature === 'explore_categories' ||
        feature === 'featured_previews'
      ) {
        return true;
      }

      // 2. All other features strictly require authentication
      if (!isAuthenticated) {
        return false;
      }

      // 3. Seller-specific features
      if (feature === 'submit_vehicle_listing') {
        return hasRole('individual_seller') || hasRole('dealer_owner') || hasRole('dealer_employee');
      }

      // 4. Dealership-specific features
      if (feature === 'register_dealership') {
        return hasRole('dealer_owner') || hasRole('dealer_employee');
      }

      // 5. Standard logged-in user features
      return true;
    },
    [isAuthenticated, hasRole]
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated,
      isEmailVerified,
      isPhoneVerified,
      isFullyVerified,
      roles,
      activeRole,
      isConfigured: isFirebaseConfigured(),
      logout,
      refreshProfile,
      hasRole,
      canAccess,
    }),
    [
      user,
      profile,
      loading,
      isAuthenticated,
      isEmailVerified,
      isPhoneVerified,
      isFullyVerified,
      roles,
      activeRole,
      refreshProfile,
      hasRole,
      canAccess,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
