'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  KeyRound,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Clock,
  Edit2,
  PhoneCall,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import {
  getActiveConfirmationResult,
  setActiveConfirmationResult,
  confirmPhoneOtpSignIn,
  verifyAndLinkPhoneOtp,
  setupPhoneRecaptcha,
  sendPhoneOtpCode,
  formatIndianPhoneNumber,
  clearActiveConfirmationResult,
} from '@/lib/firebase/auth';
import { ensureUserProfileDocument, markUserPhoneVerified } from '@/lib/firebase/firestore';
import { useToast } from '@/components/common/Toast';
import { ConfirmationResult } from 'firebase/auth';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const paramPhone = searchParams.get('phone') || '';

  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState(paramPhone);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // 6 digit array for input cells
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [cooldown, setCooldown] = useState(60);
  const [expiresIn, setExpiresIn] = useState(120);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing confirmation result from session/window
  useEffect(() => {
    const active = getActiveConfirmationResult();
    if (active.result) {
      setConfirmationResult(active.result);
    }
    if (active.phone) {
      setPhoneNumber(active.phone);
    } else if (paramPhone) {
      setPhoneNumber(paramPhone);
    }
  }, [paramPhone]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Expiry countdown timer
  useEffect(() => {
    if (expiresIn > 0) {
      const timer = setTimeout(() => setExpiresIn((e) => e - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [expiresIn]);

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      // Clear current box
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    // If pasted multiple digits
    if (cleanVal.length > 1) {
      handlePasteDigits(cleanVal);
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleanVal;
    setOtpDigits(updated);

    // Auto move focus to next input
    if (index < 5 && cleanVal) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace and arrow navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Paste of complete 6-digit code
  const handlePasteDigits = (pasted: string) => {
    const digits = pasted.replace(/\D/g, '').slice(0, 6).split('');
    const updated = ['', '', '', '', '', ''];
    digits.forEach((d, i) => {
      updated[i] = d;
    });
    setOtpDigits(updated);

    const nextIndex = Math.min(digits.length, 5);
    digitInputRefs.current[nextIndex]?.focus();
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return;
    setError(null);

    const validation = formatIndianPhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setError('Invalid mobile number. Please go back and re-enter your mobile number.');
      return;
    }

    setResending(true);

    try {
      const verifier = setupPhoneRecaptcha('otp-recaptcha-container', 'invisible');
      const newResult = await sendPhoneOtpCode(validation.formatted, verifier);
      setConfirmationResult(newResult);
      setActiveConfirmationResult(newResult, validation.formatted);
      setCooldown(60);
      setExpiresIn(120);
      setOtpDigits(['', '', '', '', '', '']);
      digitInputRefs.current[0]?.focus();
      showToast('OTP Dispatched', `New 6-digit code sent to ${validation.display}`, 'info');
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Verify OTP Code
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullCode = otpDigits.join('');

    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of the OTP verification code.');
      return;
    }

    if (expiresIn <= 0) {
      setError('This verification code has expired. Please click Resend OTP below to request a new code.');
      return;
    }

    if (!confirmationResult) {
      setError('No active verification session found. Please request a new OTP.');
      return;
    }

    setVerifying(true);

    try {
      if (user) {
        // Authenticated user (e.g. following email registration/verification)
        // LINK phone credential to maintain the exact same Firebase UID!
        await verifyAndLinkPhoneOtp(user, confirmationResult.verificationId, fullCode);
        await markUserPhoneVerified(user.uid);
        await refreshProfile();

        clearActiveConfirmationResult();
        showToast('Phone Verified!', 'Your mobile number is now linked to your REVORA account.', 'success');
        router.push(`/onboarding?redirect=${encodeURIComponent(redirectUrl)}`);
      } else {
        // Unauthenticated guest user (e.g. logging in from /login Mobile OTP tab)
        // Sign in directly
        const authedUser = await confirmPhoneOtpSignIn(confirmationResult, fullCode);
        const profile = await ensureUserProfileDocument(authedUser);
        await refreshProfile();

        clearActiveConfirmationResult();
        showToast(
          'Authentication Successful!',
          `Welcome to REVORA${profile?.fullName ? `, ${profile.fullName}` : ''}.`,
          'success'
        );

        if (!profile || !profile.onboardingCompleted) {
          router.push(`/onboarding?redirect=${encodeURIComponent(redirectUrl)}`);
        } else {
          router.push(redirectUrl);
        }
      }
    } catch (err: any) {
      console.error('Verify error:', err);
      let msg = err.message || 'Incorrect verification code. Please check and try again.';
      if (
        err.code === 'auth/credential-already-in-use' ||
        err.code === 'auth/account-exists-with-different-credential'
      ) {
        msg =
          'This mobile number is already linked to another REVORA account. Please use a different mobile number or sign in directly with this mobile number.';
      }
      setError(msg);
    } finally {
      setVerifying(false);
    }
  };

  const formattedDisplayPhone = formatIndianPhoneNumber(phoneNumber).display || phoneNumber || 'your Indian mobile';
  const fullCode = otpDigits.join('');
  const minutes = Math.floor(expiresIn / 60);
  const seconds = expiresIn % 60;
  const formattedExpiry = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="bg-[#0E151A]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      
      {/* Invisible reCAPTCHA Anchor */}
      <div id="otp-recaptcha-container" />

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#60ADD9]">
          <ShieldCheck className="w-3.5 h-3.5" />
          PHONE OTP VERIFICATION
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Enter Verification Code
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xs mx-auto">
          We sent a 6-digit one-time password via SMS to:
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono font-semibold">
          <span>{formattedDisplayPhone}</span>
          <Link
            href="/login?tab=phone"
            className="text-[#60ADD9] hover:text-[#8ED2F5] transition-colors inline-flex items-center gap-1 text-[11px]"
            title="Change phone number"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* OTP Form */}
      <form onSubmit={handleVerify} className="space-y-6">
        
        {/* 6 Individual Digit Cells */}
        <div>
          <label className="block text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
            6-Digit Security Code
          </label>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  digitInputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                autoFocus={idx === 0}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedData = e.clipboardData.getData('text');
                  handlePasteDigits(pastedData);
                }}
                className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border transition-all outline-none ${
                  digit
                    ? 'bg-[#60ADD9]/10 border-[#60ADD9] text-white shadow-lg shadow-[#60ADD9]/10'
                    : 'bg-white/5 border-white/10 text-white placeholder-transparent focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Timers & Resend Actions */}
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>
              Expires in:{' '}
              <strong className={expiresIn <= 30 ? 'text-red-400 font-mono font-bold' : 'text-white font-mono font-bold'}>
                {formattedExpiry}
              </strong>
            </span>
          </div>

          <button
            type="button"
            disabled={cooldown > 0 || resending}
            onClick={handleResendOtp}
            className={`inline-flex items-center gap-1.5 font-semibold transition-colors ${
              cooldown > 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-[#60ADD9] hover:text-[#8ED2F5] hover:underline cursor-pointer'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            <span>{cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}</span>
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={verifying || fullCode.length !== 6 || expiresIn <= 0}
            className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-heading font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-[#60ADD9]/20"
            rightIcon={!verifying ? <CheckCircle2 className="w-4 h-4" /> : undefined}
          >
            {verifying ? 'Verifying OTP Code...' : 'Verify & Continue'}
          </Button>
        </div>

      </form>

      {/* Back to Login Footer */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Other Sign In Options</span>
        </Link>
      </div>

    </div>
  );
}

export default function VerifyOtpPage() {
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

      {/* Header */}
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

      {/* Main Content */}
      <main className="relative z-20 max-w-md w-full mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="bg-[#0E151A]/90 border border-white/10 rounded-3xl p-12 text-center text-white">
              <div className="w-8 h-8 border-2 border-[#60ADD9] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Loading Verification...</p>
            </div>
          }
        >
          <VerifyOtpContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} REVORA Technologies Inc. SMS gateway secured by Google Firebase Auth.</p>
      </footer>

    </div>
  );
}
