// Cloud Firestore Helpers for REVORA User Profiles
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './config';
import { UserProfile, UserRole } from '@/types/auth';

// 1. Create Initial User Profile in users/{uid}
export const createUserProfileDocument = async (
  uid: string,
  profileData: Partial<UserProfile>
): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  const userRef = doc(db, 'users', uid);
  
  const now = new Date().toISOString();
  const assignedRoles = profileData.selectedRoles || profileData.roles || ['buyer'];
  const newProfile: UserProfile = {
    uid,
    fullName: profileData.fullName || '',
    email: profileData.email || '',
    phoneNumber: profileData.phoneNumber || '',
    emailVerified: profileData.emailVerified ?? false,
    phoneVerified: profileData.phoneVerified ?? Boolean(profileData.phoneNumber),
    accountStatus: profileData.accountStatus || 'active',
    selectedRoles: assignedRoles,
    roles: assignedRoles,
    activeRole: profileData.activeRole || assignedRoles[0] || 'buyer',
    profileCompleted: profileData.profileCompleted ?? false,
    onboardingCompleted: profileData.onboardingCompleted ?? false,
    onboardingStatus: profileData.onboardingStatus || 'pending',
    address: profileData.address || '',
    state: profileData.state || '',
    district: profileData.district || '',
    city: profileData.city || '',
    pinCode: profileData.pinCode || '',
    profilePhotoUrl: profileData.profilePhotoUrl || '',
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  };

  await setDoc(userRef, newProfile);
};

// 2. Fetch User Profile
export const getUserProfileDocument = async (
  uid: string
): Promise<UserProfile | null> => {
  if (!db) return null;
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return snapshot.data() as UserProfile;
  }
  return null;
};

// 2b. Ensure User Profile exists (auto-create if logging in via phone OTP without prior registration)
export const ensureUserProfileDocument = async (
  user: User,
  additionalData?: Partial<UserProfile>
): Promise<UserProfile> => {
  if (!db) throw new Error('Firestore is not initialized');
  let profile: UserProfile | null = null;
  
  try {
    profile = await getUserProfileDocument(user.uid);
  } catch (err) {
    console.warn('Initial profile lookup warning:', err);
  }

  if (!profile) {
    const formattedPhone = user.phoneNumber || '';
    const name =
      user.displayName ||
      (formattedPhone ? `Member ${formattedPhone.slice(-4)}` : 'REVORA Member');

    const newProfileData: Partial<UserProfile> = {
      fullName: name,
      email: user.email || '',
      phoneNumber: formattedPhone,
      emailVerified: Boolean(user.emailVerified),
      phoneVerified: Boolean(user.phoneNumber),
      accountStatus: 'active',
      roles: ['buyer'],
      activeRole: 'buyer',
      onboardingCompleted: false,
      ...additionalData,
    };

    await createUserProfileDocument(user.uid, newProfileData);
    
    try {
      profile = await getUserProfileDocument(user.uid);
    } catch (err) {
      console.warn('Post-creation profile fetch warning:', err);
    }

    if (!profile) {
      profile = {
        uid: user.uid,
        fullName: name,
        email: user.email || '',
        phoneNumber: formattedPhone,
        emailVerified: Boolean(user.emailVerified),
        phoneVerified: Boolean(user.phoneNumber),
        accountStatus: 'active',
        selectedRoles: ['buyer'],
        roles: ['buyer'],
        activeRole: 'buyer',
        profileCompleted: false,
        onboardingCompleted: false,
        onboardingStatus: 'pending',
        address: '',
        state: '',
        district: '',
        city: '',
        pinCode: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
    }
  }
  return profile;
};

// 3. Update User Profile Fields
export const updateUserProfileDocument = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

// 4. Update Verification Flags
export const markUserEmailVerified = async (uid: string): Promise<void> => {
  if (!db) return;
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    emailVerified: true,
    updatedAt: new Date().toISOString(),
  });
};

export const markUserPhoneVerified = async (uid: string): Promise<void> => {
  if (!db) return;
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    phoneVerified: true,
    accountStatus: 'active', // Mark active once both phone and email are verified
    updatedAt: new Date().toISOString(),
  });
};

// 5. Update Active Role / Complete Onboarding
export const completeUserOnboarding = async (
  uid: string,
  chosenRole: UserRole
): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  const existingRoles = snap.exists() ? (snap.data().roles as UserRole[]) || ['buyer'] : ['buyer'];
  
  const updatedRoles = Array.from(new Set([...existingRoles, chosenRole]));

  await updateDoc(userRef, {
    roles: updatedRoles,
    activeRole: chosenRole,
    onboardingCompleted: true,
    updatedAt: new Date().toISOString(),
  });
};

// 6. Check if Phone Number is already used by another user profile
export const checkPhoneNumberExists = async (phoneNumber: string): Promise<boolean> => {
  if (!db) return false;
  try {
    const q = query(collection(db, 'users'), where('phoneNumber', '==', phoneNumber));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.warn('Phone check fallback:', error);
    return false;
  }
};
