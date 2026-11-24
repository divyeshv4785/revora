'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface SellCarCTAProps {
  onStartSelling: () => void;
}

export const SellCarCTA: React.FC<SellCarCTAProps> = ({ onStartSelling }) => {
  return (
    <section id="sell-car" className="py-20 bg-revora-mainBg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-revora-dark text-white border border-white/10 shadow-2xl">
          
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-revora-steel/30 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-revora-sky/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-revora-sky uppercase tracking-wider border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                For Individual Car Owners
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                Your Car Deserves <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-revora-sky">
                  the Right Buyer.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl">
                List your vehicle on REVORA and connect with potential buyers looking for their next car.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-revora-success shrink-0" />
                  <span>Zero upfront listing fees for individuals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-revora-success shrink-0" />
                  <span>Free doorstep vehicle inspection & valuation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-revora-success shrink-0" />
                  <span>Direct negotiations with genuine buyers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-revora-success shrink-0" />
                  <span>Safe paperwork & RC transfer guidance</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={onStartSelling}
                  className="font-bold shadow-lg shadow-revora-sky/20"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Start Selling
                </Button>

                <div className="text-xs text-gray-400">
                  Takes less than 2 minutes to create a listing
                </div>
              </div>
            </div>

            {/* Right Card / Visual (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#121B21] p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-revora-sky/20 flex items-center justify-center text-revora-sky">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">Instant Valuation Preview</h4>
                      <p className="text-[11px] text-gray-400">Powered by India’s live market data</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-revora-success/20 text-revora-success text-[10px] font-bold">
                    Active
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400">Average Time to Sell</span>
                    <span className="text-white font-semibold">11 Days</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400">Price Realization</span>
                    <span className="text-revora-success font-semibold">12-18% Higher than Dealer Exchange</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400">Privacy Protection</span>
                    <span className="text-white font-semibold">Masked Contact & Verified Profiles</span>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-revora-sky shrink-0" />
                  <span>No random unsolicited calls. Only verified buyers can contact you.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
