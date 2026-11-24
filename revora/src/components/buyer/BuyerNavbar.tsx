'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  MapPin,
  User as UserIcon,
  LogOut,
  Settings,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { BuyerRoleSwitcher } from './BuyerRoleSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { LocationSelector } from '@/components/common/LocationSelector';
import { getBuyerNotifications } from '@/lib/buyer/notificationService';

interface BuyerNavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const BuyerNavbar: React.FC<BuyerNavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const router = useRouter();
  const { user, profile, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('All India');
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load unread notifications count
  useEffect(() => {
    if (user?.uid) {
      getBuyerNotifications(user.uid).then((notifs) => {
        const unread = notifs.filter((n) => !n.read).length;
        setUnreadCount(unread);
      });
    }
  }, [user]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buyer/explore?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/buyer/explore');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const initials = profile?.fullName
    ? profile.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-30 bg-[#070B0D]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle navigation drawer"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link href="/buyer/dashboard" className="flex items-center transition-opacity hover:opacity-90">
            <Logo variant="light" size="sm" showTagline={false} />
          </Link>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search make, model, variant, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#60ADD9] focus:ring-1 focus:ring-[#60ADD9] transition-all"
            />
          </form>
        </div>

        {/* Right: Location, Notifications, Role Switcher, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Location Selector */}
          <div className="hidden sm:block">
            <LocationSelector
              currentLocation={currentLocation}
              onSelectLocation={setCurrentLocation}
              variant="nav"
            />
          </div>

          {/* Notifications Icon */}
          <Link
            href="/buyer/notifications"
            className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#60ADD9] ring-2 ring-[#070B0D]" />
            )}
          </Link>

          {/* Role Switcher */}
          <BuyerRoleSwitcher />

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              aria-label="User Account Menu"
            >
              <div className="w-7 h-7 rounded-lg bg-[#60ADD9]/20 text-[#60ADD9] font-heading font-extrabold text-xs flex items-center justify-center">
                {initials}
              </div>
              <span className="hidden xl:inline-block text-xs font-semibold text-white max-w-[120px] truncate">
                {profile?.fullName || user?.email?.split('@')[0]}
              </span>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0E151A] border border-white/10 shadow-2xl backdrop-blur-xl py-2 z-50 animate-fade-in">
                
                {/* User Header */}
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-xs font-bold text-white truncate">
                    {profile?.fullName || 'REVORA Buyer'}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Buyer
                    </span>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="py-1">
                  <Link
                    href="/buyer/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span>My Buyer Profile</span>
                  </Link>

                  <Link
                    href="/buyer/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span>Settings & Security</span>
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                    <span>View Public Landing Page</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-white/5 pt-1 mt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
