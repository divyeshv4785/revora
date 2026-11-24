// Server-Side Firebase Authentication Token Verification & Role-Based Authorization
// Validates Firebase ID tokens cryptographically using Google Identity Toolkit
// Enforces ownership and permission checks using Cloud Firestore

import { db } from './config';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '@/types/auth';

export interface VerifiedFirebaseUser {
  uid: string;
  email: string;
  phoneNumber?: string;
  emailVerified: boolean;
}

// 1. Cryptographically Verify Firebase ID Token
export const verifyFirebaseIdToken = async (
  authHeader: string | null
): Promise<VerifiedFirebaseUser | null> => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const idToken = authHeader.split('Bearer ')[1]?.trim();
  if (!idToken) return null;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    console.error('NEXT_PUBLIC_FIREBASE_API_KEY is not configured for token verification.');
    return null;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Firebase token validation failed:', errorData);
      return null;
    }

    const data = await response.json();
    const user = data.users?.[0];

    if (!user || !user.localId) {
      return null;
    }

    return {
      uid: user.localId,
      email: user.email || '',
      phoneNumber: user.phoneNumber,
      emailVerified: Boolean(user.emailVerified),
    };
  } catch (error) {
    console.error('Error verifying Firebase ID token on server:', error);
    return null;
  }
};

// 2. Fetch User Profile on Server
export const getUserProfileServer = async (uid: string): Promise<UserProfile | null> => {
  if (!db || !uid) return null;
  try {
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.warn('Error fetching server user profile:', err);
    return null;
  }
};

// 3. Verify Dealership Ownership & Staff Permissions
export const canManageDealership = async (
  uid: string,
  dealershipId: string
): Promise<boolean> => {
  if (!db || !uid || !dealershipId || dealershipId === 'unassigned') return false;

  try {
    // 1. Check if user is platform admin
    const profile = await getUserProfileServer(uid);
    const userRoles = profile?.roles || profile?.selectedRoles || [];
    if (userRoles.includes('admin') || userRoles.includes('super_admin')) {
      return true;
    }

    // 2. Check if user profile is tied to this dealership
    if (profile?.dealershipId === dealershipId) {
      if (userRoles.includes('dealer_owner') || userRoles.includes('dealer_employee')) {
        return true;
      }
    }

    // 3. Check dealership document ownership in dealerships/{dealershipId}
    const dealershipSnap = await getDoc(doc(db, 'dealerships', dealershipId));
    if (dealershipSnap.exists()) {
      const data = dealershipSnap.data();
      if (data.ownerUid === uid) {
        return true;
      }
      if (Array.isArray(data.authorizedStaffUids) && data.authorizedStaffUids.includes(uid)) {
        return true;
      }
    }

    return false;
  } catch (err) {
    console.error('Error checking dealership permissions:', err);
    return false;
  }
};

// 4. Verify Access to Private Vehicle Documents
export const canAccessVehicleDocument = async (
  requestingUid: string,
  documentOwnerUid: string
): Promise<boolean> => {
  if (!requestingUid) return false;

  // Direct owner always has access
  if (requestingUid === documentOwnerUid) {
    return true;
  }

  // Check if requesting user is authorized verification staff or platform admin
  const profile = await getUserProfileServer(requestingUid);
  const userRoles = profile?.roles || profile?.selectedRoles || [];
  if (
    userRoles.includes('admin') ||
    userRoles.includes('super_admin') ||
    userRoles.includes('verification_employee')
  ) {
    return true;
  }

  return false;
};
