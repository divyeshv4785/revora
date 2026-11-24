import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  variant?: 'light' | 'dark';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  variant = 'light',
  className = '',
}) => {
  const isDark = variant === 'dark';
  const isCenter = align === 'center';

  return (
    <div
      className={`max-w-3xl ${isCenter ? 'mx-auto text-center' : 'text-left'} ${className}`}
    >
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 ${
          isDark
            ? 'bg-revora-sky/10 text-revora-sky border border-revora-sky/20'
            : 'bg-revora-steel/10 text-revora-steel border border-revora-steel/20'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {eyebrow}
        </div>
      )}

      <h2
        className={`font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.2] ${
          isDark ? 'text-white' : 'text-revora-textPrimary'
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed ${
            isDark ? 'text-gray-400' : 'text-revora-textSecondary'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
