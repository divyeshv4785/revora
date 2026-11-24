// Cloud Firestore Service for Vehicle Comparisons
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Vehicle } from '@/types';
import { ComparisonItem } from '@/types/buyer';

export const getBuyerComparisons = async (uid: string): Promise<ComparisonItem[]> => {
  if (!db || !uid) return [];
  try {
    const colRef = collection(db, 'comparisons', uid, 'items');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((docSnap) => docSnap.data() as ComparisonItem);
  } catch (error) {
    console.error('Error fetching comparisons:', error);
    return [];
  }
};

export const addVehicleToComparison = async (uid: string, vehicle: Vehicle): Promise<{ success: boolean; message?: string }> => {
  if (!db || !uid) throw new Error('Authentication required');
  const existing = await getBuyerComparisons(uid);
  if (existing.length >= 4) {
    return { success: false, message: 'You can compare up to 4 vehicles at a time.' };
  }

  const docRef = doc(db, 'comparisons', uid, 'items', vehicle.id);
  const item: ComparisonItem = {
    vehicleId: vehicle.id,
    vehicle,
    addedAt: new Date().toISOString(),
  };
  await setDoc(docRef, item);
  return { success: true };
};

export const removeVehicleFromComparison = async (uid: string, vehicleId: string): Promise<void> => {
  if (!db || !uid) throw new Error('Authentication required');
  const docRef = doc(db, 'comparisons', uid, 'items', vehicleId);
  await deleteDoc(docRef);
};

export const clearAllComparisons = async (uid: string): Promise<void> => {
  if (!db || !uid) throw new Error('Authentication required');
  const colRef = collection(db, 'comparisons', uid, 'items');
  const snapshot = await getDocs(colRef);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
};
