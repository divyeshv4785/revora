'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { registerWithEmail } from '@/lib/firebase/auth';
import { createUserProfileDocument } from '@/lib/firebase/firestore';
import { useToast } from '@/components/common/Toast';
import { useAuth } from '@/hooks/useAuth';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { showToast } = useToast();
  const { isConfigured } = useAuth();

  // Form Fields (Step 1: Create Account)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Strength Criteria
  const passwordCriteria = useMemo(() => {
    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const isPasswordStrong =
    passwordCriteria.length &&
    passwordCriteria.upper &&
    passwordCriteria.lower &&
    passwordCriteria.number;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 3) {
      setError('Please provide your full legal name (at least 3 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isPasswordStrong) {
      setError('Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreeToTerms) {
      setError('You must accept the REVORA Marketplace Terms of Service and Privacy Policy to continue.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Firebase Authentication Account & Trigger Verification Email
      const user = await registerWithEmail(email.trim(), password, fullName.trim());

      // 2. Initialize Base User Profile in Firestore
      await createUserProfileDocument(user.uid, {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: '',
        emailVerified: false,
        phoneVerified: false,
        selectedRoles: ['buyer'],
        roles: ['buyer'],
        activeRole: 'buyer',
        accountStatus: 'active',
        profileCompleted: false,
        onboardingCompleted: false,
        onboardingStatus: 'pending',
      });

      showToast(
        'Account Registered!',
        'Verification email sent. Please verify your email to continue.',
        'success'
      );

      // 3. Move to Step 2: Email Verification
      router.push(`/verify-email?redirect=${encodeURIComponent(redirectUrl)}`);
    } catch (err: any) {
      console.error('Registration error:', err);
      let message = 'Failed to create account. Please check your details.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'This email address is already in use. Please sign in instead.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Invalid email address format.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 8 characters with numbers and symbols.';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0E151A]/90 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#60ADD9]">
          <ShieldCheck className="w-3.5 h-3.5" />
          STEP 1: CREATE ACCOUNT
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Join REVORA Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
          Create your verified marketplace account. Connect with verified buyers, private sellers, and certified dealerships.
        </p>
      </div>

      {!isConfigured && (
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Firebase Preview Mode:</strong> Provide your Firebase credentials in <code>.env.local</code> to activate live cloud authentication.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              placeholder="e.g. Anand Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9] transition-all"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9] transition-all"
            />
          </div>
          <p className="mt-1 text-[11px] text-gray-400">
            We will send an activation and verification link to this email address.
          </p>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Password Strength Checklist */}
        {password && (
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] grid grid-cols-2 sm:grid-cols-4 gap-2">
            <span className={passwordCriteria.length ? 'text-emerald-400 flex items-center gap-1 font-semibold' : 'text-gray-500 flex items-center gap-1'}>
              <CheckCircle2 className="w-3.5 h-3.5" /> 8+ Characters
            </span>
            <span className={passwordCriteria.upper ? 'text-emerald-400 flex items-center gap-1 font-semibold' : 'text-gray-500 flex items-center gap-1'}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Uppercase
            </span>
            <span className={passwordCriteria.lower ? 'text-emerald-400 flex items-center gap-1 font-semibold' : 'text-gray-500 flex items-center gap-1'}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Lowercase
            </span>
            <span className={passwordCriteria.number ? 'text-emerald-400 flex items-center gap-1 font-semibold' : 'text-gray-500 flex items-center gap-1'}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Number
            </span>
          </div>
        )}

        {/* Terms and conditions */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 text-xs text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-[#60ADD9] focus:ring-[#60ADD9] w-4 h-4 mt-0.5 cursor-pointer"
            />
            <span>
              I agree to the{' '}
              <span className="text-[#60ADD9] underline">REVORA Terms of Service</span>,{' '}
              <span className="text-[#60ADD9] underline">Privacy Policy</span>, and marketplace verification guidelines.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
            className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-heading font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-[#60ADD9]/20"
            rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
          >
            {loading ? 'Creating Account & Sending Verification...' : 'Create Account'}
          </Button>
        </div>

      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-xs text-gray-400">
          Already have a REVORA account?{' '}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-bold text-[#60ADD9] hover:text-[#8ED2F5] transition-colors ml-1"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#070B0D] text-white flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Ambient Lighting */}
      <div
        className="absolute top-0 right-1/4 w-[650px] h-[450px] rounded-full pointer-events-none blur-[150px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(96, 173, 217, 0.4) 0%, rgba(76, 109, 139, 0.2) 50%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-10 left-10 w-[550px] h-[450px] rounded-full pointer-events-none blur-[150px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(76, 109, 139, 0.3) 0%, transparent 60%)',
        }}
      />

      {/* Top Header */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
          <Logo variant="light" size="md" showTagline={false} />
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors py-2 px-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <span>Already registered? Sign In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Registration Container wrapped in Suspense */}
      <main className="relative z-20 max-w-lg w-full mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="bg-[#0E151A]/90 border border-white/10 rounded-3xl p-12 text-center text-white">
              <div className="w-8 h-8 border-2 border-revora-sky border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Loading Registration...</p>
            </div>
          }
        >
          <RegisterFormContent />
        </Suspense>
      </main>

      <footer className="relative z-20 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} REVORA Technologies Inc. India’s Certified Pre-Owned Automotive Marketplace.</p>
      </footer>

    </div>
  );
}
