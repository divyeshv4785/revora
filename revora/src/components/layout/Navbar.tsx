'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, LogOut, User as UserIcon, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { LocationSelector } from '@/components/common/LocationSelector';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/common/Toast';

interface NavbarProps {
  onOpenAuth: (mode?: 'login' | 'register', role?: 'buyer' | 'seller' | 'dealer', title?: string) => void;
  currentLocation: string;
  onSelectLocation: (loc: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  currentLocation,
  onSelectLocation,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const { user, profile, isAuthenticated, isFullyVerified, activeRole, logout } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check current section for active indicator
      const sections = ['home', 'explore-cars', 'sell-car', 'dealerships', 'about-us'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Explore Cars', href: '#explore-cars', id: 'explore-cars' },
    { label: 'Sell Your Car', href: '#sell-car', id: 'sell-car' },
    { label: 'Dealerships', href: '#dealerships', id: 'dealerships' },
    { label: 'About Us', href: '#about-us', id: 'about-us' },
  ];

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Signed Out', 'You have been signed out of REVORA.', 'info');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav border-b border-white/10 shadow-lg py-3'
          : 'bg-revora-dark/80 backdrop-blur-md border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LEFT: REVORA Logo */}
          <div className="flex items-center">
            <a
              href="#home"
              onClick={(e) => handleNavClick('#home', e)}
              className="flex items-center transition-transform hover:opacity-90"
            >
              <Logo variant="light" size="md" showTagline={false} />
            </a>
          </div>

          {/* CENTRE: Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(link.href, e)}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase transition-all rounded-lg ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-revora-sky rounded-full animate-fade-in" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* RIGHT: Location Selector, Login, Sign Up OR User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            <LocationSelector
              currentLocation={currentLocation}
              onSelectLocation={onSelectLocation}
              variant="nav"
            />

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
                
                {/* Verification Warning pill if not verified */}
                {!isFullyVerified && (
                  <Link
                    href="/verify-email"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                  >
                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                    Verify Account
                  </Link>
                )}

                {/* User Identity Pill / Dashboard Link */}
                <Link
                  href={
                    activeRole === 'individual_seller'
                      ? '/seller/dashboard'
                      : activeRole === 'dealer_owner'
                      ? '/dealer/dashboard'
                      : '/buyer/dashboard'
                  }
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#60ADD9]/40 transition-colors text-xs"
                  title="Go to Dashboard"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#60ADD9]/20 text-[#60ADD9] flex items-center justify-center font-bold text-[11px]">
                    {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-xs leading-none">
                      {profile?.fullName || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-[#60ADD9] uppercase font-bold tracking-wider leading-none mt-1">
                      {activeRole === 'individual_seller' ? 'Seller Portal' : activeRole === 'dealer_owner' ? 'Dealer Portal' : 'Buyer Dashboard'} →
                    </p>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] shadow-md shadow-[#60ADD9]/20 transition-all"
                >
                  <span>Sign Up</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <LocationSelector
              currentLocation={currentLocation}
              onSelectLocation={onSelectLocation}
              variant="nav"
            />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(link.href, e)}
                className="px-3 py-2 text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-[#60ADD9]" />
                    <span className="text-sm font-semibold text-white">
                      {profile?.fullName || user?.email}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#60ADD9]/20 text-[#60ADD9]">
                    {activeRole}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={handleLogout}
                  className="border-white/20 text-white"
                  rightIcon={<LogOut className="w-4 h-4" />}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-white/10 text-white border border-white/10"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full py-2.5 text-center text-xs font-bold uppercase rounded-xl bg-[#60ADD9] text-[#070B0D]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
