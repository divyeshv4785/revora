'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  Scale,
  Heart,
  Bookmark,
  MessageSquare,
  CalendarCheck,
  FileCheck2,
  Clock,
  Bell,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface BuyerSidebarProps {
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const BuyerSidebar: React.FC<BuyerSidebarProps> = ({
  isOpenOnMobile,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      group: 'DISCOVER & EVALUATE',
      items: [
        { label: 'Overview', href: '/buyer/dashboard', icon: LayoutDashboard },
        { label: 'Explore Cars', href: '/buyer/explore', icon: Compass },
        { label: 'Compare Cars', href: '/buyer/compare', icon: Scale },
        { label: 'My Favourites', href: '/buyer/favourites', icon: Heart },
        { label: 'Saved Searches', href: '/buyer/saved-searches', icon: Bookmark },
      ],
    },
    {
      group: 'PURCHASE PIPELINE',
      items: [
        { label: 'My Enquiries', href: '/buyer/enquiries', icon: MessageSquare },
        { label: 'Test Drives', href: '/buyer/test-drives', icon: CalendarCheck },
        { label: 'Inspections & Reports', href: '/buyer/inspections', icon: FileCheck2 },
        { label: 'Recently Viewed', href: '/buyer/recently-viewed', icon: Clock },
      ],
    },
    {
      group: 'ACCOUNT & SYSTEM',
      items: [
        { label: 'Notifications', href: '/buyer/notifications', icon: Bell },
        { label: 'My Profile', href: '/buyer/profile', icon: User },
        { label: 'Settings', href: '/buyer/settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none">
      
      {/* Navigation Sections */}
      <div className="space-y-6">
        
        {/* Toggle Collapse Button (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-between px-3 pt-2">
          {!isCollapsed && (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Buyer Portal
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors ml-auto"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar width"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {navigationItems.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                {group.group}
              </h4>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#60ADD9]/10 text-white border border-[#60ADD9]/30 shadow-lg shadow-[#60ADD9]/5 font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#60ADD9]' : 'text-gray-400'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

      </div>

      {/* Bottom Promo Card */}
      {!isCollapsed && (
        <div className="p-3.5 mt-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-[#60ADD9] font-bold text-[11px] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>200-Point Inspected</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Every certified vehicle includes a verified mechanical, structural, and electrical audit report.
          </p>
        </div>
      )}

    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 h-[calc(100vh-61px)] sticky top-[61px] border-r border-white/10 bg-[#070B0D]/95 backdrop-blur-md p-4 transition-all duration-300 overflow-y-auto ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenOnMobile && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={onCloseMobile}
        >
          <div
            className="fixed inset-y-0 left-0 z-50 w-72 bg-[#070B0D] border-r border-white/10 p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
