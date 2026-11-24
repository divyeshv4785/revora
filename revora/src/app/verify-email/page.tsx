'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { resendVerificationEmail } from '@/lib/firebase/auth';
import { markUserEmailVerified } from '@/lib/firebase/firestore';
import { useToast } from '@/components/common/Toast';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { user, profile, refreshProfile, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Check email verification status
  const handleCheckStatus = async () => {
    if (!user) {
      setError('Please sign in to verify your email address.');
      return;
    }

    setChecking(true);
    setError(null);

    try {
      await user.reload();
      if (user.emailVerified) {
        await markUserEmailVerified(user.uid);
        await refreshProfile();
        showToast('Email Verified!', 'Proceeding to mobile OTP verification.', 'success');
        router.push(`/verify-phone?redirect=${encodeURIComponent(redirectUrl)}`);
      } else {
        setError('Email is not yet verified. Please click the link sent to your inbox, then click Check Status.');
      }
    } catch (err: any) {
      console.error('Check email error:', err);
      setError(err.message || 'Failed to refresh verification status.');
    } finally {
      setChecking(false);
    }
  };

  // Resend email
  const handleResendEmail = async () => {
    if (!user) return;
    setResending(true);
    setError(null);

    try {
      await resendVerificationEmail(user);
      setCooldown(60);
      showToast('Verification Email Sent', `Sent a new link to ${user.email}`, 'info');
    } catch (err: any) {
      console.error('Resend error:', err);
      setError(err.message || 'Failed to resend email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B0D] text-white flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Background Lighting */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full pointer-events-none blur-[140px] opacity-25"
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
      <main className="relative z-20 max-w-md w-full mx-auto px-4 py-8">
        <div className="bg-[#0E151A]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          
          {/* Step Tracker */}
          <div className="flex items-center justify-center gap-2 mb-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <span className="text-[#60ADD9] flex items-center gap-1 font-semibold">
              <span className="w-5 h-5 rounded-full bg-[#60ADD9] text-[#070B0D] flex items-center justify-center text-[10px] font-bold">1</span>
              Email Verification
            </span>
            <span className="text-gray-600">→</span>
            <span className="text-gray-500">2. Phone OTP</span>
            <span className="text-gray-600">→</span>
            <span className="text-gray-500">3. Role Selection</span>
          </div>

          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#60ADD9]/10 border border-[#60ADD9]/20 text-[#60ADD9] flex items-center justify-center mx-auto shadow-lg shadow-[#60ADD9]/10">
              <Mail className="w-7 h-7" />
            </div>

            <h1 className="font-heading text-2xl font-extrabold text-white">
              Verify Your Email Address
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              We sent a verification link to{' '}
              <strong className="text-white font-semibold">
                {user?.email || profile?.email || 'your registered email'}
              </strong>
              . Please open your inbox and click the verification link.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={checking}
              onClick={handleCheckStatus}
              className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-heading font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-[#60ADD9]/20"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {checking ? 'Checking Status...' : 'I Have Clicked the Verification Link'}
            </Button>

            <button
              type="button"
              disabled={cooldown > 0 || resending}
              onClick={handleResendEmail}
              className={`w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider border border-white/10 transition-colors flex items-center justify-center gap-2 ${
                cooldown > 0
                  ? 'bg-white/5 text-gray-500 border-white/5 cursor-not-allowed'
                  : 'bg-white/5 hover:bg-white/10 text-white cursor-pointer'
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>
                {cooldown > 0 ? `Resend Link in ${cooldown}s` : 'Resend Verification Email'}
              </span>
            </button>
          </div>

          {/* Info footnote */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-400">
              Need to use another email or mobile?{' '}
              <Link href="/register" className="font-bold text-[#60ADD9] hover:underline ml-1">
                Register Again
              </Link>
            </p>
          </div>

        </div>
      </main>

      <footer className="relative z-20 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} REVORA Technologies Inc.</p>
      </footer>

    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070B0D] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#60ADD9] border-t-transparent animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
