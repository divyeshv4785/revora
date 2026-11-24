'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  ShieldCheck,
  Building2,
  User,
  Heart,
  Share2,
  Lock,
  Phone,
  MessageSquare,
  KeyRound,
  FileCheck2,
  AlertCircle,
  FileText,
  BadgeAlert,
  Car,
} from 'lucide-react';
import { Vehicle } from '@/types';
import { FORMAT_INR } from '@/data/mockData';
import { Button } from '@/components/common/Button';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onRequireAuth: (action: string) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onRequireAuth,
}) => {
  const [activeSpecTab, setActiveSpecTab] = useState<'declared' | 'verified'>('declared');

  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-gray-100 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vehicle Main Image Banner */}
        <div className="relative aspect-[16/9] w-full bg-revora-dark">
          <Image
            src={vehicle.image}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-revora-dark backdrop-blur-md shadow-sm">
              Illustrative Sample Listing
            </span>
            {vehicle.badge && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-revora-dark/80 text-white backdrop-blur-md border border-white/20">
                {vehicle.badge}
              </span>
            )}
            {vehicle.isVerified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                REVORA Inspected
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs font-semibold text-revora-sky uppercase tracking-wider">
              {vehicle.year} Model • {vehicle.location}
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              {vehicle.make} {vehicle.model}
            </h2>
            <p className="text-sm text-gray-300 font-medium">{vehicle.variant}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Price & Seller summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-revora-textSecondary font-semibold">
                Offered Price
              </p>
              <p className="font-heading text-3xl font-extrabold text-revora-textPrimary">
                {FORMAT_INR(vehicle.price)}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Excludes regional RTO transfer & insurance fee</p>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-revora-steel/10 flex items-center justify-center text-revora-steel">
                {vehicle.sellerType === 'Verified Dealership' ? (
                  <Building2 className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-revora-textPrimary">{vehicle.sellerName}</p>
                <p className="text-[11px] text-revora-textSecondary">{vehicle.sellerType}</p>
              </div>
            </div>
          </div>

          {/* Distinction: Seller-Declared vs Independently Verified Findings (Section 5.2 requirement) */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-revora-textSecondary">
                Vehicle Information & Findings
              </h4>
              <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveSpecTab('declared')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeSpecTab === 'declared'
                      ? 'bg-white text-revora-textPrimary shadow-sm'
                      : 'text-revora-textSecondary hover:text-revora-textPrimary'
                  }`}
                >
                  Seller-Declared Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSpecTab('verified')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeSpecTab === 'verified'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-revora-textSecondary hover:text-emerald-700'
                  }`}
                >
                  REVORA Verified Audit
                </button>
              </div>
            </div>

            {activeSpecTab === 'declared' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Odometer</span>
                    <span className="font-bold text-revora-textPrimary text-sm mt-0.5 block">
                      {vehicle.mileage.toLocaleString('en-IN')} km
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Fuel Type</span>
                    <span className="font-bold text-revora-textPrimary text-sm mt-0.5 block">
                      {vehicle.fuelType}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Transmission</span>
                    <span className="font-bold text-revora-textPrimary text-sm mt-0.5 block">
                      {vehicle.transmission}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Registered Year</span>
                    <span className="font-bold text-revora-textPrimary text-sm mt-0.5 block">
                      {vehicle.year}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
                  <FileText className="w-4 h-4 text-revora-steel shrink-0 mt-0.5" />
                  <span>
                    <strong>Seller-Declared Attributes:</strong> Kilometres driven, ownership count, and vehicle condition have been provided by the seller ({vehicle.sellerName}).
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-emerald-700 font-semibold block text-[10px] uppercase">Structural Integrity</span>
                    <span className="font-bold text-emerald-950 text-sm mt-0.5 block">No Accidental Damage</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-emerald-700 font-semibold block text-[10px] uppercase">Odometer Audit</span>
                    <span className="font-bold text-emerald-950 text-sm mt-0.5 block">Genuine & Service-Verified</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-emerald-700 font-semibold block text-[10px] uppercase">Title & Hypothecation</span>
                    <span className="font-bold text-emerald-950 text-sm mt-0.5 block">Clean RTO Title (NOC Ready)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Independent Verification:</strong> This vehicle has undergone REVORA’s comprehensive 180-point mechanical, electrical, and title audit.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Privacy & Protected Data Masking Notice (Section 5.2 & Section 7) */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-revora-textSecondary flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-revora-muted shrink-0 mt-0.5" />
            <span>
              <strong>Privacy Protection Policy:</strong> Sensitive registration certificates (RC), chassis numbers, engine serials, and seller direct phone numbers are securely masked in the public preview to prevent unauthorized scraping and identity fraud.
            </span>
          </div>

          {/* Gated Access Notice & Locked Features */}
          <div className="rounded-2xl p-5 bg-gradient-to-r from-gray-900 to-revora-dark text-white border border-white/10 shadow-lg space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-revora-sky/20 flex items-center justify-center text-revora-sky shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white">
                  Unlock Complete Vehicle History & Contact Seller
                </h4>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  Sign in or create a free REVORA account to access the 180-point inspection report, chassis records, service history, direct seller phone/chat, and schedule a test drive.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <Button
                variant="accent"
                size="md"
                fullWidth
                onClick={() => onRequireAuth(`Contact seller for ${vehicle.make} ${vehicle.model}`)}
                leftIcon={<Phone className="w-4 h-4" />}
                className="text-xs font-bold"
              >
                Contact Seller
              </Button>

              <Button
                variant="dark"
                size="md"
                fullWidth
                onClick={() => onRequireAuth(`Schedule test drive for ${vehicle.make} ${vehicle.model}`)}
                leftIcon={<KeyRound className="w-4 h-4 text-revora-sky" />}
                className="text-xs border-white/20 bg-white/10"
              >
                Book Test Drive
              </Button>

              <Button
                variant="dark"
                size="md"
                fullWidth
                onClick={() => onRequireAuth(`View 180-Point Inspection for ${vehicle.make} ${vehicle.model}`)}
                leftIcon={<FileCheck2 className="w-4 h-4 text-revora-sky" />}
                className="text-xs border-white/20 bg-white/10"
              >
                Full Inspection PDF
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
