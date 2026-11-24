// Cloud Firestore Service for Recently Viewed Vehicles
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Vehicle } from '@/types';
import { RecentlyViewedItem } from '@/types/buyer';

export const getRecentlyViewedVehicles = async (uid: string): Promise<RecentlyViewedItem[]> => {
  if (!db || !uid) return [];
  try {
    const colRef = collection(db, 'recentlyViewed', uid, 'items');
    const q = query(colRef, orderBy('lastViewedAt', 'desc'), limit(12));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data() as RecentlyViewedItem);
  } catch (error) {
    console.error('Error fetching recently viewed:', error);
    return [];
  }
};

export const trackVehicleView = async (uid: string, vehicle: Vehicle): Promise<void> => {
  if (!db || !uid || !vehicle) return;
  try {
    const docRef = doc(db, 'recentlyViewed', uid, 'items', vehicle.id);
    const payload: RecentlyViewedItem = {
      vehicleId: vehicle.id,
      vehicle,
      lastViewedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.warn('Track vehicle view warning:', err);
  }
};

export const removeRecentlyViewedItem = async (uid: string, vehicleId: string): Promise<void> => {
  if (!db || !uid) return;
  try {
    const docRef = doc(db, 'recentlyViewed', uid, 'items', vehicleId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Remove recently viewed warning:', err);
  }
};
