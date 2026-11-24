'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Car,
  User as UserIcon,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { completeUserOnboarding } from '@/lib/firebase/firestore';
import { useToast } from '@/components/common/Toast';
import { UserRole } from '@/types/auth';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleOptions: {
    id: UserRole;
    title: string;
    badge: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
  }[] = [
    {
      id: 'buyer',
      title: 'Car Buyer',
      badge: 'Most Popular',
      icon: <Car className="w-6 h-6 text-[#60ADD9]" />,
      description: 'Explore verified pre-owned cars across India, schedule doorstep test drives, and view comprehensive 200-point inspection findings.',
      features: [
        'Explore verified multi-brand inventory',
        'Direct chat with genuine verified owners',
        'Book doorstep test drives & inspections',
        'Save favorites and price drop alerts',
      ],
    },
    {
      id: 'individual_seller',
      title: 'Individual Car Owner',
      badge: 'Free Listing',
      icon: <UserIcon className="w-6 h-6 text-emerald-400" />,
      description: 'Sell your car at true market value. Connect directly with genuine verified buyers nationwide with free doorstep valuation.',
      features: [
        '100% free listing with zero broker fees',
        'Free 200-point inspection & valuation report',
        'Verified direct buyer inquiries only',
        'Assisted title transfer & RC handover guidance',
      ],
    },
    {
      id: 'dealer_owner',
      title: 'Used-Car Dealership',
      badge: 'Certified Network',
      icon: <Building2 className="w-6 h-6 text-amber-400" />,
      description: 'Expand your dealership branch reach nationwide. Manage multi-branch inventory and receive certified buyer leads.',
      features: [
        'Multi-branch certified inventory manager',
        'Verified dealership badge on all listings',
        'High-intent qualified buyer leads',
        'Dedicated account manager & CRM sync',
      ],
    },
  ];

  const handleComplete = async () => {
    if (!user) {
      setError('Please sign in to complete onboarding.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await completeUserOnboarding(user.uid, selectedRole);
      await refreshProfile();
      showToast('Role Selected!', `Proceeding to ${selectedRole === 'buyer' ? 'Buyer Profile' : selectedRole === 'individual_seller' ? 'Seller' : 'Dealership'} Setup.`, 'success');
      
      if (selectedRole === 'buyer') {
        router.push('/buyer/onboarding');
      } else if (selectedRole === 'individual_seller') {
        router.push('/seller/onboarding');
      } else if (selectedRole === 'dealer_owner') {
        router.push('/dealer/onboarding');
      } else {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setError(err.message || 'Failed to complete profile onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B0D] text-white flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Background Glows */}
      <div
        className="absolute top-0 right-1/4 w-[700px] h-[450px] rounded-full pointer-events-none blur-[150px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(96, 173, 217, 0.4) 0%, rgba(76, 109, 139, 0.2) 50%, transparent 70%)',
        }}
      />

      {/* Header */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
          <Logo variant="light" size="md" showTagline={false} />
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-20 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="bg-[#0E151A]/90 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#60ADD9]">
              <Sparkles className="w-3.5 h-3.5" />
              WELCOME TO REVORA
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Select Your Primary Role
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
              How would you like to use REVORA today? You can easily add more roles or apply for dealership certification at any time.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {roleOptions.map((opt) => {
              const isSelected = selectedRole === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedRole(opt.id)}
                  className={`relative rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/[0.08] border-[#60ADD9] shadow-xl shadow-[#60ADD9]/10 ring-1 ring-[#60ADD9]'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div>
                    {/* Top Icon & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {opt.icon}
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-gray-300 border border-white/5">
                        {opt.badge}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white mb-2">
                      {opt.title}
                    </h3>

                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                      {opt.description}
                    </p>
                  </div>

                  {/* Feature Bullets */}
                  <div className="pt-4 border-t border-white/10 space-y-2 text-[11px] text-gray-300">
                    {opt.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? 'text-[#60ADD9]' : 'text-gray-500'}`} />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Radio indicator */}
                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? 'text-[#60ADD9]' : 'text-gray-400'}>
                      {isSelected ? 'Selected Role' : 'Click to Select'}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#60ADD9] bg-[#60ADD9]' : 'border-gray-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#070B0D]" />}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="pt-4 text-center">
            <Button
              variant="primary"
              size="lg"
              disabled={loading}
              onClick={handleComplete}
              className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-heading font-bold text-xs uppercase tracking-wider px-10 py-4 rounded-xl shadow-lg shadow-[#60ADD9]/25"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Finalizing Profile...' : 'Complete Onboarding & Enter REVORA'}
            </Button>
          </div>

        </div>
      </main>

      <footer className="relative z-20 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} REVORA Technologies Inc. Multi-vendor roles can be switched in Account Settings.</p>
      </footer>

    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070B0D] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#60ADD9] border-t-transparent animate-spin" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
