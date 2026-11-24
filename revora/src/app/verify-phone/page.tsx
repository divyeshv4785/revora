'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Phone,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Clock,
  Edit2,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import {
  setupPhoneRecaptcha,
  sendPhoneOtpCode,
  verifyAndLinkPhoneOtp,
  confirmPhoneOtpSignIn,
  formatIndianPhoneNumber,
  setActiveConfirmationResult,
  getActiveConfirmationResult,
  clearActiveConfirmationResult,
} from '@/lib/firebase/auth';
import { markUserPhoneVerified, ensureUserProfileDocument } from '@/lib/firebase/firestore';
import { useToast } from '@/components/common/Toast';
import { ConfirmationResult } from 'firebase/auth';

function VerifyPhoneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [rawPhone, setRawPhone] = useState('');
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // 6 digit array for input cells
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [cooldown, setCooldown] = useState(0);
  const [expiresIn, setExpiresIn] = useState(120);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill phone if user profile has one
  useEffect(() => {
    if (profile?.phoneNumber) {
      const formatted = profile.phoneNumber.replace(/^\+91/, '');
      setRawPhone(formatted);
    }
  }, [profile]);

  // Timers
  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  useEffect(() => {
    if (step === 'verify' && expiresIn > 0) {
      const t = setTimeout(() => setExpiresIn((e) => e - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, expiresIn]);

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    if (cleanVal.length > 1) {
      handlePasteDigits(cleanVal);
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleanVal;
    setOtpDigits(updated);

    if (index < 5 && cleanVal) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

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

  // Send OTP
  const handleSendOtp = async () => {
    setError(null);
    const validation = formatIndianPhoneNumber(rawPhone);
    if (!validation.isValid) {
      setError(validation.errorMessage || 'Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setSending(true);

    try {
      const verifier = setupPhoneRecaptcha('phone-recaptcha-container', 'invisible');
      const result = await sendPhoneOtpCode(validation.formatted, verifier);
      setConfirmationResult(result);
      setActiveConfirmationResult(result, validation.formatted);
      setStep('verify');
      setCooldown(60);
      setExpiresIn(120);
      setOtpDigits(['', '', '', '', '', '']);
      showToast('OTP Dispatched', `6-digit verification code sent to ${validation.display}`, 'info');
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to dispatch OTP code. Please check your network and phone number.');
    } finally {
      setSending(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullCode = otpDigits.join('');

    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }

    if (expiresIn <= 0) {
      setError('The OTP code has expired. Please click Resend OTP.');
      return;
    }

    if (!confirmationResult) {
      setError('Verification session expired. Please request a new OTP.');
      return;
    }

    setVerifying(true);

    try {
      if (user) {
        // Authenticated user: LINK phone credential to existing Firebase account!
        await verifyAndLinkPhoneOtp(user, confirmationResult.verificationId, fullCode);
        await markUserPhoneVerified(user.uid);
      } else {
        // Unauthenticated guest user: sign in directly
        const authedUser = await confirmPhoneOtpSignIn(confirmationResult, fullCode);
        await ensureUserProfileDocument(authedUser);
      }

      await refreshProfile();
      clearActiveConfirmationResult();
      showToast('Mobile Verified!', 'Your mobile number is now officially verified and linked.', 'success');
      router.push(`/onboarding?redirect=${encodeURIComponent(redirectUrl)}`);
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      let msg = err.message || 'Verification failed. Please check the OTP code.';
      if (
        err.code === 'auth/credential-already-in-use' ||
        err.code === 'auth/account-exists-with-different-credential'
      ) {
        msg =
          'This mobile number is already linked to another REVORA account. Please enter a different mobile number or sign in directly with this mobile number.';
      }
      setError(msg);
    } finally {
      setVerifying(false);
    }
  };

  const validation = formatIndianPhoneNumber(rawPhone);
  const fullCode = otpDigits.join('');
  const minutes = Math.floor(expiresIn / 60);
  const seconds = expiresIn % 60;
  const formattedExpiry = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="min-h-screen bg-[#070B0D] text-white flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Background Lighting */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full pointer-events-none blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(96, 173, 217, 0.4) 0%, rgba(76, 109, 139, 0.2) 50%, transparent 70%)',
        }}
      />

      {/* Invisible reCAPTCHA Anchor */}
      <div id="phone-recaptcha-container" />

      {/* Header */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
          <Logo variant="light" size="md" showTagline={false} />
        </Link>
      </header>

      {/* Main Card */}
      <main className="relative z-20 max-w-md w-full mx-auto px-4 py-8">
        <div className="bg-[#0E151A]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          
          {/* Step Tracker */}
          <div className="flex items-center justify-center gap-2 mb-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              1. Email Verified
            </span>
            <span className="text-gray-600">→</span>
            <span className="text-[#60ADD9] flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-[#60ADD9] text-[#070B0D] flex items-center justify-center text-[10px]">2</span>
              Phone OTP
            </span>
            <span className="text-gray-600">→</span>
            <span className="text-gray-500">3. Role Selection</span>
          </div>

          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#60ADD9]/10 border border-[#60ADD9]/20 text-[#60ADD9] flex items-center justify-center mx-auto shadow-lg shadow-[#60ADD9]/10">
              <Phone className="w-7 h-7" />
            </div>

            <h1 className="font-heading text-2xl font-extrabold text-white">
              {step === 'send' ? 'Verify Mobile Number' : 'Enter 6-Digit OTP'}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xs mx-auto">
              {step === 'send'
                ? 'Enter your Indian mobile number. We will send a secure one-time password to verify and link your account.'
                : `Enter the 6-digit code sent via SMS to ${validation.display || rawPhone}.`}
            </p>

            {step === 'verify' && (
              <button
                type="button"
                onClick={() => setStep('send')}
                className="inline-flex items-center gap-1 text-[11px] text-[#60ADD9] hover:text-[#8ED2F5] transition-colors mt-1 font-semibold"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change Mobile Number</span>
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'send' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Indian Mobile Number
                </label>
                <div className="relative flex">
                  <div className="flex items-center gap-1.5 px-3.5 bg-white/10 border border-white/10 border-r-0 rounded-l-xl text-xs font-bold text-gray-200 select-none">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    autoFocus
                    maxLength={10}
                    value={rawPhone}
                    onChange={(e) => setRawPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-3 pr-4 py-3 bg-white/5 border border-white/10 rounded-r-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9] font-mono tracking-wider"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-gray-400">
                  SMS verification OTP will be dispatched via Google Firebase.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={sending || rawPhone.length !== 10}
                  onClick={handleSendOtp}
                  className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-heading font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-[#60ADD9]/20"
                  rightIcon={!sending ? <ArrowRight className="w-4 h-4" /> : undefined}
                >
                  {sending ? 'Sending OTP SMS...' : 'Send Verification OTP'}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                  6-Digit Verification Code
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
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
                      className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold rounded-xl border transition-all outline-none ${
                        digit
                          ? 'bg-[#60ADD9]/10 border-[#60ADD9] text-white shadow-lg shadow-[#60ADD9]/10'
                          : 'bg-white/5 border-white/10 text-white placeholder-transparent focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9]'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-400 px-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span>
                      Expires in:{' '}
                      <strong className={expiresIn < 30 ? 'text-red-400 font-mono' : 'text-white font-mono'}>
                        {formattedExpiry}
                      </strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={cooldown > 0 || sending}
                    onClick={handleSendOtp}
                    className={`inline-flex items-center gap-1 font-semibold ${
                      cooldown > 0
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-[#60ADD9] hover:underline cursor-pointer'
                    }`}
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${sending ? 'animate-spin' : ''}`} />
                    <span>{cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend OTP'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={verifying || fullCode.length !== 6 || expiresIn <= 0}
                  className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-heading font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-[#60ADD9]/20"
                  rightIcon={!verifying ? <CheckCircle2 className="w-4 h-4" /> : undefined}
                >
                  {verifying ? 'Verifying & Linking...' : 'Verify & Continue'}
                </Button>
              </div>
            </form>
          )}

          {/* Footnote */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-400">
              Need assistance?{' '}
              <a href="mailto:support@revora.in" className="text-[#60ADD9] hover:underline">
                Contact REVORA Verification Support
              </a>
            </p>
          </div>

        </div>
      </main>

      <footer className="relative z-20 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} REVORA Technologies Inc. SMS gateway secured by Firebase Auth.</p>
      </footer>

    </div>
  );
}

export default function VerifyPhonePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070B0D] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#60ADD9] border-t-transparent animate-spin" />
        </div>
      }
    >
      <VerifyPhoneContent />
    </Suspense>
  );
}
