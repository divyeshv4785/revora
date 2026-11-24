'use client';

import React from 'react';
import { Building2, ArrowRight, ShieldCheck, BarChart3, Users2, Globe2 } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface DealerCTAProps {
  onRegisterDealership: () => void;
}

export const DealerCTA: React.FC<DealerCTAProps> = ({ onRegisterDealership }) => {
  return (
    <section className="py-20 bg-white border-t border-revora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-revora-mainBg via-white to-revora-steel/5 border border-revora-border shadow-card flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-revora-steel/10 text-revora-steel text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              Dealership Partner Program
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-revora-textPrimary tracking-tight leading-tight">
              Grow Your Dealership with REVORA.
            </h2>

            <p className="text-base text-revora-textSecondary leading-relaxed">
              Bring your inventory online, manage your vehicle listings and connect with potential buyers across India.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2 text-xs font-medium text-revora-textPrimary">
                <Globe2 className="w-4 h-4 text-revora-steel" />
                <span>Nationwide Discovery</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-revora-textPrimary">
                <BarChart3 className="w-4 h-4 text-revora-steel" />
                <span>Multi-Branch CRM Hub</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-revora-textPrimary">
                <Users2 className="w-4 h-4 text-revora-steel" />
                <span>High-Intent Leads Only</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-start gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={onRegisterDealership}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto py-3.5 px-7"
            >
              Register Your Dealership
            </Button>
            <p className="text-[11px] text-revora-textSecondary text-center sm:text-left">
              Verification takes 24–48 hours for authorized dealers
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
