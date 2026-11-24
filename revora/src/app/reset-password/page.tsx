'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { executePasswordReset } from '@/lib/firebase/auth';
import { useToast } from '@/components/common/Toast';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const { showToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!oobCode) {
      setError('Invalid or expired password reset link. Please request a new link.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await executePasswordReset(oobCode, password);
      setSuccess(true);
      showToast('Password Updated', 'Your new password is now active. Please sign in.', 'success');
    } catch (err: any) {
      console.error('Execute reset error:', err);
      let msg = 'Failed to reset password. The recovery link may have expired.';
      if (err.code === 'auth/expired-action-code') {
        msg = 'This password reset link has expired. Please request a new one.';
      } else if (err.code === 'auth/invalid-action-code') {
        msg = 'Invalid action code. The link may have already been used.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
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
          
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#60ADD9]">
              <ShieldCheck className="w-3.5 h-3.5" />
              CREATE NEW PASSWORD
            </div>
            <h1 className="font-heading text-2xl font-extrabold text-white">
              Set New Password
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xs mx-auto">
              Choose a strong, unique password for your REVORA account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold text-white">
                  Password Successfully Changed
                </h3>
                <p className="text-xs text-gray-300">
                  Your credentials have been updated securely. You can now log in with your new password.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#60ADD9]/20"
                >
                  <span>Sign In Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9]"
                  />
                </div>
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
                  {loading ? 'Updating Password...' : 'Save New Password'}
                </Button>
              </div>
            </form>
          )}

        </div>
      </main>

      <footer className="relative z-20 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} REVORA Technologies Inc.</p>
      </footer>

    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070B0D] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#60ADD9] border-t-transparent animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
