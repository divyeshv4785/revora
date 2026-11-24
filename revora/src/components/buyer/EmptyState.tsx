'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-[#0E151A]/60 border border-white/5 backdrop-blur-md">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#60ADD9] mb-4 shadow-xl shadow-black/40">
        {icon}
      </div>

      <h3 className="font-heading text-lg font-bold text-white mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && actionHref && (
        <Link href={actionHref}>
          <Button
            variant="primary"
            size="md"
            className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl shadow-lg shadow-[#60ADD9]/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {actionText}
          </Button>
        </Link>
      )}

      {actionText && !actionHref && onAction && (
        <Button
          variant="primary"
          size="md"
          onClick={onAction}
          className="bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl shadow-lg shadow-[#60ADD9]/20"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
