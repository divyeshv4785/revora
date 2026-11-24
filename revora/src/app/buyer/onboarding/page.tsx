'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User as UserIcon,
  MapPin,
  Car,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Camera,
  Check,
  Edit2,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/common/Toast';
import { INDIAN_STATES_AND_DISTRICTS } from '@/data/indianStates';
import { CAR_BRANDS_AND_MODELS, PRICE_MIN_OPTIONS, PRICE_MAX_OPTIONS } from '@/data/mockData';
import { saveBuyerProfile, getBuyerProfile } from '@/lib/buyer/buyerService';
import { ProfilePhotoUpload } from '@/components/profile/ProfilePhotoUpload';
import { FuelType, TransmissionType } from '@/types';

function BuyerOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const { user, profile, refreshProfile, isAuthenticated, isFullyVerified } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Personal Info
  const [fullName, setFullName] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

  // Step 2: Location
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [address, setAddress] = useState('');

  // Step 3: Preferences
  const [preferredBrands, setPreferredBrands] = useState<string[]>([]);
  const [preferredBodyTypes, setPreferredBodyTypes] = useState<string[]>([]);
  const [preferredFuelTypes, setPreferredFuelTypes] = useState<FuelType[]>([]);
  const [preferredTransmission, setPreferredTransmission] = useState<TransmissionType[]>([]);
  const [minBudget, setMinBudget] = useState<number>(300000);
  const [maxBudget, setMaxBudget] = useState<number>(4000000);
  const [preferredYear, setPreferredYear] = useState<number | null>(null);
  const [locationRadiusKm, setLocationRadiusKm] = useState<number>(50);

  // Prefill existing user/profile data
  useEffect(() => {
    if (isPreview && !fullName) {
      setFullName('Anand Sharma');
      setSelectedState('Tamil Nadu');
      setSelectedDistrict('Coimbatore');
      setCity('Coimbatore');
      setPinCode('641001');
      setPreferredBrands(['Toyota', 'Honda', 'BMW']);
      setPreferredBodyTypes(['Sedan', 'SUV']);
      setPreferredFuelTypes(['Hybrid', 'Petrol']);
      setPreferredTransmission(['Automatic']);
    }
    if (profile) {
      if (profile.fullName) setFullName(profile.fullName);
      if (profile.state) setSelectedState(profile.state);
      if (profile.district) setSelectedDistrict(profile.district);
      if (profile.city) setCity(profile.city);
      if (profile.pinCode) setPinCode(profile.pinCode);
      if (profile.address) setAddress(profile.address);
      if (profile.profilePhotoUrl) setProfilePhotoUrl(profile.profilePhotoUrl);
    }
  }, [profile]);

  // If user already has a buyer profile, fetch it
  useEffect(() => {
    if (user?.uid) {
      getBuyerProfile(user.uid).then((bp) => {
        if (bp) {
          if (bp.fullName) setFullName(bp.fullName);
          if (bp.state) setSelectedState(bp.state);
          if (bp.district) setSelectedDistrict(bp.district);
          if (bp.city) setCity(bp.city);
          if (bp.pinCode) setPinCode(bp.pinCode);
          if (bp.preferences) {
            setPreferredBrands(bp.preferences.preferredBrands || []);
            setPreferredBodyTypes(bp.preferences.preferredBodyTypes || []);
            setPreferredFuelTypes(bp.preferences.preferredFuelTypes || []);
            setPreferredTransmission(bp.preferences.preferredTransmission || []);
            if (bp.preferences.minBudget) setMinBudget(bp.preferences.minBudget);
            if (bp.preferences.maxBudget) setMaxBudget(bp.preferences.maxBudget);
            if (bp.preferences.preferredYear) setPreferredYear(bp.preferences.preferredYear);
            if (bp.preferences.locationRadiusKm) setLocationRadiusKm(bp.preferences.locationRadiusKm);
          }
        }
      });
    }
  }, [user]);

  // Districts for selected state
  const availableDistricts = React.useMemo(() => {
    const found = INDIAN_STATES_AND_DISTRICTS.find((s) => s.state === selectedState);
    return found ? found.districts : [];
  }, [selectedState]);

  // Major cities for selected district
  const availableCities = React.useMemo(() => {
    const foundDist = availableDistricts.find((d) => d.name === selectedDistrict);
    return foundDist ? foundDist.majorCities : [];
  }, [availableDistricts, selectedDistrict]);

  const bodyTypeOptions = ['Sedan', 'SUV', 'Hatchback', 'MUV', 'Luxury', 'Electric'];
  const fuelTypeOptions: FuelType[] = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
  const transmissionOptions: TransmissionType[] = ['Automatic', 'Manual'];
  const brandOptions = Object.keys(CAR_BRANDS_AND_MODELS);

  const toggleBrand = (b: string) => {
    setPreferredBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  const toggleBodyType = (bt: string) => {
    setPreferredBodyTypes((prev) =>
      prev.includes(bt) ? prev.filter((x) => x !== bt) : [...prev, bt]
    );
  };

  const toggleFuel = (f: FuelType) => {
    setPreferredFuelTypes((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const toggleTransmission = (t: TransmissionType) => {
    setPreferredTransmission((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  // Step 1 validation
  const handleNextStep1 = () => {
    setError(null);
    if (!fullName.trim() || fullName.trim().length < 3) {
      setError('Please provide your full legal name (at least 3 characters).');
      return;
    }
    setStep(2);
  };

  // Step 2 validation
  const handleNextStep2 = () => {
    setError(null);
    if (!selectedState) {
      setError('Please select your state.');
      return;
    }
    if (!city.trim()) {
      setError('Please provide your city or town.');
      return;
    }
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(pinCode.trim())) {
      setError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    setStep(3);
  };

  // Step 3 (Preferences can be skipped or submitted)
  const handleNextStep3 = () => {
    setError(null);
    setStep(4);
  };

  // Final submission
  const handleSubmitOnboarding = async () => {
    if (!user) {
      setError('User session not found. Please log in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await saveBuyerProfile(user.uid, {
        fullName: fullName.trim(),
        email: user.email || profile?.email || '',
        phoneNumber: profile?.phoneNumber || '',
        profilePhotoUrl,
        state: selectedState,
        district: selectedDistrict,
        city: city.trim(),
        pinCode: pinCode.trim(),
        address: address.trim(),
        preferences: {
          preferredBrands,
          preferredBodyTypes,
          preferredFuelTypes,
          preferredTransmission,
          minBudget,
          maxBudget,
          preferredYear,
          locationRadiusKm,
        },
      });

      await refreshProfile();
      showToast('Buyer Profile Configured!', 'Welcome to REVORA. Explore verified vehicles across India.', 'success');
      router.push('/buyer/dashboard');
    } catch (err: any) {
      console.error('Onboarding submission error:', err);
      setError(err.message || 'Failed to save buyer profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B0D] text-white flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Background Lighting */}
      <div
        className="absolute top-0 right-1/4 w-[750px] h-[500px] rounded-full pointer-events-none blur-[160px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(96, 173, 217, 0.4) 0%, rgba(76, 109, 139, 0.2) 50%, transparent 70%)',
        }}
      />

      {/* Top Header */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
          <Logo variant="light" size="md" showTagline={false} />
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="relative z-20 max-w-2xl w-full mx-auto px-4 py-8">
        <div className="bg-[#0E151A]/90 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          
          {/* Step Progress Tracker */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10 text-xs">
            {[
              { num: 1, label: 'Personal Info' },
              { num: 2, label: 'Location' },
              { num: 3, label: 'Preferences' },
              { num: 4, label: 'Review' },
            ].map((s) => {
              const isCurrent = step === s.num;
              const isPast = step > s.num;
              return (
                <div key={s.num} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${
                      isCurrent
                        ? 'bg-[#60ADD9] text-[#070B0D] shadow-md shadow-[#60ADD9]/20'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 text-gray-500 border border-white/5'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span
                    className={`hidden sm:inline font-semibold ${
                      isCurrent ? 'text-white' : isPast ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-1 mb-6">
                <h2 className="font-heading text-2xl font-extrabold text-white">
                  Personal Information
                </h2>
                <p className="text-xs text-gray-400">
                  Confirm your legal identity for verified test drives and ownership transfer paperwork.
                </p>
              </div>

              {/* Profile Photograph (Supabase Storage) */}
              <div className="flex justify-center pb-2">
                <ProfilePhotoUpload
                  currentPhotoUrl={profilePhotoUrl}
                  onPhotoUploaded={(url) => setProfilePhotoUrl(url)}
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Anand Sharma"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9]"
                  />
                </div>
              </div>

              {/* Email (Read-only verified) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Registered Email Address (Verified)
                </label>
                <input
                  type="email"
                  readOnly
                  disabled
                  value={user?.email || profile?.email || ''}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-gray-400 cursor-not-allowed select-none"
                />
              </div>

              {/* Mobile (Read-only verified) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Verified Mobile Number
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={profile?.phoneNumber || '+91 - Verified'}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-gray-400 cursor-not-allowed select-none"
                />
              </div>

              {/* Action */}
              <div className="pt-4 flex justify-end">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleNextStep1}
                  className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Location
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-1 mb-6">
                <h2 className="font-heading text-2xl font-extrabold text-white">
                  Your Location
                </h2>
                <p className="text-xs text-gray-400">
                  We use your location to calculate doorstep test drive availability and RTO registration zones.
                </p>
              </div>

              {/* State & District Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    State / UT *
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedDistrict('');
                      setCity('');
                    }}
                    className="w-full px-4 py-3 bg-[#070B0D] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#60ADD9] cursor-pointer"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES_AND_DISTRICTS.map((s) => (
                      <option key={s.state} value={s.state}>
                        {s.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      const f = availableDistricts.find((d) => d.name === e.target.value);
                      if (f && f.majorCities.length > 0) {
                        setCity(f.majorCities[0]);
                      }
                    }}
                    disabled={!selectedState}
                    className="w-full px-4 py-3 bg-[#070B0D] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#60ADD9] disabled:opacity-40 cursor-pointer"
                  >
                    <option value="">Select District</option>
                    {availableDistricts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City & PIN Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    City or Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Coimbatore, Andheri"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 641001"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] font-mono"
                  />
                </div>
              </div>

              {/* Complete Address */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Complete Street Address (Optional)
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, Street name, Landmark (used for doorstep test drives)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] resize-none"
                />
              </div>

              {/* Navigation */}
              <div className="pt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setStep(1)}
                  className="border-white/10 text-white"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleNextStep2}
                  className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Preferences
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: BUYING PREFERENCES */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-1 mb-6">
                <h2 className="font-heading text-2xl font-extrabold text-white">
                  Buying Preferences
                </h2>
                <p className="text-xs text-gray-400">
                  Customize your feed. You can skip any field and update preferences anytime in Settings.
                </p>
              </div>

              {/* Preferred Brands */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Preferred Brands
                </label>
                <div className="flex flex-wrap gap-2">
                  {brandOptions.map((brand) => {
                    const isSelected = preferredBrands.includes(brand);
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => toggleBrand(brand)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-[#60ADD9] border-[#60ADD9] text-[#070B0D] shadow-md shadow-[#60ADD9]/20'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Body Types */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Preferred Body Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {bodyTypeOptions.map((bt) => {
                    const isSelected = preferredBodyTypes.includes(bt);
                    return (
                      <button
                        key={bt}
                        type="button"
                        onClick={() => toggleBodyType(bt)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-[#60ADD9] border-[#60ADD9] text-[#070B0D]'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        {bt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fuel & Transmission */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Fuel Types
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {fuelTypeOptions.map((f) => {
                      const isSelected = preferredFuelTypes.includes(f);
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => toggleFuel(f)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-[#60ADD9] border-[#60ADD9] text-[#070B0D]'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                          }`}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Transmission
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {transmissionOptions.map((t) => {
                      const isSelected = preferredTransmission.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTransmission(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-[#60ADD9] border-[#60ADD9] text-[#070B0D]'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Budget Range (INR ₹)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">Min Price</label>
                    <select
                      value={minBudget}
                      onChange={(e) => setMinBudget(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#070B0D] border border-white/10 rounded-xl text-xs text-white"
                    >
                      {PRICE_MIN_OPTIONS.filter((o) => o.value).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">Max Price</label>
                    <select
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#070B0D] border border-white/10 rounded-xl text-xs text-white"
                    >
                      {PRICE_MAX_OPTIONS.filter((o) => o.value).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setStep(2)}
                  className="border-white/10 text-white"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleNextStep3}
                  className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Review & Finalize
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-1 mb-6">
                <h2 className="font-heading text-2xl font-extrabold text-white">
                  Review Your Profile
                </h2>
                <p className="text-xs text-gray-400">
                  Please verify your information before entering the buyer platform.
                </p>
              </div>

              {/* Review Cards */}
              <div className="space-y-4">
                
                {/* Personal Section */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Personal Details
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[11px] text-[#60ADD9] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                  <p className="text-sm font-bold text-white">{fullName}</p>
                  <p className="text-xs text-gray-400">{user?.email || profile?.email}</p>
                  <p className="text-xs text-gray-400">{profile?.phoneNumber || '+91 Mobile Verified'}</p>
                </div>

                {/* Location Section */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Location
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-[11px] text-[#60ADD9] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {city}, {selectedDistrict ? `${selectedDistrict}, ` : ''}{selectedState}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">PIN: {pinCode}</p>
                  {address && <p className="text-xs text-gray-400">{address}</p>}
                </div>

                {/* Preferences Summary */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Preferences
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-[11px] text-[#60ADD9] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                  <p className="text-xs text-gray-300">
                    <strong className="text-white">Brands:</strong>{' '}
                    {preferredBrands.length > 0 ? preferredBrands.join(', ') : 'All brands'}
                  </p>
                  <p className="text-xs text-gray-300">
                    <strong className="text-white">Body Types:</strong>{' '}
                    {preferredBodyTypes.length > 0 ? preferredBodyTypes.join(', ') : 'All body types'}
                  </p>
                  <p className="text-xs text-gray-300">
                    <strong className="text-white">Fuel:</strong>{' '}
                    {preferredFuelTypes.length > 0 ? preferredFuelTypes.join(', ') : 'Any fuel'}
                  </p>
                  <p className="text-xs text-gray-300">
                    <strong className="text-white">Budget:</strong> ₹{(minBudget / 100000).toFixed(1)}L – ₹{(maxBudget / 100000).toFixed(1)}L
                  </p>
                </div>

              </div>

              {/* Navigation */}
              <div className="pt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setStep(3)}
                  className="border-white/10 text-white"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  onClick={handleSubmitOnboarding}
                  className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-bold text-xs uppercase tracking-wider px-10 py-3.5 rounded-xl shadow-lg shadow-[#60ADD9]/20"
                  rightIcon={!loading ? <CheckCircle2 className="w-4 h-4" /> : undefined}
                >
                  {loading ? 'Finalizing Profile...' : 'Complete Onboarding & Enter Dashboard'}
                </Button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} REVORA Technologies Inc. Your buyer profile is protected under strict privacy safeguards.</p>
      </footer>

    </div>
  );
}

export default function BuyerOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070B0D] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#60ADD9] border-t-transparent animate-spin" />
        </div>
      }
    >
      <BuyerOnboardingContent />
    </Suspense>
  );
}
