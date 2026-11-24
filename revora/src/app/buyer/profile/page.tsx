'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon, MapPin, Mail, Phone, ShieldCheck, Edit3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getBuyerProfile } from '@/lib/buyer/buyerService';
import { BuyerProfile } from '@/types/buyer';
import { ProfilePhotoUpload } from '@/components/profile/ProfilePhotoUpload';
import Link from 'next/link';

export default function BuyerProfilePage() {
  const { user, profile } = useAuth();
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | null>(null);

  useEffect(() => {
    if (user?.uid) {
      getBuyerProfile(user.uid).then(setBuyerProfile);
    }
  }, [user]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-white/10 pb-5 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">My Buyer Profile</h1>
          <p className="text-xs text-gray-400 mt-1">Manage your personal details, verified mobile, and delivery addresses.</p>
        </div>
        <Link
          href="/buyer/onboarding"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-[#60ADD9] border border-white/10 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Update Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details */}
        <div className="p-6 rounded-3xl bg-[#0E151A]/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gray-400">
              Identity & Contact
            </h3>
          </div>

          <div className="flex justify-center py-2">
            <ProfilePhotoUpload
              currentPhotoUrl={profile?.profilePhotoUrl || buyerProfile?.profilePhotoUrl}
            />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Full Legal Name</span>
              <span className="text-white font-semibold text-sm">{profile?.fullName || buyerProfile?.fullName || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Registered Email</span>
              <span className="text-white font-semibold flex items-center gap-1.5 mt-0.5">
                {user?.email}
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Verified Indian Mobile</span>
              <span className="text-white font-semibold flex items-center gap-1.5 mt-0.5 font-mono">
                {profile?.phoneNumber || '+91 - Not Verified'}
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="p-6 rounded-3xl bg-[#0E151A]/80 border border-white/10 space-y-4">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-white/5 pb-2">
            Location & Region
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">City / Town</span>
              <span className="text-white font-semibold">{buyerProfile?.city || profile?.city || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">State / Union Territory</span>
              <span className="text-white font-semibold">{buyerProfile?.state || profile?.state || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">PIN Code</span>
              <span className="text-white font-semibold font-mono">{buyerProfile?.pinCode || profile?.pinCode || '------'}</span>
            </div>
            {buyerProfile?.address && (
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Street Address</span>
                <span className="text-white font-semibold">{buyerProfile.address}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
