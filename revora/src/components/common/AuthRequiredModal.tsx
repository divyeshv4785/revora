'use client';

import React, { useState } from 'react';
import { X, Lock, ShieldCheck, ArrowRight, User, Building2, Car, Smartphone, Mail, Key } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './Button';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionTitle?: string;
  actionDescription?: string;
  initialMode?: 'login' | 'register';
  initialRole?: 'buyer' | 'seller' | 'dealer';
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  actionTitle = 'Join REVORA to Access Complete Marketplace',
  actionDescription = 'Create a free account or sign in to view detailed inspection reports, contact sellers directly, schedule test drives, and save favorite vehicles.',
  initialMode = 'login',
  initialRole = 'buyer',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [role, setRole] = useState<'buyer' | 'seller' | 'dealer'>(initialRole);
  
  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length <= 1) {
      const newOtp = [...otpCode];
      newOtp[index] = val;
      setOtpCode(newOtp);
      // Auto-focus next input
      if (val && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOtpSent(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-revora-dark p-6 text-white relative overflow-hidden">
          {/* Subtle geometric background glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-revora-steel/30 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-revora-sky/20 rounded-full blur-xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex items-center gap-3 mb-4">
            <Logo variant="light" size="sm" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-revora-sky uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3" />
              Authentication Required
            </div>
            <h3 className="text-xl font-heading font-bold text-white leading-snug">
              {actionTitle}
            </h3>
            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
              {actionDescription}
            </p>
          </div>
        </div>

        {/* Tab switch between Sign In and Register */}
        <div className="flex border-b border-gray-100 bg-gray-50/60 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setOtpSent(false);
            }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-revora-textPrimary shadow-sm'
                : 'text-revora-textSecondary hover:text-revora-textPrimary'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setOtpSent(false);
            }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-revora-textPrimary shadow-sm'
                : 'text-revora-textSecondary hover:text-revora-textPrimary'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          
          {/* Method selector: Phone OTP vs Email */}
          <div className="flex items-center justify-center gap-4 mb-5 pb-3 border-b border-gray-100">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setOtpSent(false);
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold pb-1 border-b-2 transition-all ${
                authMethod === 'phone'
                  ? 'border-revora-steel text-revora-steel'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile OTP (Recommended)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setOtpSent(false);
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold pb-1 border-b-2 transition-all ${
                authMethod === 'email'
                  ? 'border-revora-steel text-revora-steel'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Password</span>
            </button>
          </div>

          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-revora-textSecondary uppercase tracking-wider mb-2">
                I want to join REVORA as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    role === 'buyer'
                      ? 'border-revora-steel bg-revora-steel/5 text-revora-steel font-semibold'
                      : 'border-gray-200 text-revora-textSecondary hover:border-gray-300'
                  }`}
                >
                  <User className="w-4 h-4 mx-auto mb-1 text-revora-steel" />
                  <span className="text-[11px] block">Car Buyer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    role === 'seller'
                      ? 'border-revora-steel bg-revora-steel/5 text-revora-steel font-semibold'
                      : 'border-gray-200 text-revora-textSecondary hover:border-gray-300'
                  }`}
                >
                  <Car className="w-4 h-4 mx-auto mb-1 text-revora-steel" />
                  <span className="text-[11px] block">Car Owner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('dealer')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    role === 'dealer'
                      ? 'border-revora-steel bg-revora-steel/5 text-revora-steel font-semibold'
                      : 'border-gray-200 text-revora-textSecondary hover:border-gray-300'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-revora-steel" />
                  <span className="text-[11px] block">Dealership</span>
                </button>
              </div>
            </div>
          )}

          {authMethod === 'phone' ? (
            !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-revora-textSecondary mb-1">
                    Enter Indian Mobile Number (+91)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-revora-steel"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    We will send a 6-digit one-time password (OTP) via SMS for verification.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Verification OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <p className="text-xs text-revora-textSecondary">
                    Enter the 6-digit code sent to <strong className="text-revora-textPrimary">+91 {phoneNumber}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-xs text-revora-steel hover:underline"
                  >
                    Change mobile number
                  </button>
                </div>

                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-10 h-12 text-center font-heading font-bold text-lg bg-gray-50 border border-gray-200 rounded-xl focus:border-revora-steel focus:outline-none focus:ring-1 focus:ring-revora-steel"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                {submitted ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-semibold text-emerald-700 animate-fade-in flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verifying OTP with backend & issuing JWT session...</span>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Verify & Proceed
                  </Button>
                )}

                <p className="text-[11px] text-center text-gray-400">
                  Resend OTP in <span className="font-semibold text-revora-textPrimary">28s</span>
                </p>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-revora-textSecondary mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-revora-steel focus:ring-1 focus:ring-revora-steel"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-revora-textSecondary">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset placeholder for next phase.')}
                      className="text-xs text-revora-steel hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-revora-steel focus:ring-1 focus:ring-revora-steel"
                />
              </div>

              {submitted ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-semibold text-emerald-700 animate-fade-in flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticating with FastAPI backend...</span>
                </div>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="mt-2"
                >
                  {mode === 'login' ? 'Sign In to REVORA' : 'Register with REVORA'}
                </Button>
              )}
            </form>
          )}

          {/* Trust footer info */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-revora-textSecondary">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-revora-success" />
              Argon2id & JWT Encrypted
            </span>
            <span>FastAPI + PostgreSQL Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
