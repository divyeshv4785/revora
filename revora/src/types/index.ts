export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
export type TransmissionType = 'Manual' | 'Automatic';
export type SellerType = 'Verified Dealership' | 'Individual Seller';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  mileage: number; // in kilometers
  fuelType: FuelType;
  transmission: TransmissionType;
  price: number; // in INR
  location: string;
  city: string;
  state: string;
  sellerType: SellerType;
  sellerName: string;
  isVerified: boolean;
  isRecent?: boolean;
  isFeatured?: boolean;
  image: string;
  badge?: string;
  bodyType?: string;
  ownersCount?: number;
}

export interface Category {
  id: string;
  name: string;
  count: string;
  description: string;
  image: string;
  popularModels: string;
}

export interface Dealership {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  vehicleCount: number;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  tagline: string;
  brands: string[];
}

export interface SearchFilters {
  keyword?: string;
  location: string;
  brand: string;
  model: string;
  minPrice: string;
  maxPrice: string;
  fuelType: string;
  transmission: string;
  sortBy?: 'relevance' | 'newest' | 'price_asc' | 'price_desc';
  sellerType?: string;
}
