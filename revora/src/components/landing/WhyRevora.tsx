'use client';

import React from 'react';
import { Users, FileText, CalendarCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/common/SectionHeading';

export const WhyRevora: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Trusted Sellers',
      description:
        'Connect with verified individual car owners and accredited dealerships through a unified, structured marketplace designed to eliminate untrusted middlemen.',
      badge: 'Rigorous Verification',
    },
    {
      icon: FileText,
      title: 'Transparent Vehicle Information',
      description:
        'Explore detailed vehicle specifications, service ownership chronology, genuine odometer readings, and certified inspection reports without hidden surprises.',
      badge: 'Unbiased Reports',
    },
    {
      icon: CalendarCheck,
      title: 'Easy Connections',
      description:
        'Connect directly with car owners or dealership fleet managers to schedule contactless doorstep test drives and direct price consultations with zero hassle.',
      badge: 'Seamless Process',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Dealerships',
      description:
        'Discover premier dealerships that have completed the platform’s rigorous verification process, ensuring high-standard documentation and clear title transfer.',
      badge: 'Formal Audits',
    },
  ];

  return (
    <section className="py-24 bg-revora-dark text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-revora-steel/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-revora-sky/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <SectionHeading
          eyebrow="The REVORA Standard"
          title="A Better Way to Buy and Sell Cars."
          description="We are re-engineering the Indian pre-owned automotive journey with unmatched transparency, verified provenance, and seamless direct connections."
          align="center"
          variant="dark"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-3xl p-8 bg-gradient-to-b from-[#121B22] to-[#0A0F13] border border-white/10 hover:border-revora-sky/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Icon & Counter */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-revora-steel/20 border border-revora-steel/30 flex items-center justify-center text-revora-sky group-hover:bg-revora-sky group-hover:text-revora-dark transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="font-heading text-sm font-mono text-gray-500">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Badge */}
                  <div className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-revora-sky mb-3">
                    {feature.badge}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-revora-sky group-hover:text-white transition-colors">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
