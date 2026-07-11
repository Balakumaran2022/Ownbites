import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SkeletonLoaderProps {
  type?: 'rect' | 'circle';
  widthClass?: string;
  heightClass?: string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'rect',
  widthClass = 'w-full',
  heightClass = 'h-4',
  className,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse bg-gray-200',
          type === 'circle' ? 'rounded-full' : 'rounded-lg',
          widthClass,
          heightClass
        ),
        className
      )}
    />
  );
};
