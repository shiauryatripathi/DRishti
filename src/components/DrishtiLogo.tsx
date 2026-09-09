import React from 'react';

interface DrishtiLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  variant?: 'full' | 'mark' | 'horizontal';
  showTagline?: boolean;
}

export function DrishtiLogo({
  className = '',
  size = 'md',
}: DrishtiLogoProps) {
  const sizeStyles = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-24 h-20',
    lg: 'w-56 h-32',
    xl: 'w-72 h-48',
    custom: '',
  };

  return (
    <div className={`flex items-center justify-center select-none ${size !== 'custom' ? sizeStyles[size] : ''} ${className}`}>
      <img
        src="/logo.png"
        alt="DRishti Logo"
        className="w-full h-full object-contain filter drop-shadow-sm"
        onError={(e) => {
          // Fallback to SVG if png not found
          const target = e.currentTarget;
          if (target.src.endsWith('.png')) {
            target.src = '/logo.svg';
          }
        }}
      />
    </div>
  );
}
