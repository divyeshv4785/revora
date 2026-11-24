// Vehicle Data Service for REVORA Buyer Platform
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Vehicle, Dealership } from '@/types';
import { FEATURED_VEHICLES, DEALERSHIPS } from '@/data/mockData';
import { BuyerProfile } from '@/types/buyer';

export interface VehicleQueryFilters {
  keyword?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  state?: string;
  city?: string;
  sellerType?: string;
  isInspected?: boolean;
  sortBy?: 'recommended' | 'recent' | 'price_asc' | 'price_desc' | 'lowest_km' | 'newest_year';
}

// 1. Fetch All Available Active Vehicles
export const getActiveVehicles = async (filters?: VehicleQueryFilters): Promise<Vehicle[]> => {
  let list: Vehicle[] = [];

  if (db) {
    try {
      const vehiclesRef = collection(db, 'vehicles');
      // Only fetch active listings
      const q = query(
        vehiclesRef,
        where('listingStatus', '==', 'active'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Vehicle[];
      }
    } catch (err) {
      console.warn('Firestore vehicles fetch fallback to seed catalog:', err);
    }
  }

  // Fallback to verified catalog if Firestore has no records yet
  if (list.length === 0) {
    list = [...FEATURED_VEHICLES];
  }

  // Apply in-memory client/server filtering
  if (filters) {
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.make.toLowerCase().includes(kw) ||
          v.model.toLowerCase().includes(kw) ||
          v.variant.toLowerCase().includes(kw) ||
          v.city.toLowerCase().includes(kw)
      );
    }

    if (filters.brand && filters.brand !== 'All Brands' && filters.brand !== '') {
      list = list.filter((v) => v.make.toLowerCase() === filters.brand!.toLowerCase());
    }

    if (filters.model && filters.model !== 'All Models' && filters.model !== '') {
      list = list.filter((v) => v.model.toLowerCase() === filters.model!.toLowerCase());
    }

    if (filters.minPrice) {
      list = list.filter((v) => v.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      list = list.filter((v) => v.price <= filters.maxPrice!);
    }

    if (filters.minYear) {
      list = list.filter((v) => v.year >= filters.minYear!);
    }

    if (filters.maxYear) {
      list = list.filter((v) => v.year <= filters.maxYear!);
    }

    if (filters.fuelType && filters.fuelType !== 'All') {
      list = list.filter((v) => v.fuelType.toLowerCase() === filters.fuelType!.toLowerCase());
    }

    if (filters.transmission && filters.transmission !== 'All') {
      list = list.filter((v) => v.transmission.toLowerCase() === filters.transmission!.toLowerCase());
    }

    if (filters.bodyType && filters.bodyType !== 'All') {
      list = list.filter((v) => v.bodyType?.toLowerCase() === filters.bodyType!.toLowerCase());
    }

    if (filters.state && filters.state !== 'All India' && filters.state !== '') {
      list = list.filter((v) => v.state.toLowerCase() === filters.state!.toLowerCase());
    }

    if (filters.city && filters.city !== 'All Cities' && filters.city !== '') {
      list = list.filter((v) => v.city.toLowerCase() === filters.city!.toLowerCase());
    }

    if (filters.sellerType && filters.sellerType !== 'All') {
      list = list.filter((v) => v.sellerType.toLowerCase() === filters.sellerType!.toLowerCase());
    }

    if (filters.isInspected !== undefined) {
      list = list.filter((v) => v.isVerified === filters.isInspected);
    }

    // Sort options
    switch (filters.sortBy) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'lowest_km':
        list.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'newest_year':
        list.sort((a, b) => b.year - a.year);
        break;
      case 'recent':
        list.sort((a, b) => (b.isRecent ? 1 : 0) - (a.isRecent ? 1 : 0));
        break;
      default:
        // recommended
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }
  }

  return list;
};

// 2. Fetch Single Vehicle by ID
export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  if (db) {
    try {
      const docRef = doc(db, 'vehicles', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Vehicle;
      }
    } catch (err) {
      console.warn('Firestore single vehicle fetch warning:', err);
    }
  }

  const found = FEATURED_VEHICLES.find((v) => v.id === id);
  return found || null;
};

// 3. Recommended Vehicles for Buyer Profile
export const getRecommendedVehicles = async (buyer: BuyerProfile | null): Promise<Vehicle[]> => {
  const all = await getActiveVehicles();
  if (!buyer) {
    return all.slice(0, 4);
  }

  const { preferredBrands, preferredFuelTypes, preferredTransmission, maxBudget, minBudget } =
    buyer.preferences || {};

  const matches = all.filter((v) => {
    let score = 0;
    if (preferredBrands && preferredBrands.includes(v.make)) score += 3;
    if (preferredFuelTypes && preferredFuelTypes.includes(v.fuelType)) score += 2;
    if (preferredTransmission && preferredTransmission.includes(v.transmission)) score += 2;
    if (minBudget && maxBudget && v.price >= minBudget && v.price <= maxBudget) score += 3;
    if (buyer.city && v.city.toLowerCase() === buyer.city.toLowerCase()) score += 2;
    return score >= 2;
  });

  return matches.length > 0 ? matches.slice(0, 4) : all.slice(0, 4);
};

// 4. Recently Added Vehicles
export const getRecentlyAddedVehicles = async (): Promise<Vehicle[]> => {
  const all = await getActiveVehicles({ sortBy: 'recent' });
  return all.slice(0, 4);
};

// 5. Popular Near User's City / State
export const getPopularNearLocation = async (city?: string, state?: string): Promise<Vehicle[]> => {
  const all = await getActiveVehicles();
  if (city) {
    const cityMatches = all.filter((v) => v.city.toLowerCase() === city.toLowerCase());
    if (cityMatches.length > 0) return cityMatches.slice(0, 4);
  }
  if (state) {
    const stateMatches = all.filter((v) => v.state.toLowerCase() === state.toLowerCase());
    if (stateMatches.length > 0) return stateMatches.slice(0, 4);
  }
  return all.slice(0, 4);
};

// 6. Featured Approved Dealerships
export const getApprovedDealerships = async (): Promise<Dealership[]> => {
  if (db) {
    try {
      const q = query(
        collection(db, 'dealerships'),
        where('isVerified', '==', true),
        limit(6)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Dealership[];
      }
    } catch (e) {
      console.warn('Dealerships fetch warning:', e);
    }
  }
  return DEALERSHIPS || [];
};
