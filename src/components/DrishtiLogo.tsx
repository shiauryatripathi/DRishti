import React, { useState } from 'react';

interface DrishtiLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  variant?: 'dark' | 'light' | 'full' | 'mark' | 'icon' | string;
  alt?: string;
}

/**
 * Universal DRishti Brand Logo
 * Guarantees that logo assets are ALWAYS loaded from the /public directory (/logo.svg or /logo.png or /favicon.png)
 * Never uses hardcoded inline SVGs.
 */
export function DrishtiLogo({
  className = '',
  size = 'md',
  variant = 'full',
  alt = 'DRishti Tele-Ophthalmology Logo',
}: DrishtiLogoProps) {
  // Always resolves from the public/ folder
  const initialSource = variant === 'icon' || variant === 'mark' ? '/logo.png' : '/logo.svg';
  const [currentSrc, setCurrentSrc] = useState<string>(initialSource);
  const [hasError, setHasError] = useState(false);

  const sizeStyles: Record<string, string> = {
    xs: 'h-6 w-auto',
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-16 w-auto max-w-[280px]',
    xl: 'h-24 w-auto max-w-[360px]',
    custom: '',
  };

  const handleImageError = () => {
    // Fallback order strictly within the public folder:
    // /logo.svg -> /logo.png -> /favicon.png
    if (currentSrc === '/logo.svg') {
      setCurrentSrc('/logo.png');
    } else if (currentSrc === '/logo.png') {
      setCurrentSrc('/favicon.png');
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`flex items-center gap-2 font-black text-slate-800 tracking-tight select-none ${size !== 'custom' ? sizeStyles[size] || sizeStyles.md : ''} ${className}`}>
        <span className="text-sky-600">👁️</span>
        <span className="font-bold">DRishti</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleImageError}
      className={`object-contain select-none transition-transform duration-200 ${
        size !== 'custom' ? sizeStyles[size] || sizeStyles.md : ''
      } ${className}`}
    />
  );
}
