import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Sparkles, Cpu, CheckCircle } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
  durationMs?: number; // default ~2600ms for cinematic feel, can be skipped anytime
}

export function Preloader({ onComplete, durationMs = 2800 }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<number>(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [hasCustomVideo, setHasCustomVideo] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user uploaded a video into /preloader.mp4
    const vid = document.createElement('video');
    vid.src = '/preloader.mp4';
    vid.onloadeddata = () => setHasCustomVideo(true);
    vid.onerror = () => setHasCustomVideo(false);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      // Phase control matching the uploaded 3D video sequence
      if (pct < 20) {
        setPhase(1); // Orbit rings sweeping into 3D view
      } else if (pct < 40) {
        setPhase(2); // Iris and eyeball materialization
      } else if (pct < 60) {
        setPhase(3); // Eyelid ribbon arches & star flashes
      } else if (pct < 80) {
        setPhase(4); // Typography "DRishti" drops in
      } else {
        setPhase(5); // Tagline reveals & sheen gleam sweeps across
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(onComplete, 450);
      }
    }, 35);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [durationMs, onComplete]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(onComplete, 200);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-white text-slate-800 transition-opacity duration-500 select-none overflow-hidden cursor-pointer ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #ffffff 60%, #f1f5f9 100%)'
      }}
    >
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between px-6 py-5 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            SIH 2026 • Problem #26038 • MathWorks ResNet-50
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-mono uppercase tracking-wider border border-slate-200 transition-all shadow-2xs hover:scale-105"
        >
          Skip Intro [Esc]
        </button>
      </div>

      {/* Center 3D Logo Stage */}
      <div className="relative flex flex-col items-center justify-center flex-1 max-w-2xl w-full px-6 z-10">
        
        {/* If local video exists, play video; otherwise render interactive 3D SVG choreographed animation */}
        {hasCustomVideo ? (
          <div className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
            <video
              src="/preloader.mp4"
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="relative w-full max-w-md flex flex-col items-center">
            
            {/* Dynamic Ground Perspective Shadow */}
            <div 
              className="absolute -bottom-8 w-72 h-8 rounded-full bg-slate-300/40 blur-xl transition-all duration-700 pointer-events-none"
              style={{
                transform: phase >= 4 ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(10px)',
                opacity: phase >= 1 ? 0.6 : 0
              }}
            />

            {/* 3D Animated Logo Container */}
            <div className="relative w-72 md:w-84 aspect-[8/5] flex items-center justify-center">
              
              {/* Primary 3D Vector SVG with Choreographed Transitions */}
              <svg 
                viewBox="200 80 440 330" 
                className="w-full h-full overflow-visible select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Soft 3D Ground Shadow Filter */}
                  <filter id="pGroundShadow" x="-20%" y="-20%" width="160%" height="160%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                    <feOffset dx="4" dy="14" />
                    <feComponentTransfer><feFuncA type="linear" slope="0.16" /></feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Star Twinkle Filter */}
                  <filter id="pStarFlare" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Gradient for Upper Eyelid Ribbon */}
                  <linearGradient id="pUpperEyelid" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#38bdf8" />
                    <stop offset="40%" stop-color="#0284c7" />
                    <stop offset="85%" stop-color="#0369a1" />
                    <stop offset="100%" stop-color="#1e40af" />
                  </linearGradient>

                  <linearGradient id="pHighlightRidge" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
                    <stop offset="50%" stop-color="#bae6fd" stop-opacity="0.4" />
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
                  </linearGradient>

                  {/* Gradients for Orbit Rings */}
                  <linearGradient id="pOrbitSwoosh" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#0284c7" />
                    <stop offset="30%" stop-color="#38bdf8" />
                    <stop offset="70%" stop-color="#0284c7" />
                    <stop offset="100%" stop-color="#1d4ed8" />
                  </linearGradient>

                  <radialGradient id="pIris" cx="45%" cy="40%" r="55%">
                    <stop offset="0%" stop-color="#7dd3fc" />
                    <stop offset="35%" stop-color="#0ea5e9" />
                    <stop offset="75%" stop-color="#0284c7" />
                    <stop offset="95%" stop-color="#1e3a8a" />
                  </radialGradient>

                  <linearGradient id="pStar" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="30%" stop-color="#7dd3fc" />
                    <stop offset="70%" stop-color="#0284c7" />
                    <stop offset="100%" stop-color="#1d4ed8" />
                  </linearGradient>

                  <linearGradient id="pDR" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#1e3a8a" />
                    <stop offset="60%" stop-color="#172554" />
                    <stop offset="100%" stop-color="#0f172a" />
                  </linearGradient>

                  <linearGradient id="pIshti" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#38bdf8" />
                    <stop offset="40%" stop-color="#0284c7" />
                    <stop offset="100%" stop-color="#0369a1" />
                  </linearGradient>
                </defs>

                <g filter="url(#pGroundShadow)">
                  {/* PHASE 1: Sweeping 3D Orbital Rings */}
                  <g 
                    style={{
                      transformOrigin: '420px 210px',
                      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: phase >= 1 ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-35deg)',
                      opacity: phase >= 1 ? 1 : 0
                    }}
                  >
                    <path 
                      d="M 330 280 C 290 270 270 230 310 190 C 360 140 490 120 550 150 C 575 162 585 185 565 200 C 535 220 460 205 410 220 C 350 240 310 270 335 282 C 350 288 385 282 420 270 C 475 250 515 220 540 190 C 520 215 465 260 380 280 Z"
                      fill="url(#pOrbitSwoosh)"
                    />
                    <path 
                      d="M 320 260 C 305 275 330 290 370 285 C 435 278 505 230 545 180 C 560 160 568 142 575 130 C 568 145 550 180 515 218 C 460 270 380 295 320 260 Z"
                      fill="#0ea5e9"
                    />
                  </g>

                  {/* PHASE 2: Iris & Eyeball Focus */}
                  <g 
                    style={{
                      transformOrigin: '435px 215px',
                      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: phase >= 2 ? 'scale(1)' : 'scale(0)',
                      opacity: phase >= 2 ? 1 : 0
                    }}
                  >
                    <ellipse cx="435" cy="215" rx="52" ry="46" fill="#e0f2fe" opacity="0.35" />
                    <circle cx="435" cy="215" r="40" fill="url(#pIris)" />
                    <circle cx="435" cy="215" r="21" fill="#091428" />
                    {/* Catchlight */}
                    <ellipse cx="445" cy="205" rx="6.5" ry="5" fill="#ffffff" transform="rotate(-25 445 205)" />
                    <circle cx="427" cy="224" r="2.5" fill="#ffffff" opacity="0.7" />
                  </g>

                  {/* PHASE 3: Upper Eyelid Arch & Star Twinkle */}
                  <g 
                    style={{
                      transformOrigin: '435px 170px',
                      transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: phase >= 3 ? 'translateY(0) scale(1)' : 'translateY(-15px) scale(0.9)',
                      opacity: phase >= 3 ? 1 : 0
                    }}
                  >
                    <path 
                      d="M 305 215 C 330 170 400 125 500 140 C 545 148 575 168 580 180 C 570 165 535 140 480 132 C 390 120 325 175 305 215 Z"
                      fill="url(#pUpperEyelid)"
                    />
                    <path 
                      d="M 320 200 C 345 165 405 130 485 135 C 525 138 550 150 565 160 C 545 148 515 137 480 134 C 400 128 340 170 320 200 Z"
                      fill="url(#pHighlightRidge)"
                    />
                    <path 
                      d="M 325 210 C 350 240 420 275 505 230 C 525 220 540 205 545 195 C 530 210 500 238 440 245 C 380 252 338 228 325 210 Z"
                      fill="#0284c7"
                    />
                  </g>

                  {/* Star Twinkle Flash at Top Right */}
                  <g 
                    transform="translate(570, 130)"
                    filter="url(#pStarFlare)"
                    style={{
                      transformOrigin: '570px 130px',
                      transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: phase >= 3 ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-45deg)',
                      opacity: phase >= 3 ? 1 : 0
                    }}
                  >
                    <path 
                      d="M 0 -22 Q 0 0 22 0 Q 0 0 0 22 Q 0 0 -22 0 Q 0 0 0 -22 Z" 
                      fill="url(#pStar)"
                    />
                    <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
                  </g>

                  {/* PHASE 4: 3D Typography "DRishti" */}
                  <g 
                    style={{
                      transformOrigin: '400px 335px',
                      transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      transform: phase >= 4 ? 'translateY(0)' : 'translateY(20px)',
                      opacity: phase >= 4 ? 1 : 0
                    }}
                  >
                    <text 
                      x="330" 
                      y="345" 
                      font-family="system-ui, -apple-system, sans-serif" 
                      font-size="60" 
                      font-weight="900" 
                      letter-spacing="-1.5"
                      fill="url(#pDR)"
                    >
                      DR
                    </text>
                    <text 
                      x="425" 
                      y="345" 
                      font-family="system-ui, -apple-system, sans-serif" 
                      font-size="60" 
                      font-weight="700" 
                      letter-spacing="-1"
                      fill="url(#pIshti)"
                    >
                      ishti
                    </text>
                  </g>

                  {/* PHASE 5: Tagline Reveal */}
                  <g 
                    transform="translate(400, 375)"
                    style={{
                      transition: 'all 0.5s ease-out',
                      opacity: phase >= 5 ? 1 : 0,
                      transform: phase >= 5 ? 'translateY(0)' : 'translateY(10px)'
                    }}
                  >
                    <line 
                      x1={phase >= 5 ? "-150" : "-100"} 
                      y1="-4" 
                      x2="-115" 
                      y2="-4" 
                      stroke="#0284c7" 
                      stroke-width="2.5" 
                      stroke-linecap="round"
                      style={{ transition: 'all 0.5s ease-out' }}
                    />
                    <text 
                      x="0" 
                      y="0" 
                      text-anchor="middle"
                      font-family="system-ui, -apple-system, sans-serif" 
                      font-size="11" 
                      font-weight="800" 
                      letter-spacing="2.8"
                      fill="#1e3a8a"
                    >
                      INSIGHTS FOR A BETTER TOMORROW
                    </text>
                    <line 
                      x1="115" 
                      y1="-4" 
                      x2={phase >= 5 ? "150" : "100"} 
                      y2="-4" 
                      stroke="#0284c7" 
                      stroke-width="2.5" 
                      stroke-linecap="round"
                      style={{ transition: 'all 0.5s ease-out' }}
                    />
                  </g>
                </g>
              </svg>

              {/* Diagonal Light Sheen (Specular Glass Pass) */}
              {phase >= 5 && (
                <div 
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  style={{
                    background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.7) 45%, rgba(56,189,248,0.3) 50%, transparent 60%)',
                    animation: 'sheen 1.2s ease-in-out forwards'
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Clinical Initialization Status & Progress Bar */}
        <div className="w-full max-w-sm mt-8 space-y-2.5">
          <div className="w-full bg-slate-100 rounded-full h-2 p-0.5 border border-slate-200 shadow-inner overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 h-full rounded-full transition-all duration-75 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span className="truncate pr-2 font-medium">
              {progress < 25 && "INITIALIZING MATHWORKS RESNET-50 KERNEL..."}
              {progress >= 25 && progress < 50 && "CALIBRATING ADAPTIVE RETINAL LENS & CLAHE..."}
              {progress >= 50 && progress < 75 && "ESTABLISHING REAL-TIME P2P SYNC..."}
              {progress >= 75 && progress < 100 && "AI CARE & ADVISOR ONLINE (LLAMA 3.2 EDGE)..."}
              {progress === 100 && "DRISHTI CLINICAL DESK READY"}
            </span>
            <span className="font-bold text-sky-700">{progress}%</span>
          </div>
        </div>

      </div>

      {/* Bottom Footer Telemetry */}
      <div className="w-full flex items-center justify-center gap-4 py-4 text-[11px] text-slate-400 font-medium shrink-0 z-20 border-t border-slate-100 bg-white/80">
        <span className="flex items-center gap-1.5 text-slate-600">
          <Cpu className="w-3.5 h-3.5 text-sky-600" />
          MathWorks SIH #26038
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1.5 text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Real-time Multi-Screen
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1.5 text-slate-600">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Offline Edge AI
        </span>
      </div>

      <style>{`
        @keyframes sheen {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
}
