'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check, Sparkles, PlusCircle, Car, Building2, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfileDocument } from '@/lib/firebase/firestore';
import { UserRole } from '@/types/auth';
import { useToast } from '@/components/common/Toast';

export const BuyerRoleSwitcher: React.FC = () => {
  const { user, profile, activeRole, roles, refreshProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = async (role: UserRole) => {
    setIsOpen(false);
    if (!user || role === activeRole) return;

    try {
      await updateUserProfileDocument(user.uid, { activeRole: role });
      await refreshProfile();
      showToast('Workspace Switched', `Switched view to ${formatRoleName(role)}.`, 'info');

      if (role === 'buyer') {
        router.push('/buyer/dashboard');
      } else if (role === 'individual_seller') {
        router.push('/seller/dashboard');
      } else if (role === 'dealer_owner') {
        router.push('/dealer/dashboard');
      }
    } catch (err) {
      console.error('Error switching role:', err);
    }
  };

  const formatRoleName = (role: UserRole): string => {
    switch (role) {
      case 'buyer':
        return 'Car Buyer';
      case 'individual_seller':
        return 'Individual Seller';
      case 'dealer_owner':
        return 'Dealership Partner';
      case 'dealer_employee':
        return 'Dealership Staff';
      case 'admin':
      case 'super_admin':
        return 'REVORA Admin';
      default:
        return 'Member';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'buyer':
        return <Car className="w-3.5 h-3.5 text-[#60ADD9]" />;
      case 'individual_seller':
        return <UserIcon className="w-3.5 h-3.5 text-emerald-400" />;
      case 'dealer_owner':
        return <Building2 className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const availableRoles = profile?.selectedRoles || roles || ['buyer'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs font-semibold text-white"
        aria-label="Switch Marketplace Role"
      >
        <div className="flex items-center gap-1.5">
          {getRoleIcon(activeRole)}
          <span className="text-[#60ADD9] font-bold uppercase tracking-wider text-[11px]">
            {formatRoleName(activeRole)}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0E151A] border border-white/10 shadow-2xl backdrop-blur-xl py-2 z-50 animate-fade-in">
          <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/5">
            Switch Marketplace Role
          </div>

          <div className="py-1">
            {availableRoles.map((r) => {
              const isActive = r === activeRole;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors text-left ${
                    isActive ? 'bg-white/10 text-white font-bold' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getRoleIcon(r)}
                    <span>{formatRoleName(r)}</span>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-[#60ADD9]" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-white/5 pt-1 mt-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push('/onboarding');
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <PlusCircle className="w-3.5 h-3.5 text-gray-400" />
              <span>Add / Unlock Other Roles</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
