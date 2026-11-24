'use client';

import React from 'react';
import { Settings, Lock, Bell, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';

export default function BuyerSettingsPage() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-white/10 pb-5">
        <h1 className="font-heading text-2xl font-bold text-white">Settings & Security</h1>
        <p className="text-xs text-gray-400 mt-1">Manage security, active sessions, and communication preferences.</p>
      </div>

      <div className="space-y-4">
        {/* Security Box */}
        <div className="p-6 rounded-3xl bg-[#0E151A]/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#60ADD9]" />
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Password & Authentication
            </h3>
          </div>
          <p className="text-xs text-gray-400">
            Authenticated via verified Firebase credentials: <strong className="text-white">{user?.email}</strong>
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/forgot-password')}
            className="border-white/10 text-xs text-gray-300 hover:text-white"
          >
            Change Account Password
          </Button>
        </div>

        {/* Sessions & Logout Box */}
        <div className="p-6 rounded-3xl bg-[#0E151A]/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-amber-400" />
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Active Sessions
            </h3>
          </div>
          <p className="text-xs text-gray-400">
            Sign out of this browser session to protect your marketplace account.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-red-500/20 text-xs text-red-400 hover:bg-red-500/10"
          >
            Sign Out of REVORA
          </Button>
        </div>
      </div>
    </div>
  );
}
