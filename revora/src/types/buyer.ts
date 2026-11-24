// REVORA Buyer Module Data Types
import { Vehicle, FuelType, TransmissionType, SellerType } from '@/types';
import { UserRole } from '@/types/auth';

export interface BuyerPreferences {
  preferredBrands: string[];
  preferredBodyTypes: string[];
  preferredFuelTypes: FuelType[];
  preferredTransmission: TransmissionType[];
  minBudget: number; // in INR
  maxBudget: number; // in INR
  preferredYear: number | null;
  locationRadiusKm: number;
}

export interface BuyerProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePhotoUrl?: string;
  state: string;
  district: string;
  city: string;
  pinCode: string;
  address?: string;
  preferences: BuyerPreferences;
  buyerOnboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearch {
  id: string;
  uid: string;
  name: string;
  filters: {
    brand?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    fuelType?: string;
    transmission?: string;
    bodyType?: string;
    location?: string;
  };
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus = 'new' | 'contacted' | 'negotiating' | 'closed' | 'unsuccessful';

export interface BuyerEnquiry {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage: string;
  vehiclePrice: number;
  vehicleYear: number;
  vehicleLocation: string;
  buyerUid: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  sellerUid: string;
  sellerType: 'individual' | 'dealership';
  dealershipId?: string;
  dealershipName?: string;
  message: string;
  status: EnquiryStatus;
  sellerResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export type TestDriveStatus =
  | 'requested'
  | 'confirmed'
  | 'rescheduled'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type TestDriveLocationType = 'dealership_branch' | 'doorstep' | 'agreed_location';

export interface TestDriveBooking {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage: string;
  vehiclePrice: number;
  buyerUid: string;
  buyerName: string;
  buyerPhone: string;
  sellerUid: string;
  sellerName: string;
  sellerType: 'individual' | 'dealership';
  dealershipId?: string;
  dealershipName?: string;
  preferredDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 12:00 PM"
  locationType: TestDriveLocationType;
  locationAddress: string;
  status: TestDriveStatus;
  rescheduledDate?: string;
  rescheduledTimeSlot?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleInspection {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage: string;
  inspectionDate: string;
  inspectorName: string;
  inspectorId: string;
  overallScore: number; // out of 200
  status: 'scheduled' | 'in_progress' | 'verified';
  reportUrl?: string;
  sectionScores: {
    engineTransmission: { score: number; maxScore: number; status: 'passed' | 'attention_needed' | 'failed' };
    exteriorBody: { score: number; maxScore: number; status: 'passed' | 'attention_needed' | 'failed' };
    interior: { score: number; maxScore: number; status: 'passed' | 'attention_needed' | 'failed' };
    electricals: { score: number; maxScore: number; status: 'passed' | 'attention_needed' | 'failed' };
    tyresSuspension: { score: number; maxScore: number; status: 'passed' | 'attention_needed' | 'failed' };
  };
  summary: string;
  certified: boolean;
}

export interface BuyerNotification {
  id: string;
  uid: string;
  title: string;
  message: string;
  type: 'enquiry' | 'test_drive' | 'price_drop' | 'saved_search' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface RecentlyViewedItem {
  vehicleId: string;
  vehicle: Vehicle;
  lastViewedAt: string;
}

export interface ComparisonItem {
  vehicleId: string;
  vehicle: Vehicle;
  addedAt: string;
}

export interface FavouriteItem {
  vehicleId: string;
  vehicle: Vehicle;
  addedAt: string;
}
