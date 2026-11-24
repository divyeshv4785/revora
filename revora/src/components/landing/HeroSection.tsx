'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronDown, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

interface HeroSectionProps {
  onExploreCars: () => void;
  onSellCar: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCars,
  onSellCar,
}) => {
  return (
    <section
      id="home"
      className="relative w-full min-h-[calc(100vh-80px)] lg:min-h-[880px] lg:h-[calc(100vh-80px)] lg:max-h-[1020px] bg-[#070B0D] text-white overflow-hidden flex items-center select-none pt-20 lg:pt-0"
    >
      {/* =========================================================================
          1. FULL-BLEED CINEMATIC HERO CANVAS (Seamless 2560x1280 Studio Environment)
          Single continuous composition — Zero image borders, Zero container boxes
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <Image
          src="/images/revora-hero-cinematic-canvas.jpg"
          alt="Audi R8 V10 in Brilliant White - Front Three-Quarter View"
          fill
          priority
          className="object-cover object-right md:object-[75%_center] lg:object-center"
          sizes="100vw"
        />
        {/* Subtle atmospheric vignette overlay to guarantee perfect text contrast on left */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[52%] bg-gradient-to-r from-[#070B0D] via-[#070B0D]/80 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070B0D] via-[#070B0D]/60 to-transparent pointer-events-none z-10" />
      </div>

      {/* =========================================================================
          2. MAIN RESPONSIVE FOREGROUND CONTAINER
          ========================================================================= */}
      <div className="relative max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 w-full h-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 py-8 lg:py-0 z-20">
        
        {/* ---------------------------------------------------------------------
            LEFT COLUMN: Editorial Typography & Actions
            --------------------------------------------------------------------- */}
        <div className="w-full lg:w-[48%] xl:w-[44%] flex flex-col justify-center text-left space-y-7 z-30 shrink-0">
          
          {/* Brand Intro Badge without blinking dot */}
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md w-fit">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#60ADD9]">
              INDIA&apos;S PREMIUM USED-CAR MARKETPLACE
            </span>
          </div>

          {/* Oversized Editorial Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] font-extrabold tracking-tight leading-[1.04] text-white">
            Find the Car <br />
            <span className="text-white">That Moves </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60ADD9] via-[#8ED2F5] to-white drop-shadow-[0_0_40px_rgba(96,173,217,0.5)]">
              You.
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-300/90 font-normal leading-relaxed max-w-lg">
            Discover quality used cars from trusted individual sellers and verified dealerships across India. Your next journey starts here.
          </p>

          {/* Dual Call-to-Action Buttons */}
          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              type="button"
              onClick={onExploreCars}
              className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-heading font-bold text-xs sm:text-sm tracking-wider uppercase px-9 py-4 rounded-xl shadow-[0_0_30px_rgba(96,173,217,0.3)] hover:shadow-[0_0_45px_rgba(96,173,217,0.5)] transition-all duration-300 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>EXPLORE CARS</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={onSellCar}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/25 hover:border-white/50 font-heading font-semibold text-xs sm:text-sm tracking-wider uppercase px-9 py-4 rounded-xl backdrop-blur-md transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              SELL YOUR CAR
            </button>
          </div>

          {/* Supporting Tagline & Quick Trust Bar */}
          <div className="pt-2 flex flex-col space-y-2">
            <p className="text-xs italic tracking-wide text-gray-400">
              Your next journey starts with REVORA.
            </p>

            {/* Quick Metrics Bar on Desktop */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-6 text-[11px] text-gray-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#60ADD9]" />
                <span>200+ Point Inspection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Direct Sellers</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#BACACD]" />
                <span>Clear Title Guarantee</span>
              </div>
            </div>
          </div>

        </div>

        {/* ---------------------------------------------------------------------
            RIGHT COLUMN: Clean open space allowing the Audi R8 visual to breathe
            --------------------------------------------------------------------- */}
        <div className="w-full lg:w-[52%] xl:w-[56%] h-full pointer-events-none" />

      </div>

      {/* =========================================================================
          3. BOTTOM DISCOVER CUE & CURVED TRANSITION
          ========================================================================= */}
      
      {/* Centered Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
        <button
          type="button"
          onClick={onExploreCars}
          className="flex flex-col items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-gray-400 hover:text-[#60ADD9] transition-colors focus:outline-none group cursor-pointer"
          aria-label="Discover cars"
        >
          <span className="font-semibold text-[11px] tracking-[0.2em] group-hover:tracking-[0.25em] transition-all">
            DISCOVER
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#60ADD9]" />
        </button>
      </div>

      {/* Elegant Curved Transition to White Section Below */}
      <div className="absolute bottom-0 inset-x-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-6 sm:h-10 lg:h-12 text-[#FAFAFA] fill-current"
          preserveAspectRatio="none"
        >
          <path d="M0,48 C480,12 960,12 1440,48 L1440,48 L0,48 Z" />
        </svg>
      </div>

    </section>
  );
};
