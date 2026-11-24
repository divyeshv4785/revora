import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const isLight = variant === 'light';

  // Sizing styles
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg tracking-[0.2em]',
    md: 'text-xl tracking-[0.22em]',
    lg: 'text-2xl tracking-[0.25em]',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Minimalist Automotive Emblem: Dynamic aerodynamic vertex evoking precision & forward motion */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Subtle outer diamond-arc precision contour */}
          <path
            d="M20 4L34 16L20 36L6 16L20 4Z"
            stroke={isLight ? '#60ADD9' : '#4C6D8B'}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-40"
          />
          {/* Inner dynamic dual-apex automotive wings symbolizing acceleration and precision */}
          <path
            d="M13 22L20 12L27 22"
            stroke={isLight ? '#FFFFFF' : '#111214'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 26L20 20L24 26"
            stroke={isLight ? '#60ADD9' : '#4C6D8B'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central jewel dot */}
          <circle
            cx="20"
            cy="16"
            r="1.25"
            fill={isLight ? '#60ADD9' : '#4C6D8B'}
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <span
          className={`font-heading font-extrabold leading-none uppercase ${textSizes[size]} ${
            isLight ? 'text-white' : 'text-revora-textPrimary'
          }`}
        >
          REVORA
        </span>
        {showTagline && (
          <span
            className={`text-[9px] font-medium tracking-[0.24em] uppercase mt-1 ${
              isLight ? 'text-revora-muted' : 'text-revora-textSecondary'
            }`}
          >
            Discover • Compare • Drive
          </span>
        )}
      </div>
    </div>
  );
};
