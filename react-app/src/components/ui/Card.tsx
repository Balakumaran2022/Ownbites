import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glass?: boolean;
  padding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  hoverable = false,
  glass = false,
  padding = true,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300',
          {
            'hover:shadow-md hover:-translate-y-1': hoverable,
            'glass': glass,
            'p-4': padding,
          }
        ),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
