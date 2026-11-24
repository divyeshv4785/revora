'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, Phone, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import {
  loginWithEmail,
  formatIndianPhoneNumber,
  setupPhoneRecaptcha,
  sendPhoneOtpCode,
  setActiveConfirmationResult,
} from '@/lib/firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/common/Toast';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const tabParam = searchParams.get('tab');
  const { showToast } = useToast();
  const { isConfigured } = useAuth();

  const [activeTab, setActiveTab] = useState<'email' | 'phone'>(tabParam === 'phone' ? 'phone' : 'email');

  // Email form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // Phone OTP state
  const [rawPhone, setRawPhone] = useState('');
  const [phoneSending, setPhoneSending] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Switch tab if query param changes
  useEffect(() => {
    if (tabParam === 'phone') {
      setActiveTab('phone');
    }
  }, [tabParam]);

  // Handle Email + Password Submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await loginWithEmail(identifier.trim(), password);
      showToast('Welcome back!', 'Successfully signed in to REVORA.', 'success');
      router.push(redirectUrl);
    } catch (err: any) {
      console.error('Login error:', err);
      let message = 'Failed to sign in. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please verify your details.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Access temporarily disabled due to multiple failed login attempts. Try again later or reset password.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Phone OTP Dispatch
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = formatIndianPhoneNumber(rawPhone);
    if (!validation.isValid) {
      setError(validation.errorMessage || 'Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setPhoneSending(true);

    try {
      const verifier = setupPhoneRecaptcha('recaptcha-login-container', 'invisible');
      const confirmation = await sendPhoneOtpCode(validation.formatted, verifier);
      setActiveConfirmationResult(confirmation, validation.formatted);
      showToast('OTP Dispatched', `6-digit verification code sent to ${validation.display}`, 'info');
      router.push(`/verify-otp?phone=${encodeURIComponent(validation.formatted)}&redirect=${encodeURIComponent(redirectUrl)}`);
    } catch (err: any) {
      console.error('Phone OTP error:', err);
      setError(err.message || 'Failed to dispatch OTP code. Please check your network and phone number.');
    } finally {
      setPhoneSending(false);
    }
  };

  return (
    <div className="bg-[#0E151A]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      
      {/* Invisible reCAPTCHA Anchor for Phone Auth */}
      <div id="recaptcha-login-container" />

      {/* Card Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#60ADD9]">
          <ShieldCheck className="w-3.5 h-3.5" />
          SECURE ACCESS PORTAL
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Sign In to REVORA
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xs mx-auto">
          Access verified vehicle inspections, seller contacts, and real-time saved alerts.
        </p>
      </div>

      {/* Auth Method Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab('email');
            setError(null);
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === 'email'
              ? 'bg-[#60ADD9] text-[#070B0D] shadow-lg shadow-[#60ADD9]/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email & Password</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('phone');
            setError(null);
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === 'phone'
              ? 'bg-[#60ADD9] text-[#070B0D] shadow-lg shadow-[#60ADD9]/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Mobile OTP</span>
        </button>
      </div>

      {!isConfigured && (
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Firebase Preview Mode:</strong> Connect your Firebase project in <code>.env.local</code> to activate live cloud authentication.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {activeTab === 'email' ? (
        /* Email + Password Form */
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#60ADD9] hover:text-[#8ED2F5] transition-colors font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9] transition-all"
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

          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-[#60ADD9] focus:ring-[#60ADD9] w-4 h-4 cursor-pointer"
              />
              <span>Remember this device</span>
            </label>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-heading font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-[#60ADD9]/20"
              rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {loading ? 'Signing In...' : 'Sign In to Account'}
            </Button>
          </div>
        </form>
      ) : (
        /* Mobile Number OTP Form */
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Indian Mobile Number
            </label>
            <div className="relative flex">
              <div className="flex items-center gap-1.5 px-3.5 bg-white/10 border border-white/10 border-r-0 rounded-l-xl text-xs font-bold text-gray-200 select-none">
                <span className="text-sm">🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                required
                autoFocus
                maxLength={10}
                placeholder="98765 43210"
                value={rawPhone}
                onChange={(e) => setRawPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-3 pr-4 py-3 bg-white/5 border border-white/10 rounded-r-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9] transition-all font-mono tracking-wider"
              />
            </div>
            <p className="mt-2 text-[11px] text-gray-400 flex items-center gap-1.5">
              <span>We will dispatch a secure 6-digit one-time password via SMS.</span>
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={phoneSending || rawPhone.length !== 10}
              className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-heading font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-[#60ADD9]/20"
              rightIcon={!phoneSending ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {phoneSending ? 'Dispatching OTP SMS...' : 'Send Verification OTP'}
            </Button>
          </div>
        </form>
      )}

      {/* Footer Navigation */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-xs text-gray-400">
          New to REVORA?{' '}
          <Link
            href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-bold text-[#60ADD9] hover:text-[#8ED2F5] transition-colors ml-1"
          >
            Create Free Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#070B0D] text-white flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Ambient Lighting */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full pointer-events-none blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(96, 173, 217, 0.4) 0%, rgba(76, 109, 139, 0.2) 50%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-10 w-[500px] h-[400px] rounded-full pointer-events-none blur-[140px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(76, 109, 139, 0.3) 0%, transparent 60%)',
        }}
      />

      {/* Top Bar with Return to Home */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
          <Logo variant="light" size="md" showTagline={false} />
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors py-2 px-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>
      </header>

      {/* Main Authentication Card wrapped in Suspense */}
      <main className="relative z-20 max-w-md w-full mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="bg-[#0E151A]/90 border border-white/10 rounded-3xl p-12 text-center text-white">
              <div className="w-8 h-8 border-2 border-[#60ADD9] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Loading Sign In...</p>
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </main>

      {/* Footer Copyright */}
      <footer className="relative z-20 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} REVORA Technologies Inc. India’s Certified Pre-Owned Automotive Marketplace.</p>
      </footer>

    </div>
  );
}
