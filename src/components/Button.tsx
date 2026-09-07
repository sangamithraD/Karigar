import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'warm';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'lg',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer shadow-sm';

  const sizeStyles = {
    sm: 'min-h-[40px] px-4 py-2 text-sm gap-2',
    md: 'min-h-[48px] px-5 py-2.5 text-base gap-2.5',
    lg: 'min-h-[54px] px-6 py-3 text-lg gap-3',
    xl: 'min-h-[62px] px-8 py-4 text-xl gap-3.5',
  };

  const variantStyles = {
    // Warm terracotta/saffron artisan primary
    primary:
      'bg-amber-700 hover:bg-amber-800 text-white focus:ring-amber-600 shadow-amber-900/10',
    // Warm deep forest/slate
    secondary:
      'bg-stone-800 hover:bg-stone-900 text-white focus:ring-stone-700',
    // Warm accent for primary actions like "+ Add Product"
    warm:
      'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500 shadow-orange-900/15',
    // High contrast clean outline
    outline:
      'border-2 border-stone-300 hover:border-stone-400 bg-white text-stone-800 hover:bg-stone-50 focus:ring-stone-400',
    ghost:
      'bg-transparent hover:bg-stone-100 text-stone-700 focus:ring-stone-300 shadow-none',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
