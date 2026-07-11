import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={twMerge(
        clsx(
          'flex items-center justify-center rounded-xl font-medium transition-all duration-300 ease-in-out px-4 py-2',
          {
            'bg-primary text-white hover:bg-orange-600 shadow-md hover:shadow-lg': variant === 'primary',
            'bg-secondary text-white hover:bg-gray-800 shadow-md hover:shadow-lg': variant === 'secondary',
            'border-2 border-primary text-primary hover:bg-orange-50': variant === 'outline',
            'text-secondary hover:bg-gray-100': variant === 'ghost',
            'w-full': fullWidth,
            'opacity-50 cursor-not-allowed': disabled || loading,
          }
        ),
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
