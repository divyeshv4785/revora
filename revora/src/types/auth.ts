// REVORA Authentication & User Profile Types

export type UserRole =
  | 'buyer'
  | 'individual_seller'
  | 'dealer_owner'
  | 'dealer_employee'
  | 'platform_employee'
  | 'verification_employee'
  | 'admin'
  | 'super_admin';

export type AccountStatus =
  | 'pending_verification'
  | 'active'
  | 'suspended'
  | 'blocked';

export type OnboardingStatus =
  | 'pending'
  | 'in_progress'
  | 'completed';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  accountStatus: AccountStatus;
  selectedRoles: UserRole[];
  roles: UserRole[];            // Maintained for backward compatibility
  activeRole: UserRole;
  profileCompleted: boolean;
  buyerOnboardingCompleted?: boolean;
  onboardingCompleted?: boolean;// Maintained for backward compatibility
  onboardingStatus: OnboardingStatus;
  profilePhotoUrl?: string;
  address?: string;
  state?: string;
  district?: string;
  city?: string;
  pinCode?: string;
  dealershipId?: string;
  dealershipBranches?: string[];
  createdAt: string;            // ISO timestamp
  updatedAt: string;
  lastLoginAt: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface LoginFormData {
  identifier: string; // Email or Mobile Number
  password: string;
  rememberMe?: boolean;
}
