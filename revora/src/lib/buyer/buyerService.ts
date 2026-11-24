// Cloud Firestore Service for REVORA Buyer Profiles
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { BuyerProfile, BuyerPreferences } from '@/types/buyer';
import { updateUserProfileDocument } from '@/lib/firebase/firestore';

export const getBuyerProfile = async (uid: string): Promise<BuyerProfile | null> => {
  if (!db) return null;
  try {
    const docRef = doc(db, 'buyerProfiles', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as BuyerProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching buyer profile:', error);
    return null;
  }
};

export const saveBuyerProfile = async (
  uid: string,
  profileData: Partial<BuyerProfile>
): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  const now = new Date().toISOString();

  const buyerRef = doc(db, 'buyerProfiles', uid);
  const existing = await getBuyerProfile(uid);

  const defaultPreferences: BuyerPreferences = {
    preferredBrands: [],
    preferredBodyTypes: [],
    preferredFuelTypes: [],
    preferredTransmission: [],
    minBudget: 300000,
    maxBudget: 5000000,
    preferredYear: null,
    locationRadiusKm: 50,
  };

  const payload: BuyerProfile = {
    uid,
    fullName: profileData.fullName || existing?.fullName || '',
    email: profileData.email || existing?.email || '',
    phoneNumber: profileData.phoneNumber || existing?.phoneNumber || '',
    profilePhotoUrl: profileData.profilePhotoUrl || existing?.profilePhotoUrl || '',
    state: profileData.state || existing?.state || '',
    district: profileData.district || existing?.district || '',
    city: profileData.city || existing?.city || '',
    pinCode: profileData.pinCode || existing?.pinCode || '',
    address: profileData.address || existing?.address || '',
    preferences: profileData.preferences || existing?.preferences || defaultPreferences,
    buyerOnboardingCompleted: true,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  // 1. Save to buyerProfiles/{uid}
  await setDoc(buyerRef, payload, { merge: true });

  // 2. Synchronize common fields to users/{uid}
  await updateUserProfileDocument(uid, {
    fullName: payload.fullName,
    state: payload.state,
    district: payload.district,
    city: payload.city,
    pinCode: payload.pinCode,
    address: payload.address,
    profileCompleted: true,
    buyerOnboardingCompleted: true,
    onboardingStatus: 'completed',
    activeRole: 'buyer',
  });
};

export const updateBuyerPreferences = async (
  uid: string,
  preferences: Partial<BuyerPreferences>
): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  const buyerRef = doc(db, 'buyerProfiles', uid);
  const existing = await getBuyerProfile(uid);
  if (!existing) throw new Error('Buyer profile not found');

  const updatedPreferences: BuyerPreferences = {
    ...existing.preferences,
    ...preferences,
  };

  await updateDoc(buyerRef, {
    preferences: updatedPreferences,
    updatedAt: new Date().toISOString(),
  });
};
