'use client';

import React, { useState } from 'react';
import {
  Search,
  Scale,
  MessageSquare,
  KeyRound,
  UserCheck,
  FileCheck2,
  BadgeCheck,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';

interface HowItWorksProps {
  onRequireAuth: (action: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onRequireAuth }) => {
  const [activeTab, setActiveTab] = useState<'buyers' | 'sellers'>('buyers');

  const buyerSteps = [
    {
      step: '01',
      title: 'Discover Cars',
      tagline: 'Explore Available Vehicles',
      description:
        'Browse curated listings with high-resolution imagery, verified ownership history, and accurate technical specifications across India.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Compare',
      tagline: 'Evaluate Vehicles and Prices',
      description:
        'Contrast mileage, fuel economy, fair market valuation, and independent multi-point inspection scores side-by-side.',
      icon: Scale,
    },
    {
      step: '03',
      title: 'Connect',
      tagline: 'Contact Sellers and Dealerships',
      description:
        'Initiate verified chat inquiries or request secure callback channels with car owners and accredited dealership fleet managers.',
      icon: MessageSquare,
    },
    {
      step: '04',
      title: 'Experience',
      tagline: 'Arrange a Test Drive',
      description:
        'Schedule a doorstep or showroom test drive, conduct pre-purchase verification, and finalize your purchase with peace of mind.',
      icon: KeyRound,
    },
  ];

  const sellerSteps = [
    {
      step: '01',
      title: 'Register',
      tagline: 'Create an Individual Seller Account',
      description:
        'Set up your verified seller profile in under two minutes with simple mobile OTP confirmation and vehicle ownership details.',
      icon: UserCheck,
    },
    {
      step: '02',
      title: 'List Your Car',
      tagline: 'Submit Vehicle Information and Images',
      description:
        'Upload your vehicle details, variant, odometer reading, and crisp exterior/interior photos via our guided listing assistant.',
      icon: FileCheck2,
    },
    {
      step: '03',
      title: 'Verification',
      tagline: 'Submit the Listing for Review',
      description:
        'Our automotive valuation and verification team audits documentation and vehicle history to award your listing the REVORA Verified badge.',
      icon: BadgeCheck,
    },
    {
      step: '04',
      title: 'Connect',
      tagline: 'Receive Enquiries from Buyers',
      description:
        'Engage directly with genuine buyers, manage test-drive appointments, and sell at true market value without paying hefty dealer commissions.',
      icon: PhoneCall,
    },
  ];

  const currentSteps = activeTab === 'buyers' ? buyerSteps : sellerSteps;

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          eyebrow="Frictionless Marketplace Workflow"
          title="How REVORA Works"
          description="Designed to offer maximum clarity and convenience whether you are purchasing your dream vehicle or selling an existing car in India."
          align="center"
          className="mb-10"
        />

        {/* Tab Toggle */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex p-1.5 rounded-2xl bg-gray-100 border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('buyers')}
              className={`px-6 py-2.5 rounded-xl font-heading text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'buyers'
                  ? 'bg-revora-steel text-white shadow-md'
                  : 'text-revora-textSecondary hover:text-revora-textPrimary'
              }`}
            >
              For Car Buyers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sellers')}
              className={`px-6 py-2.5 rounded-xl font-heading text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'sellers'
                  ? 'bg-revora-steel text-white shadow-md'
                  : 'text-revora-textSecondary hover:text-revora-textPrimary'
              }`}
            >
              For Car Sellers
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative p-6 sm:p-7 rounded-3xl bg-revora-mainBg border border-revora-border hover:border-revora-steel/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Step number badge & icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-heading font-bold text-xs text-revora-steel shadow-sm">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-revora-steel/10 text-revora-steel flex items-center justify-center group-hover:bg-revora-steel group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="text-[11px] font-semibold text-revora-steel uppercase tracking-wider mb-1">
                    Step {index + 1}
                  </p>
                  <h3 className="font-heading text-lg font-bold text-revora-textPrimary mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-revora-textSecondary mb-3">
                    {step.tagline}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs font-semibold text-revora-steel">
                  <span>{activeTab === 'buyers' ? 'Discover more' : 'Start step'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="mt-12 text-center">
          <Button
            variant="secondary"
            size="md"
            onClick={() =>
              onRequireAuth(
                activeTab === 'buyers'
                  ? 'Access Buyer Marketplace Features'
                  : 'Start Your Free Seller Listing'
              )
            }
          >
            {activeTab === 'buyers'
              ? 'Get Started as a Buyer'
              : 'Register to Sell Your Car Free'}
          </Button>
        </div>

      </div>
    </section>
  );
};
