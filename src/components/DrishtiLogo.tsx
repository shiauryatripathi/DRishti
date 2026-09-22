import React from 'react';

interface DrishtiLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  variant?: 'dark' | 'light' | 'full' | 'mark' | string;
}

export function DrishtiLogo({
  className = '',
  size = 'md',
  variant = 'dark',
}: DrishtiLogoProps) {
  const sizeStyles = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    custom: '',
  };

  return (
    <div className={`relative flex-shrink-0 flex items-center justify-center select-none ${size !== 'custom' ? sizeStyles[size] : ''} ${className}`}>
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full drop-shadow-xs transition-transform duration-200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="drishtiOrbitGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="60%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id="drishtiIrisGrad" x1="60" y1="60" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B1B3D" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        {/* Upper Dynamic Orbit with Sparkle */}
        <path d="M 68 44 C 110 32 152 48 165 72 C 172 85 168 100 156 116" stroke="url(#drishtiOrbitGrad)" strokeWidth="8" strokeLinecap="round" />
        {/* 4-pointed Sparkle Star */}
        <path d="M 148 48 Q 148 34 148 34 Q 148 48 162 48 Q 148 48 148 62 Q 148 48 134 48 Q 148 48 148 34" fill="#0284C7" />
        {/* Lower Orbit Loop */}
        <path d="M 62 135 C 55 146 62 158 84 158 C 118 158 152 134 168 108" stroke="url(#drishtiOrbitGrad)" strokeWidth="8" strokeLinecap="round" />
        {/* Eyelid Contours */}
        <path d="M 52 104 C 74 68 126 68 148 104" stroke="#0B1B3D" strokeWidth="9" strokeLinecap="round" />
        <path d="M 52 104 C 74 136 126 136 148 104" stroke="#0B1B3D" strokeWidth="9" strokeLinecap="round" />
        {/* Iris & Pupil */}
        <circle cx="100" cy="103" r="28" fill="url(#drishtiIrisGrad)" />
        <circle cx="100" cy="103" r="16" fill="#0A1128" />
        {/* Reflection Light Catch */}
        <circle cx="108" cy="95" r="5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
