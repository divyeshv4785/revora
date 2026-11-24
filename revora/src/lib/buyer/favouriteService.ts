// Cloud Firestore Service for Buyer Favourites
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Vehicle } from '@/types';
import { FavouriteItem } from '@/types/buyer';

export const getBuyerFavourites = async (uid: string): Promise<FavouriteItem[]> => {
  if (!db || !uid) return [];
  try {
    const favRef = collection(db, 'favourites', uid, 'items');
    const snapshot = await getDocs(favRef);
    return snapshot.docs.map((docSnap) => docSnap.data() as FavouriteItem);
  } catch (error) {
    console.error('Error fetching favourites:', error);
    return [];
  }
};

export const isVehicleFavourited = async (uid: string, vehicleId: string): Promise<boolean> => {
  if (!db || !uid) return false;
  try {
    const docRef = doc(db, 'favourites', uid, 'items', vehicleId);
    const snap = await getDoc(docRef);
    return snap.exists();
  } catch {
    return false;
  }
};

export const addVehicleToFavourites = async (uid: string, vehicle: Vehicle): Promise<void> => {
  if (!db || !uid) throw new Error('Authentication required');
  const docRef = doc(db, 'favourites', uid, 'items', vehicle.id);
  const item: FavouriteItem = {
    vehicleId: vehicle.id,
    vehicle,
    addedAt: new Date().toISOString(),
  };
  await setDoc(docRef, item);
};

export const removeVehicleFromFavourites = async (uid: string, vehicleId: string): Promise<void> => {
  if (!db || !uid) throw new Error('Authentication required');
  const docRef = doc(db, 'favourites', uid, 'items', vehicleId);
  await deleteDoc(docRef);
};
