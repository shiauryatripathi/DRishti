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
  variant = 'full',
  showTagline = true,
}: DrishtiLogoProps) {
  // Dimensions helper
  const sizeStyles = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-24 h-20',
    lg: 'w-48 h-36',
    xl: 'w-72 h-52',
    custom: '',
  };

  if (variant === 'mark') {
    return (
      <svg
        viewBox="260 100 360 230"
        className={`select-none ${size !== 'custom' ? sizeStyles[size] : ''} ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Filters & Gradients */}
          <filter id="markShadow" x="-20%" y="-20%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feOffset dx="2" dy="8" />
            <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="mUpperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="40%" stop-color="#0284c7" />
            <stop offset="80%" stop-color="#0369a1" />
            <stop offset="100%" stop-color="#1e40af" />
          </linearGradient>

          <linearGradient id="mUpperHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
            <stop offset="50%" stop-color="#bae6fd" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>

          <linearGradient id="mOrbitGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#0284c7" />
            <stop offset="30%" stop-color="#38bdf8" />
            <stop offset="70%" stop-color="#0284c7" />
            <stop offset="100%" stop-color="#1d4ed8" />
          </linearGradient>

          <radialGradient id="mIrisGrad" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stop-color="#7dd3fc" />
            <stop offset="35%" stop-color="#0ea5e9" />
            <stop offset="75%" stop-color="#0284c7" />
            <stop offset="95%" stop-color="#1e3a8a" />
          </radialGradient>

          <linearGradient id="mStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="30%" stop-color="#7dd3fc" />
            <stop offset="70%" stop-color="#0284c7" />
            <stop offset="100%" stop-color="#1d4ed8" />
          </linearGradient>
        </defs>

        <g filter="url(#markShadow)">
          {/* Sweeping Orbital Ring */}
          <path
            d="M 330 280 C 290 270 270 230 310 190 C 360 140 490 120 550 150 C 575 162 585 185 565 200 C 535 220 460 205 410 220 C 350 240 310 270 335 282 C 350 288 385 282 420 270 C 475 250 515 220 540 190 C 520 215 465 260 380 280 Z"
            fill="url(#mOrbitGrad)"
          />

          <path
            d="M 320 260 C 305 275 330 290 370 285 C 435 278 505 230 545 180 C 560 160 568 142 575 130 C 568 145 550 180 515 218 C 460 270 380 295 320 260 Z"
            fill="#0ea5e9"
          />

          {/* Upper Eyelid Arch Ribbon */}
          <path
            d="M 305 215 C 330 170 400 125 500 140 C 545 148 575 168 580 180 C 570 165 535 140 480 132 C 390 120 325 175 305 215 Z"
            fill="url(#mUpperGrad)"
          />
          <path
            d="M 320 200 C 345 165 405 130 485 135 C 525 138 550 150 565 160 C 545 148 515 137 480 134 C 400 128 340 170 320 200 Z"
            fill="url(#mUpperHighlight)"
          />

          {/* Central 3D Eyeball */}
          <ellipse cx="435" cy="215" rx="55" ry="50" fill="#f0f9ff" opacity="0.3" />
          <circle cx="435" cy="215" r="42" fill="url(#mIrisGrad)" />
          <circle cx="435" cy="215" r="22" fill="#091428" />
          {/* Catchlight */}
          <ellipse cx="446" cy="204" rx="7" ry="5.5" fill="#ffffff" transform="rotate(-25 446 204)" />
          <circle cx="426" cy="225" r="2.8" fill="#ffffff" opacity="0.65" />

          {/* Sparkle Star */}
          <g transform="translate(570, 130)">
            <path
              d="M 0 -22 Q 0 0 22 0 Q 0 0 0 22 Q 0 0 -22 0 Q 0 0 0 -22 Z"
              fill="url(#mStarGrad)"
            />
            <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
          </g>
        </g>
      </svg>
    );
  }

  // Full 3D Logo (with DRishti typography & tagline)
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <img
        src="/logo.svg"
        alt="DRishti - Insights For A Better Tomorrow"
        className={`object-contain transition-transform duration-300 drop-shadow-md ${
          size !== 'custom' ? sizeStyles[size] : ''
        }`}
      />
    </div>
  );
}
