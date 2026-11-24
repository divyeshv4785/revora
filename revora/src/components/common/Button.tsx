import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-heading font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-revora-steel text-white hover:bg-[#3D5870] active:bg-[#344B60] focus:ring-revora-steel/50 shadow-sm shadow-revora-steel/20',
    secondary:
      'bg-revora-muted/15 text-revora-steel hover:bg-revora-muted/25 active:bg-revora-muted/30 focus:ring-revora-muted/40',
    accent:
      'bg-revora-sky text-revora-dark font-bold hover:bg-[#4E9BC7] active:bg-[#428AB4] focus:ring-revora-sky/50 shadow-md shadow-revora-sky/20',
    outline:
      'border border-revora-border bg-white text-revora-textPrimary hover:bg-gray-50 hover:border-gray-300 focus:ring-revora-steel/30',
    dark:
      'bg-revora-dark text-white hover:bg-[#121B21] border border-white/10 focus:ring-white/20',
    ghost:
      'text-revora-textSecondary hover:text-revora-textPrimary hover:bg-gray-100/70 focus:ring-gray-300',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
