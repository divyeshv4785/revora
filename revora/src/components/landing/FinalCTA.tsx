'use client';

import React from 'react';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Logo } from '@/components/common/Logo';

interface FinalCTAProps {
  onCreateAccount: () => void;
  onExploreRevora: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  onCreateAccount,
  onExploreRevora,
}) => {
  return (
    <section className="py-24 bg-revora-dark text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-revora-steel/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-10 w-72 h-72 bg-revora-sky/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-8">
        
        <div className="flex justify-center">
          <Logo variant="light" size="lg" showTagline={true} />
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Ready for Your Next Journey?
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            Join REVORA to discover quality used cars or connect with buyers interested in your vehicle.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            variant="accent"
            size="lg"
            onClick={onCreateAccount}
            className="w-full sm:w-auto font-bold shadow-xl shadow-revora-sky/20 px-8"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Your Account
          </Button>

          <Button
            variant="dark"
            size="lg"
            onClick={onExploreRevora}
            className="w-full sm:w-auto border-white/20 bg-white/10 hover:bg-white/15 px-8"
            leftIcon={<Compass className="w-4 h-4 text-revora-sky" />}
          >
            Explore REVORA
          </Button>
        </div>

        {/* Supporting microcopy */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-revora-success" />
            Zero Spam • Bank-Grade Security
          </span>
          <span>Verified Indian Dealership Network</span>
          <span>No Obligation Free Browsing</span>
        </div>

      </div>
    </section>
  );
};
